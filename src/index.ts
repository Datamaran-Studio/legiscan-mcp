#!/usr/bin/env node

/**
 * LegiScan MCP Server
 *
 * Provides access to the LegiScan legislative data API through the
 * Model Context Protocol (MCP). Enables AI assistants to search,
 * retrieve, and analyze legislative data from all 50 US states.
 *
 * Environment Variables:
 *   LEGISCAN_API_KEY - Your LegiScan API key (required)
 *
 * Available Tools:
 *   Composite (High-Level Research):
 *     - legiscan_find_legislator: Find legislator by name
 *     - legiscan_get_legislator_votes: Get how a legislator voted on bills
 *     - legiscan_get_primary_authored: Get primary authored bills only
 *
 *   Bills:
 *     - legiscan_get_bill: Get detailed bill information
 *     - legiscan_find_bill_by_number: Find bill by number (AB 858, etc.)
 *     - legiscan_get_roll_call: Get vote details
 *
 *   People:
 *     - legiscan_get_person: Get legislator information
 *     - legiscan_get_session_people: Get all legislators in session
 *
 *   Search:
 *     - legiscan_search: Full-text search
 *
 *   Sessions:
 *     - legiscan_get_session_list: List legislative sessions
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";

import { LegiScanClient } from "./legiscan-client.js";
import { registerSessionTools } from "./tools/sessions.js";
import { registerBillTools } from "./tools/bills.js";
import { registerPeopleTools } from "./tools/people.js";
import { registerSearchTools } from "./tools/search.js";
import { registerCompositeTools } from "./tools/composite.js";

// Load environment variables
config();

async function main() {
  // Get API key from environment
  const apiKey = process.env.LEGISCAN_API_KEY;

  if (!apiKey) {
    console.error(
      "Error: LEGISCAN_API_KEY environment variable is required.\n" +
        "Get your API key at: https://legiscan.com/legiscan"
    );
    process.exit(1);
  }

  // Create LegiScan client
  let client: LegiScanClient;
  try {
    client = new LegiScanClient(apiKey);
  } catch (error) {
    console.error(
      `Error initializing LegiScan client: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }

  // Create MCP server
  const server = new McpServer({
    name: "legiscan",
    version: "1.0.0",
  });

  // Register all tools
  registerCompositeTools(server, client); // High-level research tools
  registerBillTools(server, client);
  registerPeopleTools(server, client);
  registerSearchTools(server, client);
  registerSessionTools(server, client);

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
