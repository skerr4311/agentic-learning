import type {
  Application,
  Configuration,
  CreateApplicationRequest,
  CreateConfigurationRequest,
  UpdateApplicationRequest,
  UpdateConfigurationRequest,
} from "../types";

const API_BASE = "/api/v1";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "An error occurred");
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async getApplications(): Promise<{ items: Application[] }> {
    return this.request("/applications");
  }

  async getApplication(id: string): Promise<Application> {
    return this.request(`/applications/${id}`);
  }

  async createApplication(
    data: CreateApplicationRequest,
  ): Promise<Application> {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateApplication(
    id: string,
    data: UpdateApplicationRequest,
  ): Promise<Application> {
    return this.request(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id: string): Promise<void> {
    return this.request(`/applications/${id}`, {
      method: "DELETE",
    });
  }

  async getConfigurations(
    applicationId: string,
  ): Promise<{ items: Configuration[] }> {
    return this.request(`/applications/${applicationId}/configurations`);
  }

  async getConfiguration(
    applicationId: string,
    configurationId: string,
  ): Promise<Configuration> {
    return this.request(
      `/applications/${applicationId}/configurations/${configurationId}`,
    );
  }

  async createConfiguration(
    applicationId: string,
    data: CreateConfigurationRequest,
  ): Promise<Configuration> {
    return this.request(`/applications/${applicationId}/configurations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateConfiguration(
    applicationId: string,
    configurationId: string,
    data: UpdateConfigurationRequest,
  ): Promise<Configuration> {
    return this.request(
      `/applications/${applicationId}/configurations/${configurationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  }

  async deleteConfiguration(
    applicationId: string,
    configurationId: string,
  ): Promise<void> {
    return this.request(
      `/applications/${applicationId}/configurations/${configurationId}`,
      {
        method: "DELETE",
      },
    );
  }
}

export const apiClient = new ApiClient();
