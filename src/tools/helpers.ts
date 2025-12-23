// Shared helpers for MCP tool handlers

/**
 * Normalize a bill number for comparison
 * Handles variations like "AB 858", "AB858", "AB-858", "ab858"
 */
export function normalizeBillNumber(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s.\-]/g, "") // Remove spaces, dots, dashes
    .replace(/^([A-Z]+)0+(\d)/, "$1$2"); // Strip leading zeros: AB0858 → AB858
}

/**
 * Create a successful JSON tool response
 */
export function jsonResponse(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Create an error tool response
 */
export function errorResponse(error: unknown) {
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

/**
 * Decode base64-encoded HTML document to text
 */
export function decodeHtmlDoc(base64Doc: string): string {
  return Buffer.from(base64Doc, "base64").toString("utf-8");
}

/**
 * Process a document response, optionally decoding HTML
 */
export function processDocument<T extends { mime?: string; doc?: string }>(
  doc: T,
  decode?: boolean
): T & { decoded?: boolean } {
  if (decode && doc.mime === "text/html" && doc.doc) {
    return {
      ...doc,
      doc: decodeHtmlDoc(doc.doc),
      decoded: true,
    };
  }
  return doc;
}
