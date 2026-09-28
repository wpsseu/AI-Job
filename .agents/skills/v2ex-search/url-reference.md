# V2EX API v1 — field reference

Data source for `v2ex-search`. Public, no auth, no API key.

## Endpoints

| Purpose | URL |
|---------|-----|
| Node topics | `https://www.v2ex.com/api/topics/show.json?node_name=<node>` |
| Single topic | `https://www.v2ex.com/api/topics/show.json?id=<id>` |
| Node metadata | `https://www.v2ex.com/api/nodes/show.json?name=<node>` |

Nodes used by this skill: `jobs`（招聘）, `career`（职场）, `outsourcing`（外包）.

## Topic object (fields this skill reads)

```json
{
  "id": 1054321,
  "title": "[北京] 招两名后端工程师（Go）",
  "url": "https://www.v2ex.com/t/1054321",
  "content": "要求：熟悉 Go……",
  "content_rendered": "<p>要求：熟悉 Go……</p>",
  "created": 1750000000,
  "last_modified": 1750086400,
  "last_touched": 1750100000,
  "replies": 4,
  "member": { "username": "alice" },
  "node": { "name": "jobs", "title": "招聘" }
}
```

## Mapping to the portal-skill output contract

| Contract field | Source |
|----------------|--------|
| `id` | `id` (stringified) |
| `title` | `title` |
| `company` | **always `null`** — no employer field exists; guessing one from free text would fabricate data |
| `location` | best-effort city/remote token matched in `title` (`helpers.ts: extractLocation`) |
| `date` | `created` (Unix seconds) → `YYYY-MM-DD` |
| `url` | `url`, falling back to `https://www.v2ex.com/t/<id>` |
| `node` | `node.name` |
| `author` | `member.username` |
| `replies` | `replies` |
| `description` (detail only) | `content` |

## Limitations

- No server-side paging, sorting, or date filtering: `show.json` returns the
  node's latest topics. `--page`, `--jobage`, and `--query` are client-side.
- API v1 is unversioned and undocumented-by-guarantee: if it starts returning
  HTML (WAF/anti-bot) instead of JSON, the CLI fails loudly with a
  "returned non-JSON" error rather than emitting empty results.
