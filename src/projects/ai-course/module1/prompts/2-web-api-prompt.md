# Configuration Service Implementation Prompt

## Objective

Build a full-stack Configuration Service application according to the specifications in [1-web-api-specs.md](./1-web-api-specs.md). This service will manage applications and their configuration values through a REST API with a React frontend.

## Project Structure

Create the following structure within `src/projects/ai-course/module1/src`:

```
src/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│   └── tests/
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── types/
    │   └── api/
    └── tests/
```

## Implementation Requirements

### 1. Backend Setup

- Initialize a Node.js project with TypeScript
- Install all dependencies listed in the specifications
- Configure Fastify with TypeBox for validation
- Set up Swagger documentation
- Configure CORS for frontend communication

### 2. Database Schema (Prisma)

Create the exact schema specified:

- `applications` table with UUID primary key, unique name constraint
- `configurations` table with composite unique constraint on (application_id, key)
- Proper foreign key relationships with cascade delete

### 3. API Implementation

Implement all specified endpoints:

- Health check: `GET /health`
- Applications CRUD: Full REST API under `/api/v1/applications`
- Configurations CRUD: Nested under applications at `/api/v1/applications/:applicationId/configurations`
- Use exact JSON request/response formats from specifications
- Implement proper error handling with consistent error shape
- Return correct HTTP status codes (200, 201, 204, 400, 404, 409)

### 4. Validation & Types

- Use TypeBox schemas for request validation
- Generate TypeScript types from Prisma schema
- Validate all inputs according to database constraints
- Handle duplicate name/key conflicts appropriately

### 5. Frontend Implementation

Build a React application with Material UI:

- Applications list page with create/edit/delete functionality
- Application details page showing configuration values
- Configuration values CRUD within application context
- Form validation and error handling
- Loading states and user feedback
- Confirmation dialogs for delete operations
- Responsive design using MUI components

### 6. Testing

- Backend: Vitest with Fastify inject() for route testing
- Frontend: Vitest + React Testing Library
- Test all CRUD operations, validation, error cases
- Mock API calls in frontend tests

### 7. Environment Configuration

- Create `.env.example` with DATABASE_URL template
- Configure environment variable loading
- Set up proper TypeScript configuration for both projects

## Key Technical Decisions

- **Backend**: Node.js + Fastify + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + Vite + Material UI + React Query + TypeScript
- **API Style**: REST with `/api/v1` prefix
- **Validation**: TypeBox schemas
- **Testing**: Vitest for both backend and frontend

## Database Connection

Assume PostgreSQL is running locally. Use this connection string format:

```
DATABASE_URL="postgresql://username:password@localhost:5432/config_service?schema=public"
```

## Success Criteria

1. All API endpoints work according to specifications
2. Frontend provides complete CRUD functionality
3. Database schema matches specifications exactly
4. Proper error handling and validation throughout
5. Tests cover main functionality
6. Code is well-organized and follows TypeScript best practices

## Getting Started

1. Create the project structure
2. Set up backend package.json and dependencies
3. Configure Prisma schema and run initial migration
4. Implement API endpoints with validation
5. Set up frontend with Vite and MUI
6. Build React components and pages
7. Connect frontend to backend API
8. Add comprehensive testing
9. Document setup and usage instructions

Refer to the [detailed specifications](./1-web-api-specs.md) for exact API contracts, database schema, and response formats.
