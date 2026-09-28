# 在 CodeBuddy 中使用本仓库

本项目原本围绕 **Claude Code** 设计（`.claude/commands/` 斜杠命令 + `.claude/skills/` +
`.claude/settings.json` 权限白名单）。这份说明描述为 **CodeBuddy（腾讯云代码助手）**
加的适配层，以及和 Claude Code 的用法差异。

## 适配层做了什么

保持仓库的 **thin-pointer（单一数据源）** 原则：没有复制任何工作流，只加了指针。

```
.codebuddy/
├── rules/
│   ├── job-search-workflow.md   # 入口规则：权威源在 .claude/，不得凭记忆复述流程
│   └── china-market.md          # 中国大陆规则：不抓登录墙站点、粘贴 JD 为主路径
└── skills/                      # 15 个薄指针 SKILL.md（标准 Agent Skills 格式）
    ├── job-application-assistant/  # 核心技能
    ├── setup/ apply/ scrape/ rank/ interview/ outcome/
    ├── expand/ upskill/ html-report/ notion-sync/ gmail-sync/
    └── add-template/ add-portal/ reset/
```

每个 `SKILL.md` 只有约 30 行：frontmatter（name + 中英触发词 description）+
"去读 `.claude/commands/<x>.md` 或 `.claude/skills/.../SKILL.md`，然后严格照做"。

**为什么这样设计**：职责上游更新工作流时，你只 pull 一次，CodeBuddy 与 Claude Code
同时生效；不会出现"两份规则各自漂移"。

## 用法差异对照

| Claude Code | CodeBuddy | 说明 |
|---|---|---|
| `/apply <url>` | 直接说"帮我申请这个职位：<url>" | CodeBuddy 通过 skill 的 `description` 命中触发；斜杠命令是内置机制，无法自定义同名命令 |
| `/setup` | "用 setup 技能帮我导入档案" | 同上 |
| `.claude/settings.json` 权限白名单 | **无等价机制** | 运行 `bun run .agents/skills/*/cli/src/cli.ts` 时可能弹确认框；这是安全上的加分项，不是问题 |
| `AGENTS.md` 自动加载 | 同样自动加载 | 已验证：本仓库的 AGENTS.md 会被 CodeBuddy 读取为项目指导 |
| `$ARGUMENTS` | 无 | 参数直接写在请求里（"…职位：https://…"） |

如果项目级 skills 没被识别，把 `.codebuddy/skills/<name>/` 复制到
`~/.codebuddy/skills/<name>/`（用户级）即可，内容无需改动。

## 安装步骤（Windows）

```powershell
# 1. 安装各招聘 CLI 的 TypeScript 开发类型（可选；这些 CLI 零运行时依赖）
$tools = @("jobbank-search","jobdanmark-search","jobindex-search","jobnet-search","linkedin-search","freehire-search","v2ex-search")
foreach ($tool in $tools) {
  if (Test-Path ".agents/skills/$tool/cli") {
    Push-Location ".agents/skills/$tool/cli"; bun install; Pop-Location
  }
}

# 2. 确认 LaTeX（CV/求职信编译必需）
lualatex --version; xelatex --version

# 3. 可选：ATS 文本层检查需要 pypdf
pip install pypdf
```

然后在 CodeBuddy 里说：**"用 setup 技能帮我建立求职档案"**，之后：

- "帮我看看有哪些匹配的职位"（= `/scrape`）
- "帮我申请这个职位：`<粘贴的 JD>`"（= `/apply`，国内主路径）
- "给这批职位排个序"（= `/rank`）

## 中国大陆用户必读

- **主流招聘站接不进来**：Boss 直聘 / 拉勾 / 51job 有 WAF 与风控，智联与猎聘的
  robots.txt 明确禁止程序化访问。实测证据见 [`PORTALS_CN.md`](PORTALS_CN.md)。
- **主路径是粘贴 JD**：在招聘 App 里复制岗位描述，直接交给申请流程。
- **可选补充源**：`.agents/skills/v2ex-search/`（V2EX 公开招聘节点，公开 API v1），
  默认 `enabled: false`，启用前请按其 `SKILL.md` 完成 robots 核验 + 真机查询。
- **中文简历**：默认 moderncv 是英文模板。运行 `/add-template` 注册你的中文模板
  （`ctex`/`xeCJK` + `xelatex`，或 Typst），`/apply` 会改用它的编译命令与页数规则。

## 与上游保持同步

`.codebuddy/` 是 fork 层文件，不属于上游。拉取上游更新时只需确认：
`AGENTS.md` 被改动时，本文件的 CodeBuddy 段落是否还在；
`.claude/commands/` 新增命令时，是否在 `.codebuddy/skills/` 补一个对应的薄指针。
