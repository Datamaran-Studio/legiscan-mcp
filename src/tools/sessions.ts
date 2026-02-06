// Session-related MCP tools

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";
import { jsonResponse, errorResponse, stateCodeSchema } from "./helpers.js";

export function registerSessionTools(server: McpServer, client: LegiScanClient) {
  server.tool(
    "legiscan_get_session_list",
    "Get list of available legislative sessions. Returns sessions with session_id, years, and state info. Use session_id for subsequent bill lookups.",
    {
      state: stateCodeSchema
        .optional()
        .describe(
          "Two-letter state abbreviation (e.g., 'CA', 'TX'). Omit to get sessions for all states."
        ),
    },
    async ({ state }) => {
      try {
        const sessions = await client.getSessionList(state);
        return jsonResponse(sessions);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
