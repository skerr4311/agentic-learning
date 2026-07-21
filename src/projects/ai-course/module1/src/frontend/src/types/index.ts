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
  value: unknown;
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
  value: unknown;
  description?: string;
}

export interface UpdateConfigurationRequest {
  key?: string;
  value?: unknown;
  description?: string;
}

export interface ApiError {
  error: {
    type: string;
    message: string;
    status: number;
  };
}
