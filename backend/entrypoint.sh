#!/bin/sh
if [ "$1" = "test:integration" ]; then
  npm run test:integration
else
  # Your normal server startup command
  npm start
fi