// People/Legislator MCP tools

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LegiScanClient } from "../legiscan-client.js";
import { jsonResponse, errorResponse } from "./helpers.js";

export function registerPeopleTools(server: McpServer, client: LegiScanClient) {
  // Get Person
  server.tool(
    "legiscan_get_person",
    "Get legislator information including party, role, district, and third-party IDs (VoteSmart, OpenSecrets, Ballotpedia, FollowTheMoney).",
    {
      people_id: z
        .number()
        .describe("Legislator ID (use find_legislator to resolve from name)"),
    },
    async ({ people_id }) => {
      try {
        const person = await client.getPerson(people_id);
        return jsonResponse(person);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Get Session People
  server.tool(
    "legiscan_get_session_people",
    "Get all legislators active in a legislative session. Returns list of people with their roles, parties, and districts.",
    {
      session_id: z
        .number()
        .describe("Session ID (use get_session_list to find sessions for a state)"),
    },
    async ({ session_id }) => {
      try {
        const sessionPeople = await client.getSessionPeople(session_id);
        return jsonResponse(sessionPeople);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
