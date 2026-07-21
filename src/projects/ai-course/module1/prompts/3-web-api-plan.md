# Configuration Service Implementation Plan

## Overview

This plan provides a comprehensive, step-by-step guide to implement a full-stack Configuration Service application with TypeScript, Node.js/Fastify backend, React/MUI frontend, and PostgreSQL database.

## Project Structure

Create the following structure within `src/projects/ai-course/module1/src`:

```
src/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .gitignore
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── routes/
│   │   │   ├── health.ts
│   │   │   ├── applications.ts
│   │   │   └── configurations.ts
│   │   ├── services/
│   │   │   ├── applicationService.ts
│   │   │   └── configurationService.ts
│   │   ├── schemas/
│   │   │   ├── applicationSchemas.ts
│   │   │   └── configurationSchemas.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── errorHandler.ts
│   └── tests/
│       ├── routes/
│       ├── services/
│       └── setup.ts
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── .gitignore
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── ApplicationForm.tsx
    │   │   ├── ApplicationList.tsx
    │   │   ├── ConfigurationForm.tsx
    │   │   ├── ConfigurationList.tsx
    │   │   └── ConfirmDialog.tsx
    │   ├── pages/
    │   │   ├── ApplicationsPage.tsx
    │   │   └── ApplicationDetailsPage.tsx
    │   ├── hooks/
    │   │   ├── useApplications.ts
    │   │   └── useConfigurations.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── api/
    │   │   └── client.ts
    │   └── theme/
    │       └── index.ts
    └── tests/
        ├── components/
        ├── pages/
        └── setup.ts
```

## Phase 1: Backend Foundation

### 1.1 Initialize Backend Project

```bash
cd src/projects/ai-course/module1/src
mkdir backend && cd backend
npm init -y
```

### 1.2 Install Backend Dependencies

```bash
# Core dependencies
npm install fastify @fastify/cors @fastify/env @fastify/sensible @fastify/swagger @fastify/swagger-ui @fastify/type-provider-typebox @sinclair/typebox prisma @prisma/client

# Development dependencies
npm install -D typescript @types/node vitest tsx nodemon
```

### 1.3 Backend package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy"
  }
}
```

### 1.4 Backend TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 1.5 Environment Configuration

Create `.env.example`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/config_service?schema=public"
PORT=3001
NODE_ENV=development
```

## Phase 2: Database Schema & Prisma Setup

### 2.1 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Application {
  id            String          @id @default(uuid()) @db.Uuid
  name          String          @unique
  description   String?
  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt @map("updated_at")
  configurations Configuration[]

  @@map("applications")
}

model Configuration {
  id            String      @id @default(uuid()) @db.Uuid
  applicationId String      @map("application_id") @db.Uuid
  key           String
  value         Json
  description   String?
  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@unique([applicationId, key])
  @@map("configurations")
}
```

### 2.2 Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init
```

## Phase 3: Backend Core Implementation

### 3.1 Global Error Handler

```typescript
// src/utils/errorHandler.ts
export interface ApiError {
  error: {
    type: string;
    message: string;
    status: number;
  };
}

export class AppError extends Error {
  public readonly type: string;
  public readonly status: number;

  constructor(type: string, message: string, status: number) {
    super(message);
    this.type = type;
    this.status = status;
    this.name = "AppError";
  }
}

export const createErrorResponse = (
  type: string,
  message: string,
  status: number,
): ApiError => ({
  error: { type, message, status },
});

export const handlePrismaError = (error: any): AppError => {
  if (error.code === "P2002") {
    return new AppError(
      "DUPLICATE_RECORD",
      "A record with this value already exists",
      409,
    );
  }
  if (error.code === "P2025") {
    return new AppError(
      "RECORD_NOT_FOUND",
      "The requested record was not found",
      404,
    );
  }
  return new AppError(
    "DATABASE_ERROR",
    "An unexpected database error occurred",
    500,
  );
};
```

### 3.2 TypeScript Types

```typescript
// src/types/index.ts
export interface Application {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Configuration {
  id: string;
  applicationId: string;
  key: string;
  value: any;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationRequest {
  name: string;
  description?: string;
}

export interface UpdateApplicationRequest {
  name?: string;
  description?: string;
}

export interface CreateConfigurationRequest {
  key: string;
  value: any;
  description?: string;
}

export interface UpdateConfigurationRequest {
  key?: string;
  value?: any;
  description?: string;
}
```

