import { beforeEach, describe, expect, it } from "vitest";

import { mockPrismaClient, resetMockPrismaClient } from "../setup";
import { ApplicationService } from "../../src/services/applicationService";

describe("ApplicationService", () => {
  let service: ApplicationService;

  beforeEach(() => {
    resetMockPrismaClient();
    service = new ApplicationService();
  });

  describe("createApplication", () => {
    it("creates an application successfully", async () => {
      const mockApp = {
        id: "123",
        name: "test-app",
        description: "Test application",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.application.create.mockResolvedValue(mockApp);

      const result = await service.createApplication({
        name: "test-app",
        description: "Test application",
      });

      expect(result).toEqual(mockApp);
      expect(mockPrismaClient.application.create).toHaveBeenCalledWith({
        data: {
          name: "test-app",
          description: "Test application",
        },
      });
    });

    it("maps duplicate name errors", async () => {
      mockPrismaClient.application.create.mockRejectedValue({ code: "P2002" });

      await expect(
        service.createApplication({ name: "duplicate-app" }),
      ).rejects.toThrow("A record with this value already exists");
    });
  });

  describe("getApplications", () => {
    it("returns all applications ordered by newest first", async () => {
      const mockApps = [
        { id: "1", name: "app1", createdAt: new Date(), updatedAt: new Date() },
        { id: "2", name: "app2", createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaClient.application.findMany.mockResolvedValue(mockApps);

      const result = await service.getApplications();

      expect(result).toEqual(mockApps);
      expect(mockPrismaClient.application.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getApplicationById", () => {
    it("returns an application when found", async () => {
      const mockApp = {
        id: "123",
        name: "test-app",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.application.findUnique.mockResolvedValue(mockApp);

      await expect(service.getApplicationById("123")).resolves.toEqual(mockApp);
    });

    it("throws an AppError when not found", async () => {
      mockPrismaClient.application.findUnique.mockResolvedValue(null);

      await expect(service.getApplicationById("missing")).rejects.toThrow(
        "Application was not found",
      );
    });
  });
});
