# Use a lightweight Node.js image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose the application port
EXPOSE 5000

# Set environment variables (optional)
ENV NODE_ENV=production
ENV PORT=5000

# Start the backend server
CMD ["npm", "start"]