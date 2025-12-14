# Stage 1: Build
FROM golang:alpine AS builder

# Install git.
# Git is required for fetching Go dependencies.
RUN apk add --no-cache git

WORKDIR /app

# Download dependencies first (cached layers)
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
# -ldflags="-w -s" shrinks the binary by stripping debug information
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main ./cmd/api

# Stage 2: Run
FROM alpine:latest

# Security: Install CA certificates for HTTPS calls
RUN apk --no-cache add ca-certificates

# Security: Create a non-root user
# Running as root inside a container is a security risk.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Use a neutral working directory (not /root)
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Ensure the binary is owned by the non-root user
RUN chown appuser:appgroup main

# NOTE: Removed .env copy for security. 
# Pass variables via 'docker run -e KEY=VAL' or docker-compose.

# Switch to non-root user
USER appuser

# Expose API port
EXPOSE 8080

# Run
CMD ["./main"]