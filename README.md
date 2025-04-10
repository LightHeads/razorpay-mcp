# Razorpay MCP Server

> Connect your Razorpay payment gateway to Cursor, Claude, Windsurf, and other AI assistants.

An unofficial Model Context Protocol (MCP) server for interacting with the Razorpay payment gateway API. This package provides a seamless integration between AI assistants and the Razorpay payment platform.

The [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) standardizes how Large Language Models (LLMs) talk to external services like Razorpay. It connects AI assistants directly with your Razorpay account and allows them to manage orders, payments, settlements, and more. See the [full list of tools](#available-tools).

## Prerequisites

You will need Node.js installed on your machine. You can check this by running:

```shell
node -v
```

If you don't have Node.js installed, you can download it from [nodejs.org](https://nodejs.org/).

## Setup

### 1. Razorpay API Keys

First, go to your [Razorpay Dashboard](https://dashboard.razorpay.com/) > Settings > API Keys and generate a key pair. You'll need both the Key ID and Key Secret.

Make sure to copy both values, as you won't be able to see the Key Secret again.

### 2. Configure MCP Client

Next, configure your MCP client (such as Cursor) to use this server. Most MCP clients store the configuration as JSON in the following format:

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "npx",
      "args": [
        "-y",
        "razorpay-mcp@latest",
        "--key-id",
        "rzp_test_yourkeyid",
        "--key-secret",
        "yoursecretkey"
      ]
    }
  }
}
```

Replace `rzp_test_yourkeyid` and `yoursecretkey` with your Razorpay API credentials.

If you are on Windows, you will need to [prefix the command](#windows). If your MCP client doesn't accept JSON, the direct CLI command is:

```shell
npx -y razorpay-mcp@latest --key-id=rzp_test_yourkeyid --key-secret=yoursecretkey
```

> Note: Do not run this command directly - this is meant to be executed by your MCP client in order to start the server. `npx` automatically downloads the latest version of the MCP server from `npm` and runs it in a single command.

#### Windows

On Windows, you will need to prefix the command with `cmd /c`:

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "razorpay-mcp@latest",
        "--key-id",
        "rzp_test_yourkeyid",
        "--key-secret",
        "yoursecretkey"
      ]
    }
  }
}
```

or with `wsl` if you are running Node.js inside WSL:

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "wsl",
      "args": [
        "npx",
        "-y", 
        "razorpay-mcp@latest",
        "--key-id",
        "rzp_test_yourkeyid",
        "--key-secret",
        "yoursecretkey"
      ]
    }
  }
}
```

## Alternative Setups

### Running as a Standalone Server

You can also run this package as a standalone server using Server-Sent Events (SSE):

```bash
pnpm install razorpay-mcp
pnpm razorpay-mcp-sse --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001
```

This server will be available at `http://localhost:3001/sse` for clients to connect.

### Docker Usage

You can build and run this MCP server using Docker.

**1. Build the Image:**

```bash
docker build -t razorpay-mcp .
```

**2. Run the Container:**

```bash
docker run --rm -p 3001:3001 \
  razorpay-mcp node dist/transports/sse.js --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001
```

The server will be accessible on `http://localhost:3001/sse` on your host machine.

## Available Tools

The following Razorpay tools are available to the LLM:

### Orders and Payments

- `getAllOrders`: Fetch all orders with pagination support
- `getAllPayments`: Fetch all payments with pagination support
- `getAllRefunds`: Fetch all refunds with pagination support

### Financials

- `getAllSettlements`: Fetch all settlements with pagination support
- `getAccountBalance`: Fetch account balance for a specific account
- `getAllTransactions`: Fetch all transactions with pagination support

### Customer Management

- `getAllContacts`: Fetch all contacts with pagination support
- `getAllCustomers`: Fetch all customers with pagination support
- `getAllVPAs`: Fetch all VPAs (Virtual Payment Addresses) with pagination support

### Documentation and Support

- `getAllInvoices`: Fetch all invoices with pagination support
- `getAllDisputes`: Fetch all disputes with pagination support

All pagination options accept these parameters:
* `count` - Number of records to fetch (max 100)
* `skip` - Number of records to skip
* `from` - Start timestamp
* `to` - End timestamp

## Resources

- [**Model Context Protocol**](https://modelcontextprotocol.io/introduction): Learn more about MCP and its capabilities.
- [**Razorpay API Documentation**](https://razorpay.com/docs/api/): Learn more about the Razorpay API.

## License

Apache-2.0
