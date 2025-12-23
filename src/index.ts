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
 *   Sessions:
 *     - legiscan_get_session_list: List legislative sessions
 *
 *   Bills:
 *     - legiscan_get_master_list: Get all bills in a session
 *     - legiscan_get_master_list_raw: Get bill IDs with change hashes
 *     - legiscan_get_bill: Get detailed bill information
 *     - legiscan_get_bill_text: Get bill text document
 *     - legiscan_get_amendment: Get amendment document
 *     - legiscan_get_supplement: Get supplemental document
 *     - legiscan_get_roll_call: Get vote details
 *
 *   People:
 *     - legiscan_get_person: Get legislator information
 *     - legiscan_get_session_people: Get all legislators in session
 *     - legiscan_get_sponsored_list: Get bills sponsored by legislator
 *
 *   Search:
 *     - legiscan_search: Full-text search (50 results/page)
 *     - legiscan_search_raw: Full-text search (2000 results/page)
 *
 *   Datasets:
 *     - legiscan_get_dataset_list: List available bulk datasets
 *     - legiscan_get_dataset: Download dataset ZIP
 *
 *   Monitor:
 *     - legiscan_get_monitor_list: Get GAITS monitor list
 *     - legiscan_get_monitor_list_raw: Get monitor list (minimal)
 *     - legiscan_set_monitor: Add/remove from monitor list
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";

import { LegiScanClient, LegiScanError } from "./legiscan-client.js";
import { registerSessionTools } from "./tools/sessions.js";
import { registerBillTools } from "./tools/bills.js";
import { registerPeopleTools } from "./tools/people.js";
import { registerSearchTools } from "./tools/search.js";
import { registerDatasetTools } from "./tools/datasets.js";
import { registerMonitorTools } from "./tools/monitor.js";

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
  registerSessionTools(server, client);
  registerBillTools(server, client);
  registerPeopleTools(server, client);
  registerSearchTools(server, client);
  registerDatasetTools(server, client);
  registerMonitorTools(server, client);

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
