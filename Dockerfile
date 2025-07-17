# Railway-optimized Dockerfile for Go backend
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy the entire repository
COPY . .

# List files to debug
RUN ls -la
RUN ls -la backend

# Change to the backend directory and build
WORKDIR /app/backend

# List files to debug
RUN ls -la
RUN ls -la *.go || echo "No Go files found"

# Download dependencies
RUN go mod download

# Build the application
RUN go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/backend/main .

# Expose the port Railway expects
EXPOSE $PORT

# Run the application
CMD ["./main"]