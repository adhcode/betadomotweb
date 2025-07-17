# Railway-optimized Dockerfile for Go backend
FROM golang:1.23-alpine

WORKDIR /app

# Copy go mod files from backend directory
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source code
COPY backend/ ./

# Build the application
RUN go build -o main .

# Expose the port Railway expects
EXPOSE $PORT

# Run the application
CMD ["./main"]