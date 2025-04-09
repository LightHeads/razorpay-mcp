# Dockerfile

# ---- Builder Stage ----
# Use a Node.js version that matches your development environment
FROM node:20 AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies (including devDependencies for build)
# Use pnpm if that's your package manager
COPY package.json pnpm-lock.yaml ./
# COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# Prune devDependencies for the runtime stage
RUN pnpm prune --production
# If using pnpm, handle production dependencies appropriately if needed

# ---- Runtime Stage ----
# Use a lightweight Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy only the built code and production dependencies from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the default SSE port (optional, but good practice)
EXPOSE 3000

# Set the user for better security (optional, requires user exists in alpine)
# USER node

# Define the entrypoint command to run the server
# This allows users to specify 'stdio' or 'sse' and pass args
# Default to 'stdio' if no command is given
CMD ["node", "dist/stdio.js"] 