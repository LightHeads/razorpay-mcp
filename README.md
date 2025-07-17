[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/lightheads-razorpay-mcp-badge.png)](https://mseep.ai/app/lightheads-razorpay-mcp)

# Razorpay MCP Server

> Connect your Razorpay payment gateway to AI assistants using the Model Context Protocol

A Model Context Protocol (MCP) server for interacting with the Razorpay payment gateway API. This package enables AI assistants like Cursor, Claude, and Copilot to directly access your Razorpay account data through a standardized interface.

## Quick Start

The most reliable way to use this package:

```bash
# Install globally first
npm install -g razorpay-mcp@0.1.4

# Then use the binary directly
razorpay-mcp-stdio --key-id rzp_test_yourkeyid --key-secret yoursecretkey
```

## Cursor Configuration

After installing globally, add this configuration to your `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "razorpay-mcp-stdio",
      "args": [
        "--key-id",
        "rzp_test_yourkeyid",
        "--key-secret",
        "yoursecretkey"
      ]
    }
  }
}
```

### For Windows Users

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "cmd",
      "args": [
        "/c",
        "razorpay-mcp-stdio",
        "--key-id",
        "rzp_test_yourkeyid",
        "--key-secret",
        "yoursecretkey"
      ]
    }
  }
}
```

## For Web Applications (Using SSE)

1. Start the SSE server:

```bash
# Install globally first
npm install -g razorpay-mcp@0.1.4

# Then use the binary directly
razorpay-mcp-sse --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001
```

2. Connect from your web app:

```javascript
// Create SSE connection
const eventSource = new EventSource('http://localhost:3001/sse');

// Handle connection event
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // If this is a hello message, store the sessionId
  if (data.type === 'hello') {
    const sessionId = data.sessionId;
    console.log(`Connected with session ID: ${sessionId}`);
    
    // Now you can make API calls
    callRazorpayAPI(sessionId, 'getAllPayments', {count: 10});
  }
};

// Send API requests
async function callRazorpayAPI(sessionId, toolName, params) {
  const response = await fetch(`http://localhost:3001/messages?sessionId=${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'toolCall',
      id: Date.now().toString(),
      name: toolName,
      params
    })
  });
  return response.json();
}
```

## Docker Usage

You can also run this MCP server using Docker:

### Build the Docker Image

```bash
# Clone the repository
git clone https://github.com/yourusername/razorpay-mcp.git
cd razorpay-mcp

# Build the Docker image
docker build -t razorpay-mcp .
```

### Run the Container

For the stdio transport (for direct use with Cursor):

```bash
docker run --rm -it razorpay-mcp node dist/transports/stdio.cjs \
  --key-id rzp_test_yourkeyid --key-secret yoursecretkey
```

For the SSE server (for web applications):

```bash
docker run --rm -p 3001:3001 razorpay-mcp node dist/transports/sse.cjs \
  --key-id rzp_test_yourkeyid --key-secret yoursecretkey --port 3001
```

## Available Razorpay Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `getAllPayments` | Fetch payments with pagination | `count`, `skip`, `from`, `to` |
| `getAllOrders` | Fetch orders with pagination | `count`, `skip`, `from`, `to` |
| `getAllSettlements` | Fetch settlements with pagination | `count`, `skip`, `from`, `to` |
| `getAllRefunds` | Fetch refunds with pagination | `count`, `skip`, `from`, `to` |
| `getAllDisputes` | Fetch disputes with pagination | `count`, `skip`, `from`, `to` |
| `getAllInvoices` | Fetch invoices with pagination | `count`, `skip`, `from`, `to` |
| `getAllContacts` | Fetch contacts with pagination | `count`, `skip`, `from`, `to` |
| `getAllTransactions` | Fetch transactions with pagination | `count`, `skip`, `from`, `to` |
| `getAllVPAs` | Fetch Virtual Payment Addresses | `count`, `skip`, `from`, `to` |
| `getAllCustomers` | Fetch customers with pagination | `count`, `skip`, `from`, `to` |
| `getAccountBalance` | Fetch account balance | `accountId` |

All pagination parameters are optional:
- `count`: Number of items to fetch (default: 10, max: 100)
- `skip`: Number of items to skip
- `from`: Start timestamp
- `to`: End timestamp

## Resources

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)

## License

Apache-2.0
