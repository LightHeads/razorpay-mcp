#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { parseArgs } from 'node:util';
import { createRazorPayMCPServer } from '../core/mcp-server.js';
import { z } from 'zod';

const RazorpayConfigSchema = z.object({
  razorpayKeyId: z.string().min(1, "Razorpay Key ID is required"),
  razorpayKeySecret: z.string().min(1, "Razorpay Key Secret is required"),
});

async function main() {
  const {
    values: {
      ['key-id']: keyId,
      ['key-secret']: keySecret,
    },
  } = parseArgs({
    options: {
      ['key-id']: {
        type: 'string',
        required: true,
      },
      ['key-secret']: {
        type: 'string',
        required: true,
      },
    },
    allowPositionals: false,
  });

  // Use Razorpay credentials ONLY from CLI arguments
  const razorpayKeyId = keyId;
  const razorpayKeySecret = keySecret;

  // Basic check (Zod will do a more thorough check later)
  if (!razorpayKeyId || !razorpayKeySecret) {
    console.error("Error: --key-id and --key-secret arguments are required.");
    process.exit(1);
  }

  try {
    // Zod validation will now effectively just check format, as presence is checked above
    const validatedConfig = RazorpayConfigSchema.safeParse({
      razorpayKeyId,
      razorpayKeySecret,
    });

    if (!validatedConfig.success) {
      validatedConfig.error.errors.forEach((err) => {
        console.error(`- ${err.message}`);
      });
      process.exit(1);
    }

    const mcpServer = createRazorPayMCPServer(validatedConfig.data);
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.log('Razorpay MCP server started');
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);