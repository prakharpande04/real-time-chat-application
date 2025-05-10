FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Use environment variable for port
ENV PORT=5000
EXPOSE 5000

# Run application
CMD ["npm", "run", "dev"]
