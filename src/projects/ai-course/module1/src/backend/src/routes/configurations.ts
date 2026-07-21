import { FastifyInstance } from "fastify";
import { ConfigurationService } from "../services/configurationService";
import {
  CreateConfigurationSchema,
  UpdateConfigurationSchema,
  ConfigurationParamsSchema,
  CreateConfigurationType,
  UpdateConfigurationType,
  ConfigurationParamsType,
} from "../schemas/configurationSchemas";
import {
  ApplicationParamsSchema,
  ApplicationParamsType,
} from "../schemas/applicationSchemas";
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
        const params = request.params as ApplicationParamsType;
        const configuration = await configurationService.createConfiguration(
          params.applicationId,
          request.body as CreateConfigurationType,
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
        const params = request.params as ApplicationParamsType;
        const configurations = await configurationService.getConfigurations(
          params.applicationId,
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
        const params = request.params as ConfigurationParamsType;
        const configuration = await configurationService.getConfigurationById(
          params.applicationId,
          params.configurationId,
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
        const params = request.params as ConfigurationParamsType;
        const configuration = await configurationService.updateConfiguration(
          params.applicationId,
          params.configurationId,
          request.body as UpdateConfigurationType,
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
        const params = request.params as ConfigurationParamsType;
        await configurationService.deleteConfiguration(
          params.applicationId,
          params.configurationId,
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
