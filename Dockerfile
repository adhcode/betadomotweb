# Railway-optimized Dockerfile for Go backend
FROM golang:1.23-alpine

WORKDIR /app

# Copy the entire repository
COPY . .

# List files to debug
RUN ls -la

# Download dependencies
RUN go mod download

# Build the application
RUN go build -o main .

# Expose the port Railway expects
EXPOSE $PORT

# Run the application
CMD ["./main"]