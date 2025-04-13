# Dockerfile for Razorpay MCP Server

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Make sure the entry point scripts are executable
RUN chmod +x ./dist/transports/stdio.cjs ./dist/transports/sse.cjs

# Expose port for SSE server
EXPOSE 3001

# Default command (can be overridden)
CMD ["node", "dist/transports/stdio.cjs", "--help"] 