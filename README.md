# Razorpay MCP Server

[![npm version](https://badge.fury.io/js/razorpay-mcp.svg)](https://badge.fury.io/js/razorpay-mcp) <!-- Replace 'razorpay-mcp' with your actual package name -->

Provides a Model Context Protocol (MCP) server interface for interacting with the Razorpay API. Supports both stdio and SSE (Server-Sent Events) transports.

## Features

*   Interact with various Razorpay endpoints (Orders, Payments, Settlements, Customers, etc.) via MCP.
*   Run as a command-line tool using stdio.
*   Run as an HTTP server using SSE (powered by Fastify).
*   Type-safe interactions using Zod schemas and TypeScript.
*   Configurable via environment variables or command-line arguments.

## Installation

```bash
npm install razorpay-mcp # Replace with your actual package name on npm
```

## Usage

### 1. As a Library (e.g., in your own Node.js application)

You can integrate the server creation logic into your own application.

```typescript
import { createRazorPayMCPServer, ServerConfig } from 'razorpay-mcp'; // Use your package name
import { StdioServerTransport, SseServerTransport } from '@modelcontextprotocol/sdk/server'; // Assuming users install SDK too
import Fastify from 'fastify';

// Configuration (get from env vars, config files, etc.)
const config: ServerConfig = {
  razorpayKeyId: process.env.RAZORPAY_KEY_ID!,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET!,
};

// --- Option A: Stdio Transport ---
async function runStdio() {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    console.error("Razorpay Key ID and Secret are required.");
    process.exit(1);
  }
  const mcpServer = createRazorPayMCPServer(config);
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.log('Custom Razorpay MCP server started with stdio transport');
}

// --- Option B: SSE Transport ---
async function runSse(port = 3000, host = '127.0.0.1') {
   if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    console.error("Razorpay Key ID and Secret are required.");
    process.exit(1);
  }
  const mcpServer = createRazorPayMCPServer(config);
  const fastify = Fastify({ logger: true });
  // Add CORS if needed: await fastify.register(cors, { origin: '*' });
  const transport = new SseServerTransport({ fastify });
  await mcpServer.connect(transport);
  await fastify.listen({ port, host });
  console.log(`Custom Razorpay MCP server started with SSE transport on http://${host}:${port}`);
}

// Choose which transport to run
// runStdio().catch(console.error);
// runSse().catch(console.error);
```

### 2. As a Command-Line Tool

The package provides two commands that can be run directly using `npx` or after global installation.

**Configuration:**

Credentials can be provided via:

*   Command-line arguments: `--key-id <your_key_id> --key-secret <your_key_secret>`
*   Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

The SSE server also accepts `--port <port_number>` (or `PORT` env var) and `--host <hostname>` (or `HOST` env var).

**Running the Stdio Server:**

```bash
npx razorpay-mcp-stdio --key-id <your_key_id> --key-secret <your_key_secret>
# or using env vars
export RAZORPAY_KEY_ID=<your_key_id>
export RAZORPAY_KEY_SECRET=<your_key_secret>
npx razorpay-mcp-stdio
```

**Running the SSE Server:**

```bash
npx razorpay-mcp-sse --key-id <your_key_id> --key-secret <your_key_secret> --port 3001
# or using env vars
export RAZORPAY_KEY_ID=<your_key_id>
export RAZORPAY_KEY_SECRET=<your_key_secret>
export PORT=3001
npx razorpay-mcp-sse
```

This server will then be available at `http://127.0.0.1:3001` (or the specified host/port).

### 3. Integrating with MCP Clients (e.g., Cursor)

Configure your MCP client (like in `.cursor/mcp.json`) to use one of the commands.

**Example for Stdio (Choose One):**

*Method A: Using `npx` (Recommended for published/installed packages)*

```json
{
  "mcpServers": {
    "razorpay-mcp-npx": {
      "command": "npx",
      "args": [
        "-y", 
        "razorpay-mcp", // Replace with your actual package name if different
        "razorpay-mcp-stdio", 
        "--key-id", "<your_key_id>",
        "--key-secret", "<your_key_secret>"
      ],
      "env": {
        "RAZORPAY_KEY_ID": "<your_key_id>",
        "RAZORPAY_KEY_SECRET": "<your_key_secret>"
      }
    }
  }
}
```

*Method B: Direct Execution with Full Paths (Recommended for local development)*

This method avoids issues with `npx` path resolution during development. Ensure you have run `npm run build` first.

```json
{
  "mcpServers": {
    "razorpay-mcp-local": {
      "command": "/full/path/to/your/node", 
      "args": [
        "/full/path/to/your/project/razorpay-mcp/dist/stdio.js", 
        "--key-id", "<your_key_id>",
        "--key-secret", "<your_key_secret>"
      ]
    }
  }
}
```
*(Replace `/full/path/to/your/node` and `/full/path/to/your/project/razorpay-mcp/dist/stdio.js` with the actual absolute paths on your system. You can find the node path using `which node` in your terminal.)*

**Example for SSE:**

1.  **Run the SSE Server:** First, start the SSE server independently, either using `npx` or Docker as shown in the sections above. Make sure it's listening on an accessible host and port (e.g., `http://127.0.0.1:3000`).

    ```bash
    # Example using npx (run in a separate terminal or using a process manager like pm2)
    export RAZORPAY_KEY_ID=<your_key_id>
    export RAZORPAY_KEY_SECRET=<your_key_secret>
    export PORT=3000
    npx razorpay-mcp-sse
    ```

2.  **Configure the Client:** Configure your MCP client to connect to the running server's URL. The exact configuration format depends on the client. If the client supports specifying an HTTP endpoint directly (this might not be standard in all `mcp.json` formats), it might look something like this *hypothetical* example:

    ```json
    {
      "mcpServers": {
        "myRazorpaySse": {
          // Hypothetical configuration for a client supporting direct HTTP endpoints
          "httpEndpoint": "http://127.0.0.1:3000", // URL where the SSE server is running
          "ssePath": "/sse", // The path specified in sse.ts (default: /sse)
          "messagePath": "/messages" // The path specified in sse.ts (default: /messages)
          // Note: Authentication/headers might be handled differently depending on the client
        }
      }
    }
    ```
    *(**Important:** Verify your specific MCP client's documentation for the correct way to configure connections to HTTP/SSE endpoints. The standard `command`/`args` method used for stdio might not apply directly to SSE.)*

## Docker Usage

You can build and run this MCP server using Docker.

**1. Build the Image:**

From the root of the project directory, run:

```bash
docker build -t razorpay-mcp .
```
*(Replace `razorpay-mcp` with your preferred image name)*

**2. Run the Container:**

You can run either the `stdio` or `sse` server by overriding the default command. Pass configuration via environment variables.

**Running the Stdio Server:**

```bash
docker run --rm -i \
  -e RAZORPAY_KEY_ID=<your_key_id> \
  -e RAZORPAY_KEY_SECRET=<your_key_secret> \
  razorpay-mcp node dist/stdio.js # Override CMD to specify stdio explicitly (or rely on default)
```
*(Note: `-i` is important for stdio interaction)*

**Running the SSE Server:**

```bash
docker run --rm -p 3000:3000 \
  -e RAZORPAY_KEY_ID=<your_key_id> \
  -e RAZORPAY_KEY_SECRET=<your_key_secret> \
  -e PORT=3000 \ # Port inside the container
  -e HOST=0.0.0.0 \ # Listen on all interfaces inside the container
  razorpay-mcp node dist/sse.js # Override CMD to specify sse
```
*(The server will be accessible on `http://localhost:3000` on your host machine)*

You can adjust the `-p` flag (e.g., `-p 8080:3000`) to map the container's port 3000 to a different port on your host.

**Integrating with MCP Clients (Docker):**

If your MCP client (like Cursor) runs commands, you might configure it to use `docker run ...` instead of `npx`. The exact configuration depends on the client's capabilities. For clients expecting an HTTP endpoint, you would run the SSE container and provide its URL (e.g., `http://localhost:3000/sse` based on the example above).

## Development

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Build the project: `npm run build`
4.  Lint/Format: `npm run lint`, `npm run format`

## License

Apache-2.0
