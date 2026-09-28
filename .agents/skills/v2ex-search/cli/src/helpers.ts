// Data source: V2EX's public API v1 (https://www.v2ex.com/api). No auth, no API
// key, no runtime dependencies - plain `fetch` against a JSON endpoint.
//
// These are community topics, not structured job ads. A topic has no company or
// location field, so both are best-effort: `location` is a city/remote keyword
// matched in the title, `company` is left null because guessing an employer from
// a free-text title produces confident nonsense. Missing values are null, never
// omitted - that is the portal-skill output contract.

export const API_TOPICS = "https://www.v2ex.com/api/topics/show.json"

/** Nodes this skill searches. Any other node name is rejected by the CLI. */
export const NODES = ["jobs", "career", "outsourcing"] as const

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA = "Mozilla/5.0 (compatible; v2ex-search-cli/1.0)"

/** Fetch JSON with exponential backoff on 429/5xx. Returns null on a 404. */
export async function apiGet(url: string): Promise<unknown | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      throw new Error(
        `V2EX API returned non-JSON (first 120 chars): ${text.slice(0, 120)}`,
      )
    }
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
  node: string | null
  author: string | null
  replies: number
}

export interface JobDetail extends JobCard {
  description: string | null
}

/** Shape of one topic object in the V2EX v1 API response. */
interface Topic {
  id?: number
  title?: string
  url?: string
  content?: string
  created?: number
  replies?: number
  member?: { username?: string }
  node?: { name?: string; title?: string }
}

// Cities and remote markers worth surfacing as `location`. Deliberately a fixed
// list: a free-text title match for "company-ish words" would be guesswork, but
// an explicit city token is a fact the poster wrote.
const CITY_PATTERN =
  /(远程|remote|北京|上海|广州|深圳|杭州|成都|南京|武汉|西安|苏州|天津|重庆|长沙|郑州|青岛|合肥|厦门|福州|济南|大连|沈阳|珠海|东莞|无锡|宁波|香港|台北|新加坡)/i

/** Best-effort location: prefer a bracketed segment, else the first city token. */
export function extractLocation(title: string): string | null {
  if (!title) return null
  const bracketed = title.match(/[【\[（(]([^】\]）)]{1,20})[】\]）)]/)
  if (bracketed) {
    const hit = bracketed[1].match(CITY_PATTERN)
    if (hit) return hit[1].trim()
  }
  const hit = title.match(CITY_PATTERN)
  return hit ? hit[1].trim() : null
}

/** Unix seconds -> YYYY-MM-DD. Returns null for a missing/invalid timestamp. */
export function toISODate(ts: number | undefined): string | null {
  if (typeof ts !== "number" || !Number.isFinite(ts) || ts <= 0) return null
  try {
    return new Date(ts * 1000).toISOString().slice(0, 10)
  } catch {
    return null
  }
}

/** Parse a topics array (or a single topic object) into job cards. */
export function parseTopics(payload: unknown): JobCard[] {
  const raw: Topic[] = Array.isArray(payload)
    ? (payload as Topic[])
    : payload && typeof payload === "object"
      ? [payload as Topic]
      : []
  const cards: JobCard[] = []
  for (const topic of raw) {
    if (!topic || typeof topic !== "object") continue
    const title = typeof topic.title === "string" ? topic.title.trim() : ""
    if (!title) continue
    const id = topic.id !== undefined ? String(topic.id) : null
    if (!id) continue
    cards.push({
      id,
      title,
      // No company field exists in the API. Null is honest; a guessed employer
      // would be fabricated data in a document a human signs their name to.
      company: null,
      location: extractLocation(title),
      date: toISODate(topic.created),
      url: typeof topic.url === "string" && topic.url ? topic.url : `https://www.v2ex.com/t/${id}`,
      node: topic.node?.name ?? null,
      author: topic.member?.username ?? null,
      replies: typeof topic.replies === "number" ? topic.replies : 0,
    })
  }
  return cards
}

/** Parse a single-topic response into a job detail. */
export function parseTopicDetail(payload: unknown): JobDetail | null {
  const cards = parseTopics(payload)
  if (cards.length === 0) return null
  const card = cards[0]
  const topic = payload as Topic
  const content = typeof topic?.content === "string" ? topic.content.trim() : ""
  return { ...card, description: content || null }
}
