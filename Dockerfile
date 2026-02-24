FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Install supergateway globally
RUN npm install -g supergateway

EXPOSE 8080

CMD ["supergateway", "--stdio", "node dist/index.js", "--port", "8080", "--bearerToken", "YOUR_SECRET_TOKEN"]