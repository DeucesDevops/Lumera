import { authLoginSchema, authRegisterSchema } from "@lumera/shared";
import { z } from "zod";

export const registerBodySchema = authRegisterSchema;
export const loginBodySchema = authLoginSchema;

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(20),
});

export const logoutBodySchema = refreshBodySchema;
