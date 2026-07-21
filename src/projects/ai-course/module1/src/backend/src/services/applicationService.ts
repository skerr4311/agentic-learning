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
