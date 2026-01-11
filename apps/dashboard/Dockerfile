# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY apps/dashboard ./apps/dashboard
COPY libs ./libs

# Build application
RUN npm run build:dashboard -- --configuration=production

# Production stage with Nginx
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist/apps/dashboard /usr/share/nginx/html

# Copy nginx configuration
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
