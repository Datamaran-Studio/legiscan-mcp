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
        .describe("People ID from sponsors, votes, or session people lists"),
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
      session_id: z.number().describe("Session ID from getSessionList"),
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

  // Get Sponsored List
  server.tool(
    "legiscan_get_sponsored_list",
    "Get all bills sponsored by a legislator across all sessions. Useful for researching a legislator's legislative priorities.",
    {
      people_id: z.number().describe("People ID of the legislator"),
    },
    async ({ people_id }) => {
      try {
        const sponsoredBills = await client.getSponsoredList(people_id);
        return jsonResponse(sponsoredBills);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
