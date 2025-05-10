# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# working directory
WORKDIR /usr/share/nginx/html

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy a custom NGINX configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port NGINX will listen on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]