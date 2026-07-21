export interface Application {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Configuration {
  id: string;
  applicationId: string;
  key: string;
  value: any;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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
  value: any;
  description?: string;
}

export interface UpdateConfigurationRequest {
  key?: string;
  value?: any;
  description?: string;
}
