import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { RazorpayService } from './razorpay.service.js';
import { 
  ServerConfigSchema, 
  type ServerConfig,
  RazorpayPaginationSchema, 
  type RazorpayPaginationOptions,
  AccountBalanceParamsSchema,
  type AccountBalanceParams
} from './schemas.js';

export const createRazorPayMCPServer = (config: ServerConfig) => {
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
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllOrders(options);
        // MCP expects a specific return format (e.g., { content: [{ type: 'text', text: '...' }] })
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
    async (params: RazorpayPaginationOptions) => {
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
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllSettlements(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllRefunds',
    'Fetch all refunds with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllRefunds(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllDisputes',
    'Fetch all disputes with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllDisputes(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllInvoices',
    'Fetch all invoices with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllInvoices(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAccountBalance',
    'Fetch account balance for a specific account',
    AccountBalanceParamsSchema.shape,
    async (params: AccountBalanceParams) => {
      try {
        const { accountId } = AccountBalanceParamsSchema.parse(params);
        const data = await razorpayService.getAccountBalance(accountId);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllContacts',
    'Fetch all contacts with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllContacts(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllTransactions',
    'Fetch all transactions with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllTransactions(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllVPAs',
    'Fetch all VPAs (Virtual Payment Addresses) with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllVPAs(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  );

  server.tool(
    'getAllCustomers',
    'Fetch all customers with pagination support',
    RazorpayPaginationSchema.shape,
    async (params: RazorpayPaginationOptions) => {
      try {
        const options = RazorpayPaginationSchema.parse(params);
        const data = await razorpayService.getAllCustomers(options);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, data }) }] };
      } catch (error: any) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }] };
      }
    }
  )

  
  return server;
};