### 3.3 Validation Schemas

```typescript
// src/schemas/applicationSchemas.ts
import { Type, Static } from "@sinclair/typebox";

export const CreateApplicationSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const UpdateApplicationSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const ApplicationParamsSchema = Type.Object({
  applicationId: Type.String({ format: "uuid" }),
});

export type CreateApplicationType = Static<typeof CreateApplicationSchema>;
export type UpdateApplicationType = Static<typeof UpdateApplicationSchema>;
export type ApplicationParamsType = Static<typeof ApplicationParamsSchema>;
```

```typescript
// src/schemas/configurationSchemas.ts
import { Type, Static } from "@sinclair/typebox";

export const CreateConfigurationSchema = Type.Object({
  key: Type.String({ minLength: 1, maxLength: 255 }),
  value: Type.Any(),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const UpdateConfigurationSchema = Type.Object({
  key: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  value: Type.Optional(Type.Any()),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const ConfigurationParamsSchema = Type.Object({
  applicationId: Type.String({ format: "uuid" }),
  configurationId: Type.String({ format: "uuid" }),
});

export type CreateConfigurationType = Static<typeof CreateConfigurationSchema>;
export type UpdateConfigurationType = Static<typeof UpdateConfigurationSchema>;
export type ConfigurationParamsType = Static<typeof ConfigurationParamsSchema>;
```

### 3.4 Services

```typescript
// src/services/applicationService.ts
import { PrismaClient } from "@prisma/client";
import { CreateApplicationRequest, UpdateApplicationRequest } from "../types";
import { AppError, handlePrismaError } from "../utils/errorHandler";

const prisma = new PrismaClient();

export class ApplicationService {
  async createApplication(data: CreateApplicationRequest) {
    try {
      return await prisma.application.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getApplications() {
    return await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getApplicationById(id: string) {
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new AppError(
        "APPLICATION_NOT_FOUND",
        "Application was not found",
        404,
      );
    }

    return application;
  }

  async updateApplication(id: string, data: UpdateApplicationRequest) {
    try {
      return await prisma.application.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async deleteApplication(id: string) {
    try {
      await prisma.application.delete({
        where: { id },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
```

```typescript
// src/services/configurationService.ts
import { PrismaClient } from "@prisma/client";
import {
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
} from "../types";
import { AppError, handlePrismaError } from "../utils/errorHandler";

const prisma = new PrismaClient();

export class ConfigurationService {
  async createConfiguration(
    applicationId: string,
    data: CreateConfigurationRequest,
  ) {
    try {
      return await prisma.configuration.create({
        data: {
          applicationId,
          key: data.key,
          value: data.value,
          description: data.description,
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getConfigurations(applicationId: string) {
    return await prisma.configuration.findMany({
      where: { applicationId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getConfigurationById(applicationId: string, configurationId: string) {
    const configuration = await prisma.configuration.findFirst({
      where: {
        id: configurationId,
        applicationId,
      },
    });

    if (!configuration) {
      throw new AppError(
        "CONFIGURATION_NOT_FOUND",
        "Configuration was not found",
        404,
      );
    }

    return configuration;
  }

  async updateConfiguration(
    applicationId: string,
    configurationId: string,
    data: UpdateConfigurationRequest,
  ) {
    try {
      return await prisma.configuration.update({
        where: {
          id: configurationId,
          applicationId,
        },
        data,
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async deleteConfiguration(applicationId: string, configurationId: string) {
    try {
      await prisma.configuration.delete({
        where: {
          id: configurationId,
          applicationId,
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
```

## Phase 4: API Routes Implementation

### 4.1 Health Check Route

```typescript
// src/routes/health.ts
import { FastifyInstance } from "fastify";

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (request, reply) => {
    return { status: "ok" };
  });
}
```

### 4.2 Applications Routes

