# Configuration Service — Initial Web API Specifications

## Instructions

I would like you to create a prompt for this specs file. The prompt should include instructions on what needs to be created for this spec file requirements to be met. If you need to ask me any follow up questions before creating the prompt then do so. Do not guesses. You may link to this document as part of the prompt if it will minimise token usage. This project should be built inside `src/projects/ai-course/module1/src`

## Key Decisions

1. **Language:** TypeScript for both the backend and frontend.
2. **Backend:** Node.js with Fastify.
3. **Frontend:** React with Vite and Material UI (MUI).
4. **Database:** PostgreSQL, using the existing local database during development.
5. **Data access:** Prisma ORM and Prisma Client.
6. **Migrations:** Prisma Migrate; all schema changes will be committed as migration files.
7. **API style:** JSON REST API with routes under `/api/v1`.
8. **Validation:** Fastify JSON schemas with TypeBox.
9. **Testing:** Vitest, Fastify `inject()`, and React Testing Library.
10. **Initial scope:** CRUD operations for applications and their configuration values. Authentication and feature flags are not included yet.

## Main Dependencies

### Backend

- `fastify`
- `@fastify/cors`
- `@fastify/env`
- `@fastify/sensible`
- `@fastify/swagger`
- `@fastify/swagger-ui`
- `@fastify/type-provider-typebox`
- `@sinclair/typebox`
- `prisma`
- `@prisma/client`
- `vitest`

### Frontend

- `react`
- `react-dom`
- `vite`
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`
- `react-router-dom`
- `@tanstack/react-query`
- `vitest`
- `@testing-library/react`

## Database and Data Model

### `applications` table

| Column        | Type      | Rules                 |
| ------------- | --------- | --------------------- |
| `id`          | UUID      | Primary key           |
| `name`        | String    | Required and unique   |
| `description` | String    | Optional              |
| `created_at`  | Timestamp | Created automatically |
| `updated_at`  | Timestamp | Updated automatically |

### `configurations` table

| Column           | Type      | Rules                            |
| ---------------- | --------- | -------------------------------- |
| `id`             | UUID      | Primary key                      |
| `application_id` | UUID      | Foreign key to `applications.id` |
| `key`            | String    | Required                         |
| `value`          | JSONB     | Required                         |
| `description`    | String    | Optional                         |
| `created_at`     | Timestamp | Created automatically            |
| `updated_at`     | Timestamp | Updated automatically            |

The combination of `application_id` and `key` must be unique. Deleting an application should also delete its configuration records.

A future `flags` table will have an `application_id` foreign key to `applications.id`. Feature flags will remain separate from normal configuration values so they can later support fields such as `enabled`, rollout rules, targeting rules, and variants.

## API Endpoints

### Health check

- `GET /health`

Response:

```json
{
  "status": "ok"
}
```

### Applications

- `POST /api/v1/applications` — create an application
- `GET /api/v1/applications` — list applications
- `GET /api/v1/applications/:applicationId` — get one application
- `PATCH /api/v1/applications/:applicationId` — update an application
- `DELETE /api/v1/applications/:applicationId` — delete an application

Create request:

```json
{
  "name": "customer-portal",
  "description": "Customer-facing web application"
}
```

Application response:

```json
{
  "id": "5db71fa0-4c42-4d94-ae83-68975f4fcb44",
  "name": "customer-portal",
  "description": "Customer-facing web application",
  "createdAt": "2026-07-21T02:00:00.000Z",
  "updatedAt": "2026-07-21T02:00:00.000Z"
}
```

List response:

```json
{
  "items": []
}
```

### Configuration values

- `POST /api/v1/applications/:applicationId/configurations` — create a configuration value
- `GET /api/v1/applications/:applicationId/configurations` — list configuration values
- `GET /api/v1/applications/:applicationId/configurations/:configurationId` — get one configuration value
- `PATCH /api/v1/applications/:applicationId/configurations/:configurationId` — update a configuration value
- `DELETE /api/v1/applications/:applicationId/configurations/:configurationId` — delete a configuration value

Create request:

```json
{
  "key": "support.contact",
  "value": {
    "email": "support@example.com"
  },
  "description": "Support contact details"
}
```

Configuration response:

```json
{
  "id": "5ad91a19-8ced-4e43-9816-caa1287e0d47",
  "applicationId": "5db71fa0-4c42-4d94-ae83-68975f4fcb44",
  "key": "support.contact",
  "value": {
    "email": "support@example.com"
  },
  "description": "Support contact details",
  "createdAt": "2026-07-21T02:05:00.000Z",
  "updatedAt": "2026-07-21T02:05:00.000Z"
}
```

## Error Shape

All API errors will use a consistent structure:

```json
{
  "error": {
    "code": "APPLICATION_NOT_FOUND",
    "message": "Application was not found"
  }
}
```

Expected status codes include:

- `200` for successful reads and updates
- `201` for successful creates
- `204` for successful deletes
- `400` for invalid input
- `404` for missing resources
- `409` for duplicate application names or configuration keys

## Data Access and Migrations

Route handlers will call service functions, and service functions will use Prisma Client. Direct SQL will be avoided unless Prisma cannot express a required query cleanly.

Migration commands:

```bash
npx prisma migrate dev
npx prisma migrate deploy
npx prisma generate
```

The PostgreSQL connection will be supplied through an environment variable:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/config_service?schema=public"
```

The real `.env` file will not be committed to source control.

## Testing Approach

### Backend

- Use Vitest for unit and integration tests.
- Test Fastify routes with `fastify.inject()` without starting a network server.
- Run database integration tests against a dedicated PostgreSQL test database.
- Test successful CRUD operations, invalid payloads, duplicate records, missing resources, and cascading deletes.

### Frontend

- Use Vitest and React Testing Library.
- Test forms, validation, loading states, error states, and successful API results.
- Mock API calls in component tests.

## Initial Frontend

The React and MUI frontend will contain:

1. An applications list page.
2. A form for creating and editing applications.
3. An application details page showing its configuration values.
4. A form for creating and editing configuration values.
5. MUI confirmation dialogs before deleting records.
