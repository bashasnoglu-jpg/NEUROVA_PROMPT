import { z } from 'zod';

export const ALLOWED_METHODS = [
  "connect",
  "disconnect",
  "signMessage",
  "signTransaction",
] as const;

export const InpageMessageSchema = z.object({
  target: z.literal("NEUROVA::INPAGE"),
  payload: z.object({
    id: z.string().uuid(),
    method: z.enum(ALLOWED_METHODS),
    params: z.any().optional(),
  }),
});
export type InpageMessage = z.infer<typeof InpageMessageSchema>;