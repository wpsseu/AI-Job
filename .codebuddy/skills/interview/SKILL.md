---
name: interview
description: >
  为已跟踪申请生成分阶段面试准备包：公司研究、问题映射到 STAR 例子、模拟面试。触发词：我要面试了、帮我准备面试、面试准备、interview prep、mock interview。
---

# /interview — 面试准备

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/interview.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

用户有一场已安排、且已被 `/apply` 或 `/outcome` 跟踪的面试。

## 执行步骤

1. 读取 `.claude/commands/interview.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 准备包基于该申请的归档材料（原始 JD、实际投出的 CV 与求职信）
- 缺口给诚实的桥接回答，绝不编造经历
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
