#!/bin/bash

# NoteHub Quick Start Script for Linux/Mac

echo ""
echo "========================================"
echo "    NoteHub Database & Backend Setup"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "[1/4] Checking Docker and Docker Compose..."
docker --version
docker-compose --version
echo "✓ Docker and Docker Compose are ready"

echo ""
echo "[2/4] Building Docker images and starting services..."
docker-compose up --build -d

echo ""
echo "[3/4] Waiting for services to start..."
sleep 10

echo ""
echo "[4/4] Verifying services..."

if docker-compose ps | grep -q "postgres.*Up"; then
    echo "✓ PostgreSQL is running"
else
    echo "ERROR: PostgreSQL service failed to start"
    docker-compose logs postgres
    exit 1
fi

if docker-compose ps | grep -q "backend.*Up"; then
    echo "✓ Backend is running"
else
    echo "ERROR: Backend service failed to start"
    docker-compose logs backend
    exit 1
fi

echo ""
echo "========================================"
echo "    Services are Ready!"
echo "========================================"
echo ""
echo "Database:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: notehub_database"
echo "  Username: notehub_user"
echo "  Password: notehub_password_123"
echo ""
echo "Backend API:"
echo "  URL: http://localhost:5000"
echo "  Health: http://localhost:5000/health"
echo "  Notes: http://localhost:5000/api/notes"
echo ""
echo "React App Configuration:"
echo "  Add to .env: REACT_APP_API_URL=http://localhost:5000/api"
echo ""
echo "Useful Commands:"
echo "  docker-compose ps          - Show running services"
echo "  docker-compose logs -f     - View live logs"
echo "  docker-compose down        - Stop all services"
echo "  docker-compose down -v     - Stop and remove volumes (resets DB)"
echo ""
echo "Documentation:"
echo "  See DATABASE_SETUP.md for detailed information"
echo ""
