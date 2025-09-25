#!/bin/bash

APP_CONTAINER="finance-management-hono-backend"


echo "🚀 Starting deployment for $APP_CONTAINER ..."

# Stop old containers
docker-compose -p $APP_CONTAINER down -v

# Build & start
docker-compose -p $APP_CONTAINER up -d --build

# Wait for DB to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client
docker exec $APP_CONTAINER bunx prisma generate      

# Reset & apply migration (⚠️ dev only, data will be dropped)
docker exec $APP_CONTAINER bunx prisma migrate reset --force
docker exec $APP_CONTAINER bunx prisma migrate dev --name init

echo "✅ Deployment complete!"
