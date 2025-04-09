#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { parseArgs } from 'node:util';
import { version } from './package.json';
import { createRazorPayMCPServer } from './server.js';
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
  });

  // Use Razorpay credentials from CLI arguments or environment variables
  const razorpayKeyId = keyId ?? process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = keySecret ?? process.env.RAZORPAY_KEY_SECRET;

  try {
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
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);