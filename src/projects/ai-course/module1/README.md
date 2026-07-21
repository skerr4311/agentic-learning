# Configuration Service

A full-stack TypeScript Configuration Service built for Module 1 of the AI course.

## Stack

- **Backend:** Node.js, Fastify, TypeScript, Prisma, PostgreSQL
- **Frontend:** React, Vite, TypeScript, Material UI, TanStack Query
- **Testing:** Vitest, Testing Library, jsdom

## Project Structure

```text
src/projects/ai-course/module1/src/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── tests/
└── frontend/
    ├── src/
    └── tests/
```

## Backend Development

From the backend directory:

```bash
cd src/projects/ai-course/module1/src/backend
```

Install dependencies:

```bash
npm install
```

Create environment configuration:

```bash
cp .env.example .env
```

Update `.env` with your local PostgreSQL connection string.

Generate the Prisma client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

Start the backend development server:

```bash
npm run dev
```

Run backend tests:

```bash
npm test -- --run
```

Build the backend:

```bash
npm run build
```

Backend URLs:

- API: <http://localhost:3001>
- Health check: <http://localhost:3001/health>
- API documentation: <http://localhost:3001/docs>

## Frontend Development

From the frontend directory:

```bash
cd src/projects/ai-course/module1/src/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Run frontend tests:

```bash
npm test -- --run
```

Build the frontend:

```bash
npm run build
```

Frontend URL:

- App: <http://localhost:3000>

## Full Local Development Flow

1. Start PostgreSQL locally and ensure the database referenced in `backend/.env` exists.
2. In `src/projects/ai-course/module1/src/backend`, run:

   ```bash
   npm install
   npm run db:generate
   npm run db:migrate
   npm run dev
   ```

3. In a second terminal, from `src/projects/ai-course/module1/src/frontend`, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open <http://localhost:3000>.

## Validation Commands

Run these before committing final changes:

```bash
cd src/projects/ai-course/module1/src/backend
npm test -- --run
npm run build

cd ../frontend
npm test -- --run
npm run build
```

## Implemented Functionality

- CRUD API for applications.
- CRUD API for application configuration values.
- Consistent API error response shape with `type`, `message`, and `status`.
- Prisma schema with application/configuration relationship and cascading delete.
- React UI for managing applications and configurations.
- React Query hooks for API data fetching and mutations.
- Unit/route tests covering representative backend and frontend functionality.
