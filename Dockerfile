FROM node:18-slim

WORKDIR /usr/src/app

# Install OpenSSL and other required dependencies
RUN apt-get update \
    && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]