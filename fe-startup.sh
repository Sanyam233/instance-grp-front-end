#! /bin/bash

# Update package list and install Docker
apt-get update
apt-get install -y docker.io

# Add the user to the docker group (replace 'your-username' with the desired user, e.g., 'ubuntu')
usermod -aG docker $USER

# Restart Docker service
systemctl start docker
systemctl enable docker

# Log for debugging
echo "Docker installed and $USER added to the docker group." >> /var/log/startup-script.log

# Re-enable group membership without logging out
newgrp docker

# Authenticate Docker to use GCR
gcloud auth configure-docker --quiet

# Get Docker image name from metadata
IMAGE=$(curl -s "http://metadata.google.internal/computeMetadata/v1/instance/attributes/docker-image" -H "Metadata-Flavor: Google")

# Check if the image is empty
if [ -z "$IMAGE" ]; then
  echo "ERROR: Docker image not provided in metadata." >> /var/log/startup-script.log
  exit 1
fi

# Log the image name for debugging
echo "Using Docker image: $IMAGE" >> /var/log/startup-script.log

# Authenticate Docker to use GCR
# gcloud auth configure-docker --quiet

# Pull the Docker image
docker pull "$IMAGE" || { echo "ERROR: Failed to pull Docker image." >> /var/log/startup-script.log; exit 1; }

# Stop any existing container
docker stop web-app || true
docker rm web-app || true

# Run the container
docker run -d --name web-app -p 80:80 "$IMAGE" || { echo "ERROR: Failed to run Docker container." >> /var/log/startup-script.log; exit 1; }