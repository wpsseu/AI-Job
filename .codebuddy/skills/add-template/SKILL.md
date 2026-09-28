---
name: add-template
description: >
  注册你自己的 CV / 求职信模板（LaTeX、Typst 或其他可命令行编译的工具链），替换默认模板。触发词：用我自己的简历模板、add-template、自定义模板。
---

# /add-template — 注册自定义模板

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/add-template.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

你有现成的中文简历模板（例如 ctex / xeCJK 排版），想让 `/apply` 用它出稿。

## 执行步骤

1. 读取 `.claude/commands/add-template.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 模板以 `[PLACEHOLDER]` 形式保存，可安全提交
- 注册后 `/apply` 按其声明的编译命令出 PDF；核验清单里的页数规则以模板声明的 page limit 为准
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
