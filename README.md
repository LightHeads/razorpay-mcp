# Razorpay MCP Server

[![npm version](https://badge.fury.io/js/razorpay-mcp.svg)](https://badge.fury.io/js/razorpay-mcp) 

An unofficial Model Context Protocol (MCP) server for interacting with the Razorpay payment gateway API. This package provides a seamless integration between AI assistants and the Razorpay payment platform.

## Features

* Interact with various Razorpay endpoints (Orders, Payments, Settlements, Customers, etc.) via MCP
* Run as a command-line tool using stdio
* Run as an HTTP server using Server-Sent Events (SSE)
* Type-safe interactions using Zod schemas and TypeScript
* Configurable via command-line arguments

## Installation

```bash
pnpm install razorpay-mcp
```

## Usage

### Running as a Command-Line Tool

The package provides two execution modes that can be run directly using `npx` or after installation.

**Configuration:**

Provide your Razorpay credentials via command-line arguments:
* `--key-id <your_key_id>` - Your Razorpay Key ID
* `--key-secret <your_key_secret>` - Your Razorpay Key Secret

For the SSE server, you can also specify:
* `--port <port_number>` - Default is 3001

**Running the Stdio Server:**

```bash
npx razorpay-mcp-stdio --key-id rzp_test_yourkeyid --key-secret yoursecretkey
```

**Running the SSE Server:**

```bash
npx razorpay-mcp-sse --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001
```

This server will be available at `http://localhost:3001/sse` for clients to connect.

### Integrating With MCP Clients

#### Cursor

Configure your MCP client in Cursor by adding this to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "npx",
      "args": [
        "razorpay-mcp", 
        "--key-id", "rzp_test_yourkeyid",
        "--key-secret", "yoursecretkey"
      ]
    }
  }
}
```

#### Claude or Other AI Assistants

For Claude or other AI assistants that support MCP, you have two options:

1. **Stdio Integration:**
   Configure the assistant to spawn the MCP server with appropriate credentials

2. **SSE Integration:**
   - Start the SSE server independently: `npx razorpay-mcp-sse --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001`
   - Configure the AI assistant to connect to `http://localhost:3001/sse`

#### Web Applications

For web applications, use the SSE server:

1. Start the SSE server: `npx razorpay-mcp-sse --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001`

2. Connect from your web app:
   ```javascript
   // Create SSE connection
   const eventSource = new EventSource('http://localhost:3001/sse');
   
   // Listen for the initial connection event
   eventSource.addEventListener('connected', (event) => {
     const data = JSON.parse(event.data);
     const sessionId = data.sessionId;
     console.log(`Connected with session ID: ${sessionId}`);
   });
   
   // Send API requests
   async function callRazorpayAPI(toolName, params) {
     const response = await fetch(`http://localhost:3001/messages?sessionId=${sessionId}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         type: 'toolCall',
         id: Date.now().toString(),
         name: toolName,
         params: params
       })
     });
     return await response.json();
   }
   ```

## Docker Usage

You can build and run this MCP server using Docker.

**1. Build the Image:**

```bash
docker build -t razorpay-mcp .
```

**2. Run the Container:**

**Running the Stdio Server:**

```bash
docker run --rm -i \
  razorpay-mcp node dist/stdio.js --key-id rzp_test_yourkeyid --key-secret yoursecretkey
```

**Running the SSE Server:**

```bash
docker run --rm -p 3001:3001 \
  razorpay-mcp node dist/sse.js --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001
```

The server will be accessible on `http://localhost:3001/sse` on your host machine.

**Connecting to the Docker-hosted SSE Server:**

Use the same client-side code as shown in the Web Applications section, but make sure your host machine can access the container's port.

## Available Razorpay Endpoints

This MCP server provides access to these Razorpay API endpoints:

* `getAllOrders` - Fetch all orders with pagination
* `getAllPayments` - Fetch all payments with pagination
* `getAllSettlements` - Fetch all settlements with pagination
* `getAllRefunds` - Fetch all refunds with pagination
* `getAllDisputes` - Fetch all disputes with pagination
* `getAllInvoices` - Fetch all invoices with pagination
* `getAccountBalance` - Fetch account balance for a specific account
* `getAllContacts` - Fetch all contacts with pagination
* `getAllTransactions` - Fetch all transactions with pagination
* `getAllVPAs` - Fetch all VPAs (Virtual Payment Addresses) with pagination
* `getAllCustomers` - Fetch all customers with pagination

All pagination options accept these parameters:
* `count` - Number of records to fetch (max 100)
* `skip` - Number of records to skip
* `from` - Start timestamp
* `to` - End timestamp

## License

Apache-2.0
