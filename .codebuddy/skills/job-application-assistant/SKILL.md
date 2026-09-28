---
name: job-application-assistant
description: >
  求职申请核心技能：评估职位匹配度、定制 CV、写求职信、准备面试。触发词：评估这个岗位、这个职位适合我吗、帮我申请、写简历、写求职信、面试准备、job posting、job application、CV、cover letter、interview prep、job fit。
---

# Job Application Assistant（核心申请技能）

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/skills/job-application-assistant/SKILL.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

用户给出一个职位（URL 或 JD 文本），或要求评估匹配度 / 定制简历 / 写求职信 / 准备面试。

## 执行步骤

1. 读取 `.claude/skills/job-application-assistant/SKILL.md` 及其引用的 `01-`~`09-` 规范文件
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 工作流会级联读取 `01-candidate-profile.md` 到 `09-web-research.md`，务必一并读取，不要只读 SKILL.md
- 生成文档后必须按 `CLAUDE.md` 的 Verification Checklist 逐项核验（含 lualatex/xelatex 编译与 PDF 目视检查、ATS 文本层提取）
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
