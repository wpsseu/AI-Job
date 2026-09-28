import {
  API_TOPICS,
  apiGet,
  parseTopics,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  node: string
  query?: string
  jobage: number // days; 9999 = no freshness filter
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

/** Results per --page. The v1 API returns the node's latest topics with no
 *  server-side paging, so paging is applied client-side. */
export const PAGE_SIZE = 20

export function buildUrl(opts: SearchOpts): string {
  return `${API_TOPICS}?node_name=${encodeURIComponent(opts.node)}`
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 50).padEnd(50)
    const loc = (c.location || "—").slice(0, 10).padEnd(10)
    const date = c.date || "—"
    return `${c.id.padEnd(9)} ${title} ${loc} ${date}`
  })
  const header =
    "ID".padEnd(9) + " " + "TITLE".padEnd(50) + " " + "LOCATION".padEnd(10) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const payload = await apiGet(buildUrl(opts))
    if (payload === null) {
      writeError(`V2EX returned 404 for node "${opts.node}"`, "NOT_FOUND")
      return 1
    }
    const raw = Array.isArray(payload) ? (payload as Record<string, unknown>[]) : []
    const cutoff =
      opts.jobage && opts.jobage < 9999 ? Date.now() / 1000 - opts.jobage * 86400 : null
    const texts = new Map<string, string>()
    for (const topic of raw) {
      const id = topic?.id !== undefined ? String(topic.id) : ""
      const content = typeof topic?.content === "string" ? topic.content : ""
      if (id) texts.set(id, content)
    }

    let cards = parseTopics(payload)
    if (cutoff !== null) {
      cards = cards.filter((c) => {
        if (!c.date) return false
        return new Date(`${c.date}T00:00:00Z`).getTime() / 1000 >= cutoff
      })
    }
    if (opts.query) {
      const q = opts.query
      cards = cards.filter((c) => {
        const body = texts.get(c.id) ?? ""
        return `${c.title} ${body}`.toLowerCase().includes(q.toLowerCase())
      })
    }

    const start = (Math.max(1, opts.page) - 1) * PAGE_SIZE
    cards = cards.slice(start, start + PAGE_SIZE)
    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.location || "—"} · ${c.date || "—"} · node: ${c.node || "—"}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page, node: opts.node }, results: cards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
