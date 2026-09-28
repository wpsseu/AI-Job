---
name: notion-sync
description: >
  通过官方 Notion MCP 把流程视图单向推送到 Notion 数据库。触发词：同步到 Notion、notion sync。
---

# /notion-sync — 同步到 Notion

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/notion-sync.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

希望在手机/浏览器上随时查看流水线。

## 执行步骤

1. 读取 `.claude/commands/notion-sync.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 仓库文件是系统记录，Notion 只写不回读；文档仅同步文件名
- 需要已配置 Notion MCP（OAuth）
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
