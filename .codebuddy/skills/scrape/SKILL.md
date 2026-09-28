---
name: scrape
description: >
  跨招聘平台搜索职位、去重、按匹配度排序。触发词：搜职位、找工作、抓取职位、今天有什么新岗位、scrape、job search。
---

# /scrape — 多平台职位搜索

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/skills/job-scraper/SKILL.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

用户要批量发现新职位，或想看看市场上有什么匹配的机会。

## 执行步骤

1. 读取 `.claude/skills/job-scraper/SKILL.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 通过读取 `.agents/skills/*/SKILL.md` 自动发现所有门户 CLI；`enabled: false` 的门户会被跳过
- 搜索查询词定义在 `.claude/skills/job-scraper/search-queries.md`
- 去重必须调用 `python3 tools/job_key.py`，不要现场自己 slugify
- 中国大陆用户注意：主流招聘站均不可匿名抓取，见 `PORTALS_CN.md`
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
