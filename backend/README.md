# Starting Up

1. You can start the backend using both docker-compose and npm.
2. One might choose to spin docker-compose if supporting services are needed, such as dynamodb, cognito, and others.
3. One might choose to spin npm if only the backend is needed.
4. Or, a combination of both - where the services are started with docker-compose and the backend is started with npm.

## Docker Compose

```bash
docker compose up backend
```

## NPM

```bash
npm run dev
```

# Tests

1. The tests are divided into two categories: unit and integration.
2. The unit tests aren't dependent on any external services and can be invoked using: `npm run test:unit`.
3. The integration tests are dependent on external services and must be invoked using docker: `docker compose run backend test:integration`. We facilitate passing command to the boot-up script. Check `backend/entrypoint.sh` for more details.
4. When starting up you might notice two folders created on root:
    - `.cognito-local`: This is the local cognito database. It is deliberately committed since it has test user information which is used by the integration tests.
    - `volume`: This is created by [localstack](https://www.localstack.cloud/). Think of it as an emulated AWS environment. It must not be committed and the tests should enrich the data themselves if needed. Of course, the test step should also clean up after itself.