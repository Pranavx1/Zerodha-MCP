import { placeOrder } from "./trade.ts";
import { getPortfolio } from "./trade.ts";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// Add an addition tool
server.tool(
  "buy-stock",
  "Buys an actual stock in my portfolio on zerodha exchnge",
  { stock: z.string(), qty: z.number() },
  async ({ stock, qty }) => {
    const response = await placeOrder(stock, "BUY", qty);
    return {
      content: [{ type: "text", text: `${response}` }],
    };
  }
);
server.tool(
  "Sell-stock",
  "Sells an actual stock in my portfolio on zerodha exchnge",
  { stock: z.string(), qty: z.number() },
  async ({ stock, qty }) => {
    const response = await placeOrder(stock, "SELL", qty);
    return {
      content: [{ type: "text", text: `${response}` }],
    };
  }
);
server.tool(
  "Get-Portfolio",
  "Gets my actual portfolio on zerodha exchnge",
  {},
  async () => {
    return {
      content: [{ type: "text", text: `Portfolio: ${await getPortfolio()}` }],
    };
  }
);
// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
