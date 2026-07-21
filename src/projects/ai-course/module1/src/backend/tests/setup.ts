import { vi } from "vitest";

export const mockPrismaClient = {
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
};

export const resetMockPrismaClient = () => {
  Object.values(mockPrismaClient.application).forEach((mock) =>
    mock.mockReset(),
  );
  Object.values(mockPrismaClient.configuration).forEach((mock) =>
    mock.mockReset(),
  );
};

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(function PrismaClient() {
    return mockPrismaClient;
  }),
}));
