# To Run Integration Test

```bash
docker compose run backend test:integration
```

# Troubleshooting

1. If you see a TypeError emanating from the plugin, check if the plugin defintions are updated inside `backend/test/helper.ts`. They must always be updated.
2. Each test run might update: `.cognito-local/db/local_1keBLzQp.json`. This is expected. It might update the refresh token, which you can ignore. 