```typescript
// src/routes/applications.ts
import { FastifyInstance } from "fastify";
import { ApplicationService } from "../services/applicationService";
import {
  CreateApplicationSchema,
  UpdateApplicationSchema,
  ApplicationParamsSchema,
} from "../schemas/applicationSchemas";
import { AppError, createErrorResponse } from "../utils/errorHandler";

const applicationService = new ApplicationService();

export default async function applicationRoutes(fastify: FastifyInstance) {
  // Create application
  fastify.post(
    "/api/v1/applications",
    {
      schema: {
        body: CreateApplicationSchema,
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const application = await applicationService.createApplication(
          request.body,
        );
        reply.status(201).send(application);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );

  // List applications
  fastify.get("/api/v1/applications", async (request, reply) => {
    try {
      const applications = await applicationService.getApplications();
      reply.send({ items: applications });
    } catch (error) {
      reply
        .status(500)
        .send(
          createErrorResponse(
            "INTERNAL_ERROR",
            "An unexpected error occurred",
            500,
          ),
        );
    }
  });

  // Get application by ID
  fastify.get(
    "/api/v1/applications/:applicationId",
    {
      schema: {
        params: ApplicationParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const application = await applicationService.getApplicationById(
          request.params.applicationId,
        );
        reply.send(application);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );

  // Update application
  fastify.patch(
    "/api/v1/applications/:applicationId",
    {
      schema: {
        params: ApplicationParamsSchema,
        body: UpdateApplicationSchema,
      },
    },
    async (request, reply) => {
      try {
        const application = await applicationService.updateApplication(
          request.params.applicationId,
          request.body,
        );
        reply.send(application);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );

  // Delete application
  fastify.delete(
    "/api/v1/applications/:applicationId",
    {
      schema: {
        params: ApplicationParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        await applicationService.deleteApplication(
          request.params.applicationId,
        );
        reply.status(204).send();
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );
}
```

### 4.3 Configurations Routes

```typescript
// src/routes/configurations.ts
import { FastifyInstance } from "fastify";
import { ConfigurationService } from "../services/configurationService";
import {
  CreateConfigurationSchema,
  UpdateConfigurationSchema,
  ConfigurationParamsSchema,
} from "../schemas/configurationSchemas";
import { ApplicationParamsSchema } from "../schemas/applicationSchemas";
import { AppError, createErrorResponse } from "../utils/errorHandler";

const configurationService = new ConfigurationService();

export default async function configurationRoutes(fastify: FastifyInstance) {
  // Create configuration
  fastify.post(
    "/api/v1/applications/:applicationId/configurations",
    {
      schema: {
        params: ApplicationParamsSchema,
        body: CreateConfigurationSchema,
      },
    },
    async (request, reply) => {
      try {
        const configuration = await configurationService.createConfiguration(
          request.params.applicationId,
          request.body,
        );
        reply.status(201).send(configuration);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );

  // List configurations
  fastify.get(
    "/api/v1/applications/:applicationId/configurations",
    {
      schema: {
        params: ApplicationParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const configurations = await configurationService.getConfigurations(
          request.params.applicationId,
        );
        reply.send({ items: configurations });
      } catch (error) {
        reply
          .status(500)
          .send(
            createErrorResponse(
              "INTERNAL_ERROR",
              "An unexpected error occurred",
              500,
            ),
          );
      }
    },
  );

  // Get configuration by ID
  fastify.get(
    "/api/v1/applications/:applicationId/configurations/:configurationId",
    {
      schema: {
        params: ConfigurationParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const configuration = await configurationService.getConfigurationById(
          request.params.applicationId,
          request.params.configurationId,
        );
        reply.send(configuration);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );

  // Update configuration
  fastify.patch(
    "/api/v1/applications/:applicationId/configurations/:configurationId",
    {
      schema: {
        params: ConfigurationParamsSchema,
        body: UpdateConfigurationSchema,
      },
    },
    async (request, reply) => {
      try {
        const configuration = await configurationService.updateConfiguration(
          request.params.applicationId,
          request.params.configurationId,
          request.body,
        );
        reply.send(configuration);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );

  // Delete configuration
  fastify.delete(
    "/api/v1/applications/:applicationId/configurations/:configurationId",
    {
      schema: {
        params: ConfigurationParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        await configurationService.deleteConfiguration(
          request.params.applicationId,
          request.params.configurationId,
        );
        reply.status(204).send();
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status)
            .send(createErrorResponse(error.type, error.message, error.status));
        } else {
          reply
            .status(500)
            .send(
              createErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
              ),
            );
        }
      }
    },
  );
}
```

