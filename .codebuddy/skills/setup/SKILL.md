---
name: setup
description: >
  首次使用：导入或访谈生成候选人档案，填充 CLAUDE.md 与 01/02/04/05/07 号规范文件。触发词：初始化档案、导入简历、设置个人资料、我要开始找工作、setup、onboarding、/setup --section search。
---

# /setup — 档案导入

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/setup.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

用户第一次使用本项目，或要更新档案 / 只更新搜索配置（`--section search`）。

## 执行步骤

1. 读取 `.claude/commands/setup.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 三种路径：读取 `documents/` 素材夹、粘贴单份简历、问答式访谈 —— 由命令自动检测并提供选择
- 会写入个人数据到被 git 跟踪的文件；自用请用私有仓库（见 SETUP.md 第 8 节）
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
