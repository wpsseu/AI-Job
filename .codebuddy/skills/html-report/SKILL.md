---
name: html-report
description: >
  从跟踪表与申请档案生成离线 HTML 仪表盘（统计卡片、图表、可筛选表格）。触发词：生成看板、看看我的申请统计、html report、dashboard。
---

# /html-report — 申请看板

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/html-report.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

想看整体漏斗与状态分布。

## 执行步骤

1. 读取 `.claude/commands/html-report.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 生成物为自包含 HTML，可直接双击打开
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
