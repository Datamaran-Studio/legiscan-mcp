// Search MCP tools

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";
import { jsonResponse, errorResponse } from "./helpers.js";

export function registerSearchTools(server: McpServer, client: LegiScanClient) {
  // Full-text search (paginated, 50 per page)
  server.tool(
    "legiscan_search",
    "Full-text search across bill texts. Returns 50 results per page with relevance scores, bill summaries, and URLs. Use for interactive searches.",
    {
      query: z
        .string()
        .describe(
          "Search query. Supports full-text search syntax. URL encode special characters."
        ),
      state: z
        .string()
        .optional()
        .describe(
          "Two-letter state abbreviation or 'ALL' for nationwide search. Default: ALL"
        ),
      year: z
        .number()
        .optional()
        .describe(
          "Year filter: 1=all, 2=current (default), 3=recent, 4=prior, or exact year (>1900)"
        ),
      page: z.number().optional().describe("Page number for pagination. Default: 1"),
      session_id: z
        .number()
        .optional()
        .describe("Search within a specific session_id instead of state/year"),
    },
    async ({ query, state, year, page, session_id }) => {
      try {
        const result = await client.getSearch({
          query,
          state,
          year,
          page,
          session_id,
        });
        return jsonResponse(result);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Full-text search raw (2000 results per page)
  server.tool(
    "legiscan_search_raw",
    "Full-text search returning up to 2000 results per page with minimal data (bill_id, relevance, change_hash). Use for automated monitoring and bulk operations.",
    {
      query: z.string().describe("Search query. Supports full-text search syntax."),
      state: z
        .string()
        .optional()
        .describe(
          "Two-letter state abbreviation or 'ALL' for nationwide search. Default: ALL"
        ),
      year: z
        .number()
        .optional()
        .describe(
          "Year filter: 1=all, 2=current (default), 3=recent, 4=prior, or exact year (>1900)"
        ),
      page: z.number().optional().describe("Page number for pagination. Default: 1"),
      session_id: z
        .number()
        .optional()
        .describe("Search within a specific session_id instead of state/year"),
    },
    async ({ query, state, year, page, session_id }) => {
      try {
        const result = await client.getSearchRaw({
          query,
          state,
          year,
          page,
          session_id,
        });
        return jsonResponse(result);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
