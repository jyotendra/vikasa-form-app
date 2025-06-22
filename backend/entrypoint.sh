#!/bin/sh
if [ "$1" = "test:integration" ]; then
  npm run test:integration
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode"
  npm run dev
else
  # Your normal server startup command
  npm start
fi