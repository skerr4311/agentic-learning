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
