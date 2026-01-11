# Production Dockerfile for NestJS API
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY apps/api ./apps/api
COPY libs ./libs

# Build application
RUN npm run build:api

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production --legacy-peer-deps

# Copy built application
COPY --from=builder /app/dist/apps/api ./dist

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
