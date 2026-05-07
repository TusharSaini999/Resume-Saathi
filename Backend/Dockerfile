FROM node:22-alpine

WORKDIR /app/backend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Production mode
ENV NODE_ENV=production

# Backend port
EXPOSE 5000

# Start server
CMD ["node", "./src/index.js"]