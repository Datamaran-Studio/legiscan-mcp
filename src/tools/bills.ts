// Bill-related MCP tools

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";

export function registerBillTools(server: McpServer, client: LegiScanClient) {
  // Get Master List
  server.tool(
    "legiscan_get_master_list",
    "Get list of all bills in a legislative session. Returns bill summaries with bill_id, number, status, title. Use bill_id for detailed lookups with legiscan_get_bill.",
    {
      session_id: z
        .number()
        .optional()
        .describe("Session ID from getSessionList. Preferred over state."),
      state: z
        .string()
        .optional()
        .describe(
          "Two-letter state abbreviation for current session. Use session_id for specific sessions."
        ),
    },
    async ({ session_id, state }) => {
      try {
        if (!session_id && !state) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Either session_id or state is required",
              },
            ],
            isError: true,
          };
        }
        const bills = await client.getMasterList({
          id: session_id,
          state,
        });
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

  // Get Master List Raw (optimized)
  server.tool(
    "legiscan_get_master_list_raw",
    "Get optimized bill list with only bill_id, number, and change_hash. Use for efficient change detection and syncing.",
    {
      session_id: z
        .number()
        .optional()
        .describe("Session ID from getSessionList. Preferred over state."),
      state: z
        .string()
        .optional()
        .describe(
          "Two-letter state abbreviation for current session."
        ),
    },
    async ({ session_id, state }) => {
      try {
        if (!session_id && !state) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Either session_id or state is required",
              },
            ],
            isError: true,
          };
        }
        const bills = await client.getMasterListRaw({
          id: session_id,
          state,
        });
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

  // Get Bill Details
  server.tool(
    "legiscan_get_bill",
    "Get detailed bill information including sponsors, full history, votes, texts, amendments, and supplements. This is the primary tool for bill research.",
    {
      bill_id: z
        .number()
        .describe("Bill ID from getMasterList or search results"),
    },
    async ({ bill_id }) => {
      try {
        const bill = await client.getBill(bill_id);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(bill, null, 2),
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

  // Get Bill Text
  server.tool(
    "legiscan_get_bill_text",
    "Get the full text of a bill document. Returns base64-encoded document (PDF, HTML, etc.). Use doc_id from bill.texts[] array.",
    {
      doc_id: z
        .number()
        .describe("Document ID from bill.texts[] array"),
      decode: z
        .boolean()
        .optional()
        .describe(
          "If true and document is HTML, decode from base64 to text. PDFs always return base64."
        ),
    },
    async ({ doc_id, decode }) => {
      try {
        const text = await client.getBillText(doc_id);

        // Optionally decode HTML documents
        if (decode && text.mime === "text/html" && text.doc) {
          const decoded = Buffer.from(text.doc, "base64").toString("utf-8");
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ...text, doc: decoded, decoded: true }, null, 2),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(text, null, 2),
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

  // Get Amendment
  server.tool(
    "legiscan_get_amendment",
    "Get amendment document. Returns base64-encoded document. Use amendment_id from bill.amendments[] array.",
    {
      amendment_id: z
        .number()
        .describe("Amendment ID from bill.amendments[] array"),
      decode: z
        .boolean()
        .optional()
        .describe(
          "If true and document is HTML, decode from base64 to text."
        ),
    },
    async ({ amendment_id, decode }) => {
      try {
        const amendment = await client.getAmendment(amendment_id);

        if (decode && amendment.mime === "text/html" && amendment.doc) {
          const decoded = Buffer.from(amendment.doc, "base64").toString("utf-8");
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ...amendment, doc: decoded, decoded: true }, null, 2),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(amendment, null, 2),
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

  // Get Supplement
  server.tool(
    "legiscan_get_supplement",
    "Get supplemental document (fiscal notes, veto letters, analysis). Returns base64-encoded document. Use supplement_id from bill.supplements[] array.",
    {
      supplement_id: z
        .number()
        .describe("Supplement ID from bill.supplements[] array"),
      decode: z
        .boolean()
        .optional()
        .describe(
          "If true and document is HTML, decode from base64 to text."
        ),
    },
    async ({ supplement_id, decode }) => {
      try {
        const supplement = await client.getSupplement(supplement_id);

        if (decode && supplement.mime === "text/html" && supplement.doc) {
          const decoded = Buffer.from(supplement.doc, "base64").toString("utf-8");
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ ...supplement, doc: decoded, decoded: true }, null, 2),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(supplement, null, 2),
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

  // Get Roll Call
  server.tool(
    "legiscan_get_roll_call",
    "Get roll call vote details including individual legislator votes. Use roll_call_id from bill.votes[] array.",
    {
      roll_call_id: z
        .number()
        .describe("Roll call ID from bill.votes[] array"),
    },
    async ({ roll_call_id }) => {
      try {
        const rollCall = await client.getRollCall(roll_call_id);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(rollCall, null, 2),
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
