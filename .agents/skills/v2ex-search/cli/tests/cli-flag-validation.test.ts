import { describe, expect, test } from "bun:test";
import { runCLI } from "./helpers.js";

// These assert on validation error codes that are emitted BEFORE any network
// call, so the suite is network-free and passes offline.

async function errorCode(args: string[]): Promise<string> {
  const res = await runCLI(args);
  expect(res.exitCode).toBe(1);
  const parsed = JSON.parse(res.stderr);
  return parsed.code as string;
}

describe("unknown flags are rejected, never ignored", () => {
  test("search rejects an unknown flag", async () => {
    expect(await errorCode(["search", "--bogus", "x"])).toBe("UNKNOWN_FLAG");
  });

  test("detail rejects an unknown flag", async () => {
    expect(await errorCode(["detail", "1054321", "--bogus", "x"])).toBe("UNKNOWN_FLAG");
  });
});

describe("node validation", () => {
  test("an unknown node is rejected", async () => {
    expect(await errorCode(["search", "--node", "nope"])).toBe("BAD_ARG");
  });

  test("the rejection names the supported nodes", async () => {
    const res = await runCLI(["search", "--node", "nope"]);
    const parsed = JSON.parse(res.stderr);
    expect(parsed.error).toContain("jobs");
    expect(parsed.error).toContain("outsourcing");
  });
});

describe("numeric flag validation", () => {
  test("--jobage 0 is rejected", async () => {
    expect(await errorCode(["search", "--jobage", "0"])).toBe("BAD_ARG");
  });

  test("--jobage 0.5 is rejected rather than truncated to 0", async () => {
    expect(await errorCode(["search", "--jobage", "0.5"])).toBe("BAD_ARG");
  });

  test("--page abc is rejected", async () => {
    expect(await errorCode(["search", "--page", "abc"])).toBe("BAD_ARG");
  });

  test("--limit 0 is rejected", async () => {
    expect(await errorCode(["search", "--limit", "0"])).toBe("BAD_ARG");
  });
});

describe("detail id validation", () => {
  test("detail without an id reports NO_ID", async () => {
    expect(await errorCode(["detail"])).toBe("NO_ID");
  });

  test("detail with an unparseable id reports BAD_ID", async () => {
    expect(await errorCode(["detail", "not-an-id"])).toBe("BAD_ID");
  });
});

describe("command dispatch", () => {
  test("an unknown command reports BAD_CMD", async () => {
    expect(await errorCode(["frobnicate"])).toBe("BAD_CMD");
  });

  test("`search --help` prints usage and exits 0", async () => {
    const res = await runCLI(["search", "--help"]);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain("v2ex-cli");
  });

  test("no arguments prints usage and exits 1", async () => {
    const res = await runCLI([]);
    expect(res.exitCode).toBe(1);
    expect(res.stdout).toContain("USAGE");
  });
});
