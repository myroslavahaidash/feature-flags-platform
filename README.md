# Feature Flags Platform

A portfolio project for managing boolean feature flags per environment. The application uses Next.js, TypeScript, PostgreSQL, raw SQL, and Tailwind CSS.

## Prerequisites

- Node.js and npm
- Docker with Docker Compose

## Local setup

Install the application dependencies:

```bash
npm install
```

Start PostgreSQL and pgAdmin:

```bash
docker compose up -d
```

Apply the migrations in numeric order. Each migration should be applied once:

```bash
for migration in migrations/*.sql; do
  docker exec -i feature-flags-postgres \
    psql -v ON_ERROR_STOP=1 \
    -U feature_flags_user \
    -d feature_flags \
    < "$migration"
done
```

Seed the predefined project, environments, feature flags, and configurations. The seed is intended to be run once against a fresh database:

```bash
docker exec -i feature-flags-postgres \
  psql -v ON_ERROR_STOP=1 \
  -U feature_flags_user \
  -d feature_flags \
  < seeds/001_feature_flags_demo.sql
```

Create the local environment file from the committed example:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to the projects screen.

## Verify the seed

The seed creates one project, three environments, four flags, and twelve environment-specific configurations. To inspect them:

```bash
docker exec feature-flags-postgres \
  psql \
  -U feature_flags_user \
  -d feature_flags \
  -c "SELECT ff.key AS flag, e.key AS environment, ffc.value FROM feature_flag_configurations AS ffc JOIN feature_flags AS ff ON ff.id = ffc.feature_flag_id JOIN environments AS e ON e.id = ffc.environment_id ORDER BY ff.key, e.display_order;"
```

## Database files

- `migrations/` contains schema changes and must be applied in numeric order.
- `seeds/` contains development data applied after all migrations.
- `.env.local` contains local credentials and is intentionally not committed.
- `.env.example` documents the expected local connection string.
