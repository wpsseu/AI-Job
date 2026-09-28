---
name: outcome
description: >
  记录申请进展与结果（面试轮次、offer、拒绝、沉默），归档材料并更新跟踪表；`followup` 子命令处理沉默申请的跟进草稿。触发词：记录结果、这家拒了我、我拿到 offer 了、跟进一下、outcome、followup。
---

# /outcome — 记录申请结果

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/outcome.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

申请状态发生变化，或需要为沉默的申请起草跟进消息。

## 执行步骤

1. 读取 `.claude/commands/outcome.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 归档目录 `documents/applications/<company>_<role>/`，命名规则见 `documents/README.md`
- 跟进消息只起草不发送，且只使用已提交材料中的事实
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
