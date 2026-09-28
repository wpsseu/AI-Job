import { API_TOPICS, apiGet, parseTopicDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

/** Accept a raw topic ID, a /t/<id> URL, or a full v2ex.com URL with a path. */
export function normalizeId(input: string): string | null {
  const tUrl = input.match(/\/t\/(\d+)(?:[?#]|$)/)
  if (tUrl) return tUrl[1]
  const bare = input.match(/^\d+$/)
  if (bare) return input
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    writeError(`Could not parse a V2EX topic ID from "${opts.id}"`, "BAD_ID")
    return 1
  }
  try {
    const payload = await apiGet(`${API_TOPICS}?id=${encodeURIComponent(id)}`)
    const job = payload === null ? null : parseTopicDetail(payload)
    if (!job) {
      writeError("Topic not found", "NOT_FOUND")
      return 1
    }

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.location || "—"} · ${job.date || "—"} · node: ${job.node || "—"} · by ${job.author || "—"}`,
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
