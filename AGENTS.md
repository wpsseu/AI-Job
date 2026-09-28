---
framework_version: 1.0.1
---

# Agent Guidelines: AI Job Search

This workspace is structured to manage job search activities, scraper tools, CVs, cover letters, and interview preparation.

## Thin-Pointer Design (Single Source of Truth)

To prevent duplication and configuration drift across different AI agent frameworks (Claude Code, Google Antigravity, Codex, Cursor, Gemini CLI, etc.), this workspace uses a unified thin-pointer design. All agent runtimes should load the canonical specifications and candidate profiles from the files and directories below:

1. **Personal Candidate Profile:**
   - The candidate profile, contact details, education, and target preferences are defined in [CLAUDE.md](CLAUDE.md) and the individual profile methodology files under [.claude/skills/job-application-assistant/](.claude/skills/job-application-assistant/) (specifically `01-*.md` etc.).
2. **Canonical Workflow Specifications:**
   - The step-by-step instructions and triggers for tasks (setup, scrape, rank, apply, upskill, interview) are defined in the [.claude/](.claude/) directory (specifically under `.claude/skills/` and `.claude/commands/`).
   - Do not duplicate these rules or specifications. Treat `.claude/` files as the single source of truth.
3. **Portal Search Skills:**
   - Job-portal search CLIs live under [.agents/skills/](.agents/skills/) in the portable Agent Skills format (with a `SKILL.md` per portal). Codex and Antigravity discover these automatically; the `/scrape` workflow in [.claude/skills/job-scraper/](.claude/skills/job-scraper/) orchestrates them.
4. **CodeBuddy (Tencent) entry points:**
   - Project-level configuration lives under [.codebuddy/](.codebuddy/): `skills/` holds one thin-pointer `SKILL.md` per command and per core skill, and `rules/` holds two always-on rules (workflow entry point, China-market constraints). All of them load the canonical `.claude/` files instead of duplicating them.
   - CodeBuddy has no equivalent of `.claude/settings.json` permissions, so portal CLI calls may prompt for approval; the reviewed allowlist in `.claude/settings.json` still governs Claude Code.
   - Mainland-China usage (which job boards can and cannot be used, Chinese CV templates) is documented in [PORTALS_CN.md](PORTALS_CN.md); the CodeBuddy setup walkthrough is in [CODEBUDDY_CN.md](CODEBUDDY_CN.md).
