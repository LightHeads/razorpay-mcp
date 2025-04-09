# Razorpay MCP Server

An unofficial Model Context Protocol (MCP) server for interacting with the Razorpay payment gateway API. This package provides a seamless integration between AI assistants and the Razorpay payment platform.

## Features

- Implements the Model Context Protocol (MCP) for AI assistant integration
- Provides simple methods to access Razorpay API endpoints
- Supports stdio transport
- Complete TypeScript support with strict type checking

## Installation

```bash
pnpm add razorpay-mcp
```

## Quick Start

### Configure with environment variables

```bash
export RAZORPAY_KEY_ID="your_razorpay_key_id"
export RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### Start the MCP server

```bash
pnpm razorpay-mcp --key-id="your_razorpay_key_id" --key-secret="your_razorpay_key_secret"
```
## Available Methods

The following Razorpay API methods are available:

### Orders

- `getAllOrders` - Fetch all orders with pagination support

### Payments

- `getAllPayments` - Fetch all payments with pagination support

### Settlements

- `getAllSettlements` - Fetch all settlements with pagination support

## Pagination Parameters

All methods support the following pagination parameters:

| Parameter | Type   | Description                       |
|-----------|--------|-----------------------------------|
| skip      | number | Number of records to skip         |
| count     | number | Number of records to fetch        |
| from      | number | Start timestamp for date filtering |
| to        | number | End timestamp for date filtering   |

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/razorpay-mcp.git
cd razorpay-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint
```

## Razorpay Documentation

For more information about Razorpay APIs, refer to:

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Orders API](https://razorpay.com/docs/api/orders/)
- [Payments API](https://razorpay.com/docs/api/payments/)
- [Settlements API](https://razorpay.com/docs/api/settlements/)

## About Model Context Protocol (MCP)

The Model Context Protocol (MCP) allows AI assistants to securely access external systems and APIs. Learn more at [MCP SDK Documentation](https://github.com/ModelContextProtocol/sdk).
