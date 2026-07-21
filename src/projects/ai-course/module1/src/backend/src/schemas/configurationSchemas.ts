import { Type, Static } from "@sinclair/typebox";

export const CreateConfigurationSchema = Type.Object({
  key: Type.String({ minLength: 1, maxLength: 255 }),
  value: Type.Any(),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const UpdateConfigurationSchema = Type.Object({
  key: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  value: Type.Optional(Type.Any()),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const ConfigurationParamsSchema = Type.Object({
  applicationId: Type.String({ format: "uuid" }),
  configurationId: Type.String({ format: "uuid" }),
});

export type CreateConfigurationType = Static<typeof CreateConfigurationSchema>;
export type UpdateConfigurationType = Static<typeof UpdateConfigurationSchema>;
export type ConfigurationParamsType = Static<typeof ConfigurationParamsSchema>;
