---
name: upskill
description: >
  对比档案与已跟踪/已排序职位，产出技能差距热力图和学习计划。触发词：我还缺什么技能、学习规划、upskill、skill gap。
---

# /upskill — 技能差距与学习计划

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/skills/upskill/SKILL.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

申请间隙做职业规划，或想知道反复出现的差距是什么。

## 执行步骤

1. 读取 `.claude/skills/upskill/SKILL.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 差距来源包含 `/rank` 记录在 `seen_jobs.json` 里的缺口
- 报告输出到 `upskill/report-*.md`
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
