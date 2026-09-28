---
name: add-portal
description: >
  为你所在市场的招聘网站生成一个职位搜索 CLI 技能（零依赖 bun + fetch）。触发词：接入新的招聘网站、add-portal、增加招聘平台。
---

# /add-portal — 生成招聘平台技能

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/add-portal.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

想接入本地招聘站，或改造现有门户。

## 执行步骤

1. 读取 `.claude/commands/add-portal.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 登录墙站点会直接拒绝；robots/条款受限的站点必须在 SKILL.md 顶部写明个人使用警告
- 注册前必须真机跑通 `search` 与 `detail` 并跑 `bun run test`
- 新 CLI 需同时在 `.claude/settings.json` 与 `tools/security_guards.py` 的 ALLOWED_PERMISSIONS 中放行
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