### 4.4 Main Application Setup

```typescript
// src/app.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import healthRoutes from "./routes/health";
import applicationRoutes from "./routes/applications";
import configurationRoutes from "./routes/configurations";

export const buildApp = (opts = {}) => {
  const app = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();

  // Register plugins
  app.register(cors, {
    origin: true,
  });

  app.register(sensible);

  app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Configuration Service API",
        description:
          "API for managing applications and their configuration values",
        version: "1.0.0",
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  // Register routes
  app.register(healthRoutes);
  app.register(applicationRoutes);
  app.register(configurationRoutes);

  return app;
};
```

```typescript
// src/index.ts
import { buildApp } from "./app";

const start = async () => {
  const app = buildApp({ logger: true });

  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${port}`);
    console.log(`API documentation available at http://localhost:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

## Phase 5: Frontend Foundation

### 5.1 Initialize Frontend Project

```bash
cd ../
mkdir frontend && cd frontend
npm init -y
```

### 5.2 Install Frontend Dependencies

```bash
# Core dependencies
npm install react react-dom react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled @tanstack/react-query

# Development dependencies
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 5.3 Frontend package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

### 5.4 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
});
```

### 5.5 Frontend TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5.6 HTML Template

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Configuration Service</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Phase 6: Frontend Implementation

### 6.1 Types and API Client

```typescript
// src/types/index.ts
export interface Application {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Configuration {
  id: string;
  applicationId: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  name: string;
  description?: string;
}

export interface UpdateApplicationRequest {
  name?: string;
  description?: string;
}

export interface CreateConfigurationRequest {
  key: string;
  value: any;
  description?: string;
}

export interface UpdateConfigurationRequest {
  key?: string;
  value?: any;
  description?: string;
}

export interface ApiError {
  error: {
    type: string;
    message: string;
    status: number;
  };
}
```

```typescript
// src/api/client.ts
import {
  Application,
  Configuration,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
} from "../types";

const API_BASE = "/api/v1";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "An error occurred");
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Applications
  async getApplications(): Promise<{ items: Application[] }> {
    return this.request("/applications");
  }

  async getApplication(id: string): Promise<Application> {
    return this.request(`/applications/${id}`);
  }

  async createApplication(
    data: CreateApplicationRequest,
  ): Promise<Application> {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateApplication(
    id: string,
    data: UpdateApplicationRequest,
  ): Promise<Application> {
    return this.request(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id: string): Promise<void> {
    return this.request(`/applications/${id}`, {
      method: "DELETE",
    });
  }

  // Configurations
  async getConfigurations(
    applicationId: string,
  ): Promise<{ items: Configuration[] }> {
    return this.request(`/applications/${applicationId}/configurations`);
  }

  async getConfiguration(
    applicationId: string,
    configurationId: string,
  ): Promise<Configuration> {
    return this.request(
      `/applications/${applicationId}/configurations/${configurationId}`,
    );
  }

  async createConfiguration(
    applicationId: string,
    data: CreateConfigurationRequest,
  ): Promise<Configuration> {
    return this.request(`/applications/${applicationId}/configurations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateConfiguration(
    applicationId: string,
    configurationId: string,
    data: UpdateConfigurationRequest,
  ): Promise<Configuration> {
    return this.request(
      `/applications/${applicationId}/configurations/${configurationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  }

  async deleteConfiguration(
    applicationId: string,
    configurationId: string,
  ): Promise<void> {
    return this.request(
      `/applications/${applicationId}/configurations/${configurationId}`,
      {
        method: "DELETE",
      },
    );
  }
}

export const apiClient = new ApiClient();
```

### 6.2 React Query Hooks

```typescript
// src/hooks/useApplications.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { CreateApplicationRequest, UpdateApplicationRequest } from "../types";

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => apiClient.getApplications(),
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: () => apiClient.getApplication(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationRequest) =>
      apiClient.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateApplicationRequest;
    }) => apiClient.updateApplication(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", id] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
```

```typescript
// src/hooks/useConfigurations.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import {
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
} from "../types";

export const useConfigurations = (applicationId: string) => {
  return useQuery({
    queryKey: ["configurations", applicationId],
    queryFn: () => apiClient.getConfigurations(applicationId),
    enabled: !!applicationId,
  });
};

export const useConfiguration = (
  applicationId: string,
  configurationId: string,
) => {
  return useQuery({
    queryKey: ["configurations", applicationId, configurationId],
    queryFn: () => apiClient.getConfiguration(applicationId, configurationId),
    enabled: !!applicationId && !!configurationId,
  });
};

export const useCreateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: CreateConfigurationRequest;
    }) => apiClient.createConfiguration(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId],
      });
    },
  });
};

