# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Node.js Backend & Serve Frontend
FROM node:20-alpine
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend static files from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port (Cloud Run sets PORT env variable, defaulting to 8080 usually)
ENV PORT 8080
EXPOSE 8080

# Start the server
WORKDIR /app/backend
CMD ["node", "src/index.js"]
