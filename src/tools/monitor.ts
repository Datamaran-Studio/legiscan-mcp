// GAITS Monitor MCP tools

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";

export function registerMonitorTools(server: McpServer, client: LegiScanClient) {
  // Get Monitor List
  server.tool(
    "legiscan_get_monitor_list",
    "Get bills on your GAITS monitor list. Shows tracked bills with their current status, stance (support/oppose/watch), and last action.",
    {
      record: z
        .string()
        .optional()
        .describe(
          "Filter: 'current' (default), 'archived', or year >= 2010"
        ),
    },
    async ({ record }) => {
      try {
        const bills = await client.getMonitorList(record);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(bills, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Monitor List Raw
  server.tool(
    "legiscan_get_monitor_list_raw",
    "Get monitor list with minimal data for change detection. Returns bill_id, number, stance, change_hash, and status only.",
    {
      record: z
        .string()
        .optional()
        .describe(
          "Filter: 'current' (default), 'archived', or year >= 2010"
        ),
    },
    async ({ record }) => {
      try {
        const bills = await client.getMonitorListRaw(record);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(bills, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Set Monitor
  server.tool(
    "legiscan_set_monitor",
    "Add, remove, or update bills on your GAITS monitor list. Use to track legislation with support/oppose/watch stance.",
    {
      list: z
        .string()
        .describe("Comma-separated bill_ids (e.g., '1234567,1234568')"),
      action: z
        .enum(["monitor", "remove", "set"])
        .describe(
          "'monitor' to add bills, 'remove' to delete, 'set' to update stance"
        ),
      stance: z
        .enum(["watch", "support", "oppose"])
        .optional()
        .describe("Position on the bills. Default: 'watch'"),
    },
    async ({ list, action, stance }) => {
      try {
        const result = await client.setMonitor({ list, action, stance });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
