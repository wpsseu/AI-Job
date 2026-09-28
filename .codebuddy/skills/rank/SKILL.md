---
name: rank
description: >
  把新抓取的职位按匹配框架批量打分，产出带优缺点说明的排序短名单。触发词：给这些岗位排个序、哪些值得投、rank、triage、筛选职位。
---

# /rank — 职位批量打分排序

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/rank.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

`/scrape` 结果太多，先要一份排序短名单再决定投哪些。

## 执行步骤

1. 读取 `.claude/commands/rank.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 评分维度与 deal-breaker 来自 `04-job-evaluation.md` 与档案中的底线条款
- 缺口会被记录进 `job_scraper/seen_jobs.json`，供 `/upskill` 使用
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
