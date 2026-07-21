import { FastifyInstance } from "fastify";
import { ApplicationService } from "../services/applicationService";
import {
  CreateApplicationSchema,
  UpdateApplicationSchema,
  ApplicationParamsSchema,
  CreateApplicationType,
  UpdateApplicationType,
  ApplicationParamsType,
} from "../schemas/applicationSchemas";
import { AppError, createErrorResponse } from "../utils/errorHandler";

const applicationService = new ApplicationService();

const ErrorResponseSchema = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        type: { type: "string" },
        message: { type: "string" },
        status: { type: "number" },
      },
    },
  },
};

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
          400: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const application = await applicationService.createApplication(
          request.body as CreateApplicationType,
        );
        reply.status(201).send(application);
      } catch (error) {
        if (error instanceof AppError) {
          reply
            .status(error.status as 400 | 409 | 500)
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
        const params = request.params as ApplicationParamsType;
        const application = await applicationService.getApplicationById(
          params.applicationId,
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
        const params = request.params as ApplicationParamsType;
        const application = await applicationService.updateApplication(
          params.applicationId,
          request.body as UpdateApplicationType,
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
        const params = request.params as ApplicationParamsType;
        await applicationService.deleteApplication(params.applicationId);
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
