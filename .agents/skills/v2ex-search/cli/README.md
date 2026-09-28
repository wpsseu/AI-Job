# v2ex-cli

Search job-related topics on V2EX (nodes: `jobs`, `career`, `outsourcing`) through
V2EX's **public API v1**. Zero runtime dependencies — plain `bun` + `fetch`.

```bash
bun run src/cli.ts search --node jobs -q "后端" --jobage 14 --format table
bun run src/cli.ts detail 1054321 --format plain
```

Full flag reference, output contract, and the ToS/robots notes live in
[`../../SKILL.md`](../../SKILL.md); the API field mapping is in
[`../../url-reference.md`](../../url-reference.md).

## Development

```bash
bun install       # dev types only (typescript, @types/bun)
bun run typecheck
bun test          # offline: fixtures + pre-network flag validation
```

`bun install` pulls dev dependencies only. There are no runtime dependencies and
no lifecycle scripts — `tools/security_guards.py` fails the build if a manifest
under `.agents/` ever grows one, because every fork user runs `bun install`.

## Scope and honesty

These are **community posts**, not structured job ads. The API has no employer
field, so `company` is always `null` and `location` is a city/remote token
matched in the title. Missing values are `null`, never omitted — that is the
portal-skill output contract, and `/scrape`'s dedup (`tools/job_key.py`) falls
back to the numeric topic id from the URL for non-Latin titles.
