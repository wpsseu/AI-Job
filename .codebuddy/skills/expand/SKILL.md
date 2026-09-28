---
name: expand
description: >
  扫描档案中已链接的公开来源（GitHub、作品集、Kaggle、Google Scholar）与课程大纲，补充能力项并标注来源。触发词：扩充我的资料、增强档案、expand、补充技能。
---

# /expand — 能力画像增强

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/expand.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

刚跑完 `/setup`，希望把文档没写出来的技能补齐。

## 执行步骤

1. 读取 `.claude/commands/expand.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 新增能力必须带来源标签，不臆造
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
