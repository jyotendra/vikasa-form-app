#!/bin/bash

# Local environment setup
export AWS_ACCESS_KEY_ID=123
export AWS_SECRET_ACCESS_KEY=123
export AWS_ENDPOINT_URL=http://localhost:9229

# these value are coming from the one-time setup script: backend/scripts/setup-cognito.ts
POOL_NAME="test-user-pool" 
CLIENT_NAME="test-client" 

echo "Searching for existing user pool..."

# Find user pool ID by name
USER_POOL_ID=$(aws cognito-idp list-user-pools \
  --max-results 1 \
  --endpoint $AWS_ENDPOINT_URL \
  --query "UserPools[?Name=='$POOL_NAME'].Id | [0]" \
  --output text)

if [ -z "$USER_POOL_ID" ] || [ "$USER_POOL_ID" == "None" ]; then
  echo "❌ User pool '$POOL_NAME' not found"
  exit 1
fi

echo "✓ Found User Pool ID: $USER_POOL_ID"

# Find client ID by name
CLIENT_ID=$(aws cognito-idp list-user-pool-clients \
  --endpoint $AWS_ENDPOINT_URL \
  --user-pool-id $USER_POOL_ID \
  --query "UserPoolClients[?ClientName=='$CLIENT_NAME'].ClientId" \
  --output text)

if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" == "None" ]; then
  echo "❌ Client '$CLIENT_NAME' not found in user pool"
  exit 1
fi

echo "✓ Found Client ID: $CLIENT_ID"

echo ""
echo "=== Existing Setup ==="
echo "User Pool ID: $USER_POOL_ID"
echo "Client ID: $CLIENT_ID"
echo "Pool Name: $POOL_NAME"
echo "Client Name: $CLIENT_NAME"