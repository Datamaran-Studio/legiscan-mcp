// Session-related MCP tools

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";

export function registerSessionTools(server: McpServer, client: LegiScanClient) {
  server.tool(
    "legiscan_get_session_list",
    "Get list of available legislative sessions. Returns sessions with session_id, years, and state info. Use session_id for subsequent bill lookups.",
    {
      state: z
        .string()
        .optional()
        .describe(
          "Two-letter state abbreviation (e.g., 'CA', 'TX'). Omit to get sessions for all states."
        ),
    },
    async ({ state }) => {
      try {
        const sessions = await client.getSessionList(state);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(sessions, null, 2),
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
