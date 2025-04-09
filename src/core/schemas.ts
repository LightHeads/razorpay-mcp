import { z } from 'zod';

export const RazorpayPaginationSchema = z.object({
  skip: z.number().int().min(0).optional(),
  count: z.number().int().min(1).max(100).optional(),
  from: z.number().int().positive().optional(),
  to: z.number().int().positive().optional(),
});

export type RazorpayPaginationOptions = z.infer<typeof RazorpayPaginationSchema>;

export type RazorpayQuery = {
  skip?: number;
  count?: number;
  from?: number;
  to?: number;
};

export const ServerConfigSchema = z.object({
  razorpayKeyId: z.string().min(1, "Razorpay Key ID cannot be empty"),
  razorpayKeySecret: z.string().min(1, "Razorpay Key Secret cannot be empty"),
});
export type ServerConfig = z.infer<typeof ServerConfigSchema>;

export const AccountBalanceParamsSchema = z.object({
  accountId: z.string().min(1, "Account ID cannot be empty"),
});
export type AccountBalanceParams = z.infer<typeof AccountBalanceParamsSchema>; 