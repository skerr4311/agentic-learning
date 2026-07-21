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
