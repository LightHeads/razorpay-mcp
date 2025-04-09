#!/usr/bin/env node
import express from "express";
import { createRazorPayMCPServer } from '../core/mcp-server.js';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { parseArgs } from 'node:util';
import { z } from "zod";
import cors from "cors";

const RazorpayConfigSchema = z.object({
  razorpayKeyId: z.string().min(1, "Razorpay Key ID is required"),
  razorpayKeySecret: z.string().min(1, "Razorpay Key Secret is required"),
});

// Map to store active transport connections by sessionId
const transports: Record<string, any> = {};

async function main() {
  try {
    const {
      values: {
        ['key-id']: keyId,
        ['key-secret']: keySecret,
        ['port']: portArg,
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
        ['port']: {
          type: 'string',
          default: '3001',
        },
      },
      allowPositionals: false,
    });

    // Use Razorpay credentials ONLY from CLI arguments
    const razorpayKeyId = keyId;
    const razorpayKeySecret = keySecret;
    const PORT = parseInt(portArg, 10);

    // Validate port
    if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
      console.error('Error: Port must be a valid number between 1 and 65535');
      process.exit(1);
    }

    // Validate credentials
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Error: --key-id and --key-secret arguments are required.");
      process.exit(1);
    }

    // Zod validation
    const validatedConfig = RazorpayConfigSchema.safeParse({
      razorpayKeyId,
      razorpayKeySecret,
    });

    if (!validatedConfig.success) {
      console.error("Configuration validation failed:");
      validatedConfig.error.errors.forEach((err) => {
        console.error(`- ${err.message}`);
      });
      process.exit(1);
    }

    // Create MCP server
    const server = createRazorPayMCPServer(validatedConfig.data);
    
    // Create Express app
    const app = express();

    // Enable CORS for all routes
    app.use(cors());

    // Parse JSON bodies with increased size limit
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (_, res) => {
      res.status(200).json({ 
        status: 'ok',
        connections: Object.keys(transports).length,
        uptime: process.uptime()
      });
    });

    // SSE endpoint
    app.get("/sse", async (_, res) => {
        console.log("New SSE connection established");
        const transport = new SSEServerTransport('/messages', res);
        transports[transport.sessionId] = transport;
        
        res.on("close", () => {
          console.log(`Connection closed for session: ${transport.sessionId}`);
          delete transports[transport.sessionId];
        });
        
        await server.connect(transport);
      });


    // Message handling endpoint
    app.post("/messages", express.json({limit: '10mb'}), async (req, res) => {
      const sessionId = req.query.sessionId as string;
      console.log(`Processing message for session: ${sessionId}`);
      
      if (!sessionId) {
        console.error('Missing sessionId parameter');
        res.status(400).json({ error: 'Missing sessionId parameter' });
        return;
      }
      
      try {
        const transport = transports[sessionId];
        
        if (!transport) {
          console.warn(`No transport found for session: ${sessionId}`);
          res.status(404).json({ 
            error: 'No active connection found for this sessionId',
            message: 'Your connection may have timed out. Please reconnect to /sse endpoint.' 
          });
          return;
        }
        
        // Handle the message
        await transport.handlePostMessage(req, res, req.body);
      } catch (error: any) {
        console.error('Error processing message:', error);
        
        // Don't send response if it's already been sent
        if (!res.headersSent) {
          res.status(303).json({ 
            error: 'Error processing message', 
            message: error.message 
          });
        }
      }
    });

    // 404 handler
    app.use((_, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Razorpay MCP SSE Server running on http://localhost:${PORT}`);
      console.log(`Connect to SSE endpoint at http://localhost:${PORT}/sse`);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('Shutting down server...');
      process.exit(0);
    });
    
  } catch (error: any) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
