FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

# Install supergateway globally
RUN npm install -g supergateway
ENV NODE_ENV=production
# Copy package files from the builder (or host, but builder ensures consistency)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy the built application from the builder stage
# Assuming the build output is in the 'dist' directory
COPY --from=builder /app/dist ./dist


# Expose the port Supergateway will listen on
EXPOSE 8080

CMD ["sh", "-c", "npx -y supergateway --stdio \"node dist/index.js\" --port ${PORT:-8080} --oauth2Bearer \"$BEARER_TOKEN\" --healthEndpoint /healthz --cors --logLevel info"]