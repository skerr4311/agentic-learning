import { Type, Static } from "@sinclair/typebox";

export const CreateApplicationSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const UpdateApplicationSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
});

export const ApplicationParamsSchema = Type.Object({
  applicationId: Type.String({ format: "uuid" }),
});

export type CreateApplicationType = Static<typeof CreateApplicationSchema>;
export type UpdateApplicationType = Static<typeof UpdateApplicationSchema>;
export type ApplicationParamsType = Static<typeof ApplicationParamsSchema>;
