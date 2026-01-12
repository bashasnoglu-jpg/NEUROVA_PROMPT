# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including http-server)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8000 to the outside world
EXPOSE 8000

# Start the application binding to 0.0.0.0 (required for Docker)
CMD ["npx", "http-server", ".", "-a", "0.0.0.0", "-p", "8000"]