export const useUpdateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      configurationId,
      data,
    }: {
      applicationId: string;
      configurationId: string;
      data: UpdateConfigurationRequest;
    }) => apiClient.updateConfiguration(applicationId, configurationId, data),
    onSuccess: (_, { applicationId, configurationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId, configurationId],
      });
    },
  });
};

export const useDeleteConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      configurationId,
    }: {
      applicationId: string;
      configurationId: string;
    }) => apiClient.deleteConfiguration(applicationId, configurationId),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId],
      });
    },
  });
};
```

### 6.3 Main App Setup

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

```typescript
// src/theme/index.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
```

```typescript
// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Configuration Service
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/applications" replace />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:applicationId" element={<ApplicationDetailsPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
```

## Phase 7: Frontend Components

### 7.1 Shared Components

```typescript
// src/components/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### 7.2 Application Components

```typescript
// src/components/ApplicationForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Application, CreateApplicationRequest, UpdateApplicationRequest } from '../types';

interface ApplicationFormProps {
  open: boolean;
  application?: Application;
  onSubmit: (data: CreateApplicationRequest | UpdateApplicationRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  open,
  application,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (application) {
      setName(application.name);
      setDescription(application.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [application, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {application ? 'Edit Application' : 'Create Application'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim()}
          >
            {application ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

```typescript
// src/components/ApplicationList.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Application } from '../types';

interface ApplicationListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, app: Application) => {
    setAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApp(null);
  };

  const handleEdit = () => {
    if (selectedApp) {
      onEdit(selectedApp);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedApp) {
      onDelete(selectedApp);
    }
    handleMenuClose();
  };

  if (applications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No applications found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first application to get started
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {applications.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {app.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, app)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                {app.description && (
                  <Typography variant="body2" color="text.secondary">
                    {app.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Created: {new Date(app.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
```

### 7.3 Configuration Components

```typescript
// src/components/ConfigurationForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Configuration, CreateConfigurationRequest, UpdateConfigurationRequest } from '../types';

interface ConfigurationFormProps {
  open: boolean;
  configuration?: Configuration;
  onSubmit: (data: CreateConfigurationRequest | UpdateConfigurationRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  open,
  configuration,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [valueError, setValueError] = useState('');

  useEffect(() => {
    if (configuration) {
      setKey(configuration.key);
      setValue(JSON.stringify(configuration.value, null, 2));
      setDescription(configuration.description || '');
    } else {
      setKey('');
      setValue('');
      setDescription('');
    }
    setValueError('');
  }, [configuration, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedValue = JSON.parse(value);
      onSubmit({
        key: key.trim(),
        value: parsedValue,
        description: description.trim() || undefined,
      });
      setValueError('');
    } catch (error) {
      setValueError('Invalid JSON format');
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {configuration ? 'Edit Configuration' : 'Create Configuration'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              fullWidth
              disabled={loading}
              placeholder="e.g., api.timeout"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Value (JSON format)
              </Typography>
              <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                fullWidth
                multiline
                rows={6}
                disabled={loading}
                placeholder='e.g., {"timeout": 5000, "retries": 3}'
                error={!!valueError}
                helperText={valueError || 'Enter a valid JSON value'}
              />
            </Box>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !key.trim() || !value.trim()}
          >
            {configuration ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

```typescript
// src/components/ConfigurationList.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Configuration } from '../types';

interface ConfigurationListProps {
  configurations: Configuration[];
  onEdit: (configuration: Configuration) => void;
  onDelete: (configuration: Configuration) => void;
}

export const ConfigurationList: React.FC<ConfigurationListProps> = ({
  configurations,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, config: Configuration) => {
    setAnchorEl(event.currentTarget);
    setSelectedConfig(config);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConfig(null);
  };

  const handleEdit = () => {
    if (selectedConfig) {
      onEdit(selectedConfig);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedConfig) {
      onDelete(selectedConfig);
    }
    handleMenuClose();
  };

  const formatValue = (value: any) => {
    const str = JSON.stringify(value);
    return str.length > 100 ? str.substring(0, 100) + '...' : str;
  };

  const getValueType = (value: any) => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  if (configurations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No configurations found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add configuration values for this application
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configurations.map((config) => (
              <TableRow key={config.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {config.key}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatValue(config.value)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getValueType(config.value)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {config.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(config.updatedAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, config)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
```

## Phase 8: Pages Implementation

### 8.1 Applications Page

```typescript
// src/pages/ApplicationsPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ApplicationList } from '../components/ApplicationList';
import { ApplicationForm } from '../components/ApplicationForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  useApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication
} from '../hooks/useApplications';
import { Application, CreateApplicationRequest, UpdateApplicationRequest } from '../types';

export default function ApplicationsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  const { data: applicationsData, isLoading, error } = useApplications();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const applications = applicationsData?.items || [];

  const handleCreate = () => {
    setEditingApp(undefined);
    setFormOpen(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleDelete = (app: Application) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateApplicationRequest | UpdateApplicationRequest) => {
    try {
      if (editingApp) {
        await updateMutation.mutateAsync({ id: editingApp.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setFormOpen(false);
      setEditingApp(undefined);
    } catch (error) {
      // Error handling is done by React Query
    }
  };

  const handleConfirmDelete = async () => {
    if (appToDelete) {
      try {
        await deleteMutation.mutateAsync(appToDelete.id);
        setDeleteDialogOpen(false);
        setAppToDelete(null);
      } catch (error) {
        // Error handling is done by React Query
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Applications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Application
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load applications. Please try again.
        </Alert>
      )}

      {(createMutation.error || updateMutation.error || deleteMutation.error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {createMutation.error?.message ||
           updateMutation.error?.message ||
           deleteMutation.error?.message}
        </Alert>
      )}

      <ApplicationList
        applications={applications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ApplicationForm
        open={formOpen}
        application={editingApp}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setFormOpen(false);
          setEditingApp(undefined);
        }}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Application"
        message={`Are you sure you want to delete "${appToDelete?.name}"? This will also delete all its configuration values.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setAppToDelete(null);
        }}
        confirmText="Delete"
      />
    </Box>
  );
}
```

### 8.2 Application Details Page

```typescript
// src/pages/ApplicationDetailsPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { ConfigurationList } from '../components/ConfigurationList';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { ApplicationForm } from '../components/ApplicationForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApplication, useUpdateApplication } from '../hooks/useApplications';
import {
  useConfigurations,
  useCreateConfiguration,
  useUpdateConfiguration,
  useDeleteConfiguration
} from '../hooks/useConfigurations';
import { Configuration, CreateConfigurationRequest, UpdateConfigurationRequest, UpdateApplicationRequest } from '../types';

export default function ApplicationDetailsPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [configFormOpen, setConfigFormOpen] = useState(false);
  const [appFormOpen, setAppFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<Configuration | null>(null);

  const { data: application, isLoading: appLoading, error: appError } = useApplication(applicationId!);
  const { data: configurationsData, isLoading: configsLoading, error: configsError } = useConfigurations(applicationId!);
  const updateAppMutation = useUpdateApplication();
  const createConfigMutation = useCreateConfiguration();
  const updateConfigMutation = useUpdateConfiguration();
  const deleteConfigMutation = useDeleteConfiguration();

  const configurations = configurationsData?.items || [];

  const handleCreateConfig = () => {
    setEditingConfig(undefined);
    setConfigFormOpen(true);
  };

  const handleEditConfig = (config: Configuration) => {
    setEditingConfig(config);
    setConfigFormOpen(true);
  };

  const handleDeleteConfig = (config: Configuration) => {
    setConfigToDelete(config);
    setDeleteDialogOpen(true);
  };

  const handleConfigFormSubmit = async (data: CreateConfigurationRequest | UpdateConfigurationRequest) => {
    try {
      if (editingConfig) {
        await updateConfigMutation.mutateAsync({
          applicationId: applicationId!,
          configurationId: editingConfig.id,
          data
        });
      } else {
        await createConfigMutation.mutateAsync({
          applicationId: applicationId!,
          data
        });
      }
      setConfigFormOpen(false);
      setEditingConfig(undefined);
    } catch (error) {
      // Error handling is done by React Query
    }
  };

  const handleAppFormSubmit = async (data: UpdateApplicationRequest) => {
    try {
      await updateAppMutation.mutateAsync({ id: applicationId!, data });
      setAppFormOpen(false);
    } catch (error) {
      // Error handling is done by React Query
    }
  };

  const handleConfirmDelete = async () => {
    if (configToDelete) {
      try {
        await deleteConfigMutation.mutateAsync({
          applicationId: applicationId!,
          configurationId: configToDelete.id
        });
        setDeleteDialogOpen(false);
        setConfigToDelete(null);
      } catch (error) {
        // Error handling is done by React Query
      }
    }
  };

  if (appLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (appError || !application) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/applications')}
          sx={{ mb: 2 }}
        >
          Back to Applications
        </Button>
        <Alert severity="error">
          Failed to load application. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/applications')}
          sx={{ textDecoration: 'none' }}
        >
          Applications
        </Link>
        <Typography color="text.primary">{application.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {application.name}
            </Typography>
            {application.description && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {application.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(application.createdAt).toLocaleDateString()} •
              Updated: {new Date(application.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => setAppFormOpen(true)}
            variant="outlined"
          >
            Edit Application
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Configuration Values
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateConfig}
        >
          Add Configuration
        </Button>
      </Box>

      {configsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load configurations. Please try again.
        </Alert>
      )}

      {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error || updateAppMutation.error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {createConfigMutation.error?.message ||
           updateConfigMutation.error?.message ||
           deleteConfigMutation.error?.message ||
           updateAppMutation.error?.message}
        </Alert>
      )}

      {configsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ConfigurationList
          configurations={configurations}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
        />
      )}

      <ConfigurationForm
        open={configFormOpen}
        configuration={editingConfig}
        onSubmit={handleConfigFormSubmit}
        onCancel={() => {
          setConfigFormOpen(false);
          setEditingConfig(undefined);
        }}
        loading={createConfigMutation.isPending || updateConfigMutation.isPending}
      />

      <ApplicationForm
        open={appFormOpen}
        application={application}
        onSubmit={handleAppFormSubmit}
        onCancel={() => setAppFormOpen(false)}
        loading={updateAppMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Configuration"
        message={`Are you sure you want to delete the configuration "${configToDelete?.key}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setConfigToDelete(null);
        }}
        confirmText="Delete"
      />
    </Box>
  );
}
```

## Phase 9: Testing Implementation

### 9.1 Backend Tests Setup

```typescript
// tests/setup.ts
import { vi } from "vitest";

// Mock Prisma Client
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    configuration: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  })),
}));
```

### 9.2 Backend Service Tests

```typescript
// tests/services/applicationService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApplicationService } from "../../src/services/applicationService";
import { PrismaClient } from "@prisma/client";

vi.mock("@prisma/client");

describe("ApplicationService", () => {
  let service: ApplicationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    service = new ApplicationService();
  });

  describe("createApplication", () => {
    it("should create an application successfully", async () => {
      const mockApp = {
        id: "123",
        name: "test-app",
        description: "Test application",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.application.create.mockResolvedValue(mockApp);

      const result = await service.createApplication({
        name: "test-app",
        description: "Test application",
      });

      expect(result).toEqual(mockApp);
      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: {
          name: "test-app",
          description: "Test application",
        },
      });
    });

    it("should handle duplicate name error", async () => {
      mockPrisma.application.create.mockRejectedValue({
        code: "P2002",
      });

      await expect(
        service.createApplication({ name: "duplicate-app" }),
      ).rejects.toThrow("A record with this value already exists");
    });
  });

  describe("getApplications", () => {
    it("should return all applications", async () => {
      const mockApps = [
        { id: "1", name: "app1", createdAt: new Date(), updatedAt: new Date() },
        { id: "2", name: "app2", createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.application.findMany.mockResolvedValue(mockApps);

      const result = await service.getApplications();

      expect(result).toEqual(mockApps);
      expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getApplicationById", () => {
    it("should return application when found", async () => {
      const mockApp = {
        id: "123",
        name: "test-app",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.application.findUnique.mockResolvedValue(mockApp);

      const result = await service.getApplicationById("123");

      expect(result).toEqual(mockApp);
    });

    it("should throw error when application not found", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      await expect(service.getApplicationById("nonexistent")).rejects.toThrow(
        "Application was not found",
      );
    });
  });
});
```

### 9.3 Backend Route Tests

```typescript
// tests/routes/applications.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../../src/app";

describe("Applications Routes", () => {
  let app: any;

  beforeEach(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  describe("POST /api/v1/applications", () => {
    it("should create application successfully", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/applications",
        payload: {
          name: "test-app",
          description: "Test application",
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.name).toBe("test-app");
      expect(body.description).toBe("Test application");
    });

    it("should return 400 for invalid payload", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/applications",
        payload: {
          // missing required name field
          description: "Test application",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/v1/applications", () => {
    it("should return applications list", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/applications",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("items");
      expect(Array.isArray(body.items)).toBe(true);
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe("ok");
    });
  });
});
```

### 9.4 Frontend Tests Setup

```typescript
// tests/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch
global.fetch = vi.fn();

// Mock React Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ applicationId: "test-id" }),
  };
});
```

### 9.5 Frontend Component Tests

```typescript
// tests/components/ApplicationList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationList } from '../../src/components/ApplicationList';
import { Application } from '../../src/types';

const mockApplications: Application[] = [
  {
    id: '1',
    name: 'Test App 1',
    description: 'First test application',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test App 2',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ApplicationList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render applications correctly', () => {
    renderWithRouter(
      <ApplicationList
        applications={mockApplications}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test App 1')).toBeInTheDocument();
    expect(screen.getByText('Test App 2')).toBeInTheDocument();
    expect(screen.getByText('First test application')).toBeInTheDocument();
  });

  it('should show empty state when no applications', () => {
    renderWithRouter(
      <ApplicationList
        applications={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No applications found')).toBeInTheDocument();
  });

  it('should call onEdit when edit is clicked', async () => {
    renderWithRouter(
      <ApplicationList
        applications={mockApplications}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Click the menu button for the first application
    const menuButtons = screen.getAllByLabelText(/more/i);
    fireEvent.click(menuButtons[0]);

    // Click edit option
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockApplications[0]);
  });
});
```

## Phase 10: Development Commands

### 10.1 Backend Development

```bash
# Start backend development server
cd backend
npm run dev

# Run backend tests
npm test

# Run database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 10.2 Frontend Development

```bash
# Start frontend development server
cd frontend
npm run dev

# Run frontend tests
npm test

# Build for production
npm run build
```

### 10.3 Full Development Setup

1. **Setup Backend:**

   ```bash
   cd src/projects/ai-course/module1/src/backend
   npm install
   cp .env.example .env
   # Edit .env with your database URL
   npm run db:generate
   npm run db:migrate
   npm run dev
   ```

2. **Setup Frontend:**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

## Success Criteria Checklist

- [ ] All API endpoints implemented and working
- [ ] Database schema matches specifications exactly
- [ ] Frontend provides complete CRUD functionality
- [ ] Proper error handling and validation throughout
- [ ] Tests cover main functionality
- [ ] Code follows TypeScript best practices
- [ ] Global error handling with consistent shape
- [ ] Responsive design with Material UI
- [ ] Development environment setup documented

## Next Steps

After implementing this plan:

1. Test all functionality manually
2. Run automated tests to ensure quality
3. Review code for improvements
4. Consider adding additional features like search, filtering, or pagination
5. Optimize performance if needed
6. Add deployment configuration if required

This comprehensive plan provides everything needed to build a production-ready Configuration Service application following the specified requirements.
