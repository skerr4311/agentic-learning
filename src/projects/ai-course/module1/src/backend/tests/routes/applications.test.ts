import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApplicationService = vi.hoisted(() => ({
  createApplication: vi.fn(),
  getApplications: vi.fn(),
  getApplicationById: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn(),
}));

vi.mock("../../src/services/applicationService", () => ({
  ApplicationService: vi.fn(function ApplicationService() {
    return mockApplicationService;
  }),
}));

import { buildApp } from "../../src/app";

describe("Applications Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns health status", async () => {
    const app = buildApp({ logger: false });
    await app.ready();

    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ status: "ok" });
    await app.close();
  });

  it("creates an application successfully", async () => {
    const mockApp = {
      id: "123",
      name: "test-app",
      description: "Test application",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockApplicationService.createApplication.mockResolvedValue(mockApp);

    const app = buildApp({ logger: false });
    await app.ready();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/applications",
      payload: {
        name: "test-app",
        description: "Test application",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "test-app",
      description: "Test application",
    });
    await app.close();
  });

  it("returns 400 for invalid create payload", async () => {
    const app = buildApp({ logger: false });
    await app.ready();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/applications",
      payload: { description: "Missing name" },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("returns an applications list", async () => {
    mockApplicationService.getApplications.mockResolvedValue([]);
    const app = buildApp({ logger: false });
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/applications",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ items: [] });
    await app.close();
  });
});
