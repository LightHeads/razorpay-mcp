import Razorpay from 'razorpay';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Zod schemas for validation
const ServerConfigSchema = z.object({
  razorpayKeyId: z.string().min(1),
  razorpayKeySecret: z.string().min(1)
});

const PaymentRequestSchema = z.object({
  id: z.string().min(1)
});

const PaymentResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
});

export const createRazorPayMCPServer = (config: z.infer<typeof ServerConfigSchema>) => {
  // Validate config
  const validatedConfig = ServerConfigSchema.parse(config);

  // Initialize Razorpay client
  const razorpay = new Razorpay({
    key_id: validatedConfig.razorpayKeyId,
    key_secret: validatedConfig.razorpayKeySecret
  });

  const server = new McpServer({
    transports: {
      stdio: true,
      ssse: true
    },
    name: 'razorpay-mcp',
    version: '1.0.0',
    methods: {
      // Get payment details
      getPayment: async (params: any) => {
        try {
          // Validate input parameters
          const { id } = PaymentRequestSchema.parse(params);
          
          const payment = await razorpay.payments.fetch(id);
          const response = { success: true, data: payment };
          
          // Validate response
          return PaymentResponseSchema.parse(response);
        } catch (error: any) {
          const errorResponse = { success: false, error: error };
          return PaymentResponseSchema.parse(errorResponse);
        }
      }
    }
  });

  return server;
};
