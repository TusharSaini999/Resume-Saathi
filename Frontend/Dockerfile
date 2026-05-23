FROM node:24 AS build

ARG VITE_SERVER_URL

WORKDIR /app/frontend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# If a build-time VITE_SERVER_URL is provided, write it into a .env file
RUN if [ -n "$VITE_SERVER_URL" ]; then printf "VITE_SERVER_URL=%s\n" "$VITE_SERVER_URL" > .env; fi

# Build frontend
RUN npm run build

# Production server
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]