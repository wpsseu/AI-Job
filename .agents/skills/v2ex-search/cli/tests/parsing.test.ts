import { describe, expect, test } from "bun:test";
import { extractLocation, parseTopicDetail, parseTopics, toISODate } from "../src/helpers.js";

// Fixture-shaped copy of a V2EX API v1 response. No network: these assert that
// the parser maps the API's fields onto the portal-skill output contract.

const TOPICS = [
  {
    id: 1054321,
    title: "[北京] 招两名后端工程师（Go）",
    url: "https://www.v2ex.com/t/1054321",
    content: "要求：熟悉 Go，有分布式系统经验。远程也可。",
    created: 1750000000,
    replies: 4,
    member: { username: "alice" },
    node: { name: "jobs", title: "招聘" },
  },
  {
    id: 1054322,
    title: "Remote 前端岗位（React）",
    url: "https://www.v2ex.com/t/1054322",
    content: "远程优先。",
    created: 1750086400,
    replies: 0,
    member: { username: "bob" },
    node: { name: "jobs", title: "招聘" },
  },
  // No id -> must be skipped rather than emitted with a blank key.
  { title: "缺少 id 的主题", url: "https://www.v2ex.com/t/999" },
];

describe("parseTopics", () => {
  test("maps API topics onto the contract fields", () => {
    const cards = parseTopics(TOPICS);
    expect(cards.length).toBe(2);
    for (const card of cards) {
      expect(Object.keys(card)).toContain("title");
      expect(Object.keys(card)).toContain("company");
      expect(Object.keys(card)).toContain("location");
      expect(Object.keys(card)).toContain("date");
      expect(Object.keys(card)).toContain("url");
    }
  });

  test("company is always null - the API has no employer field", () => {
    const cards = parseTopics(TOPICS);
    expect(cards.every((c) => c.company === null)).toBe(true);
  });

  test("location is extracted from the title when a city or remote marker is written", () => {
    const cards = parseTopics(TOPICS);
    expect(cards[0].location).toBe("北京");
    expect(cards[1].location).toBe("Remote");
  });

  test("date is derived from the created timestamp", () => {
    const cards = parseTopics(TOPICS);
    expect(cards[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(cards[0].date).toBe(toISODate(1750000000));
  });

  test("skips topics with no id", () => {
    expect(parseTopics(TOPICS).map((c) => c.id)).toEqual(["1054321", "1054322"]);
  });

  test("a single object payload parses as one card", () => {
    expect(parseTopics(TOPICS[0]).length).toBe(1);
  });

  test("garbage payloads yield no cards instead of throwing", () => {
    expect(parseTopics(null).length).toBe(0);
    expect(parseTopics("not json").length).toBe(0);
    expect(parseTopics([]).length).toBe(0);
  });
});

describe("parseTopicDetail", () => {
  test("returns the card plus its body text", () => {
    const detail = parseTopicDetail(TOPICS[0]);
    expect(detail).not.toBeNull();
    expect(detail?.description).toContain("Go");
    expect(detail?.author).toBe("alice");
    expect(detail?.replies).toBe(4);
  });

  test("returns null when there is nothing to parse", () => {
    expect(parseTopicDetail(null)).toBeNull();
  });
});

describe("extractLocation", () => {
  test("reads a bracketed city first", () => {
    expect(extractLocation("【深圳】招测试工程师")).toBe("深圳");
  });

  test("returns null when no marker is present", () => {
    expect(extractLocation("聊聊最近的面试经历")).toBeNull();
  });
});

describe("toISODate", () => {
  test("returns null for missing or invalid timestamps", () => {
    expect(toISODate(undefined)).toBeNull();
    expect(toISODate(0)).toBeNull();
    expect(toISODate(Number.NaN)).toBeNull();
  });
});
