FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build:test

# STAGE 2
FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]