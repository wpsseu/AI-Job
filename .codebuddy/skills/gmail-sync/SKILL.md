---
name: gmail-sync
description: >
  读取 Gmail 中的面试邀请、测评链接、offer、拒信，批量提议状态更新待你确认。触发词：检查邮箱、同步邮件、gmail sync。
---

# /gmail-sync — 从 Gmail 识别状态

> **薄指针（thin pointer）**：本文件**不含**工作流副本。权威定义只有一处 ——
> `.claude/commands/gmail-sync.md`。Claude Code、CodeBuddy、Codex、Antigravity 等不同 Agent 运行时
> 都指向它，以避免多份配置漂移（见仓库根 `AGENTS.md`）。

## 何时触发

开放申请较多，想自动发现邮件里的状态信号。

## 执行步骤

1. 读取 `.claude/commands/gmail-sync.md`
2. 严格按其中的步骤执行 —— 不要凭记忆复述流程：规范文件可能已被 `/setup`、`/add-template` 或 `/add-portal` 改写
3. 该文件中引用的其他规范文件（`01-`~`09-`、`search-queries.md`、`documents/README.md` 等）按需一并读取

## 参数

用户请求里命令名之后的内容即为参数（URL、公司名、文件路径、天数、--section search 之类的开关）。
Claude Code 用 `$ARGUMENTS` 承接；CodeBuddy 下直接把参数写在请求里即可。

## 注意

- 每条提议都标注来源邮件，写入前必须经你批准
- 国内邮箱（QQ/163/ Gmail 不可用）暂不适用
- 所有路径以仓库根为基准；`.claude/` 是唯一权威来源，本目录只做指针
