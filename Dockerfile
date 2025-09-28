# Use Node.js LTS for building
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files & install deps
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the Vite project
RUN npm run build

# -----------------------
# Production image
# -----------------------
FROM nginx:alpine

# Copy built files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
