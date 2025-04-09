import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { RazorpayService, RazorpayPaginationSchema } from './razorpay/index.js';

// Zod schemas for validation
const ServerConfigSchema = z.object({
  razorpayKeyId: z.string().min(1),
  razorpayKeySecret: z.string().min(1)
});

const ResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
});

const AccountBalanceSchema = z.object({ accountId: z.string() });

type RazorpayPaginationParams = z.infer<typeof RazorpayPaginationSchema>;
type AccountBalanceParams = z.infer<typeof AccountBalanceSchema>;

export const createRazorPayMCPServer = (config: z.infer<typeof ServerConfigSchema>) => {
  // Validate config
  const validatedConfig = ServerConfigSchema.parse(config);

  // Initialize Razorpay service
  const razorpayService = new RazorpayService(
    validatedConfig.razorpayKeyId,
    validatedConfig.razorpayKeySecret
  );

  const server: McpServer = new McpServer({
    transports: {
      stdio: true,
      ssse: true
    },
    name: 'razorpay-mcp',
    version: '1.0.0',
  });

  // Register tools using the server.tool() method
  server.tool(
    'getAllOrders',
    'Fetch all orders with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationParams) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllOrders(options);
        // MCP expects a specific return format (e.g., { content: [{ type: 'text', text: '...' }] })
        // Adjusting the return to be more MCP-idiomatic. Assuming simple JSON string for now.
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllPayments',
    'Fetch all payments with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationParams) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllPayments(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllSettlements',
    'Fetch all settlements with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationParams) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllSettlements(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  
  return server;
};
