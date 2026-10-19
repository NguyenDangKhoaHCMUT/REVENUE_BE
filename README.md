# REVENUE_BE

Node.js backend built with NestJS, TypeORM, and PostgreSQL, providing dashboard data, admin authentication, and batch data updates.

## Requirements

- Node.js **24.x LTS** with bundled npm, installed using the [official Node.js instructions](https://nodejs.org/en/download).
- Docker with the `docker compose` command, installed using the [official Docker instructions](https://docs.docker.com/compose/install/) for your operating system. Docker must be running.
- PostgreSQL **17**, provided through `docker-compose.yml`.
- Place the **provided `.env` file** in this directory before running Docker, migrations, seeding, or the application.

## Initial setup

Run the following commands from the directory containing this README:

```bash
npm ci
npm run db:up
```

Wait until PostgreSQL is ready, then run these commands in order:

```bash
npm run migration:run
npm run seed
npm run start:dev
```

The backend runs at **http://localhost:5000** by default; PostgreSQL uses port **5432** by default. Start the frontend in a separate terminal to access the dashboard and admin login.

Build and run the production version:

```bash
npm run build
npm run start:prod
```

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Run in development mode with automatic restarts on code changes |
| `npm run migration:run` | Apply pending migrations |
| `npm run seed` | Create the admin account if it does not already exist |
| `npm run lint` | Check the source code |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests; requires the environment file, database, and migrated schema |
| `npm run db:down` | Stop and remove the PostgreSQL container while preserving the data volume |
 |

## Project structure

```text
src/
  auth/          Admin login and profile
  admin/         Controllers, services, and DTOs for the two batch APIs
  dashboard/     Public read API
  metrics/       Daily metrics entity
  events/        Event entity
  common/        JWT guard and numeric conversion
  migrations/    Initial schema and schema changes
  data-source.ts TypeORM CLI configuration
  seed.ts        Admin account seeding
  main.ts        Application bootstrap
test/            E2E tests
docker-compose.yml
```
