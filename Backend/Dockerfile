FROM node:24-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "src/index.js"]