import { describe, expect, it } from "vitest";

import {
  normalizeBillNumber,
  searchStateSchema,
  stateCodeSchema,
} from "../../src/tools/helpers.js";

describe("normalizeBillNumber", () => {
  it("normalizes common bill number formats", () => {
    expect(normalizeBillNumber("AB 858")).toBe("AB858");
    expect(normalizeBillNumber("ab-858")).toBe("AB858");
    expect(normalizeBillNumber("SB.0012")).toBe("SB12");
  });
});

describe("state schemas", () => {
  it("normalizes two-letter state abbreviations", () => {
    expect(stateCodeSchema.parse("ca")).toBe("CA");
  });

  it("rejects invalid two-letter state abbreviations", () => {
    expect(() => stateCodeSchema.parse("CAL")).toThrow(
      "State must be a two-letter abbreviation"
    );
  });

  it("accepts ALL for search state", () => {
    expect(searchStateSchema.parse("all")).toBe("ALL");
  });
});
