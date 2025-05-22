#!/bin/sh
echo "⏳ Waiting for db ready..."

until pg_isready -h pg -p 5432 -U docker > /dev/null 2>&1; do
  sleep 1
done

echo "✅ DB is ready. Executing migrations..."

pnpm db:migrate