# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN yarn install --production=true && yarn cache clean

# Run the app
CMD ["yarn", "start"]
