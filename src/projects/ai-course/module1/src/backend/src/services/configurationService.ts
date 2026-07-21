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
