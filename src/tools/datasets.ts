// Dataset MCP tools

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";

export function registerDatasetTools(server: McpServer, client: LegiScanClient) {
  // Get Dataset List
  server.tool(
    "legiscan_get_dataset_list",
    "Get list of available bulk datasets (ZIP archives containing all bills, votes, and people for a session). Returns session_id and access_key needed for download.",
    {
      state: z
        .string()
        .optional()
        .describe("Filter by state abbreviation"),
      year: z
        .number()
        .optional()
        .describe("Filter by year"),
    },
    async ({ state, year }) => {
      try {
        const datasets = await client.getDatasetList({ state, year });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(datasets, null, 2),
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

  // Get Dataset
  server.tool(
    "legiscan_get_dataset",
    "Download a bulk dataset ZIP archive for a session. Contains all bills, votes, and people as JSON or CSV files. Returns base64-encoded ZIP. Large files - use sparingly.",
    {
      session_id: z
        .number()
        .describe("Session ID from getDatasetList"),
      access_key: z
        .string()
        .describe("Access key from getDatasetList"),
      format: z
        .enum(["json", "csv"])
        .optional()
        .describe("Data format inside ZIP: 'json' (default) or 'csv'"),
    },
    async ({ session_id, access_key, format }) => {
      try {
        const dataset = await client.getDataset(session_id, access_key, format);

        // Note: The ZIP is base64 encoded and can be quite large
        // Return metadata separately for clarity
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                state_id: dataset.state_id,
                session_id: dataset.session_id,
                session_name: dataset.session_name,
                dataset_hash: dataset.dataset_hash,
                dataset_date: dataset.dataset_date,
                dataset_size: dataset.dataset_size,
                mime_type: dataset.mime_type,
                zip_base64_length: dataset.zip.length,
                zip: dataset.zip, // Base64 encoded ZIP
              }, null, 2),
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
