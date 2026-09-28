# AI Job Search 中文说明

*在你自己的机器上运行的求职流程。*

<p align="center">
  <img src="assets/mascot/pip_flight_loop.gif" alt="Pip, the courier bird" width="200">
</p>

AI 驱动的求职申请框架，基于 [Claude Code](https://claude.com/claude-code) 构建。你可以 Fork 这个仓库，填写你的个人资料，然后让 Claude 评估职位，定制你的简历，撰写求职信，并为面试做准备。

> 说明：这是一个独立的开源项目，不隶属于、认可、赞助或由 Anthropic 维护。Anthropic 和 Claude Code 仅用于描述这个工作流所使用的工具链。
>
> 这个项目没有关联的加密货币、代币或付费赞助计划。任何声称拥有此类计划的内容都是未经授权的，应视为诈骗。支持该项目的唯一方式是 Ko-fi 链接，以及在 GitHub 上做贡献。

## 它到底管不管用？

我原本是地球物理学家。2025 年末我的岗位被裁掉后，我构建了这个框架来运行自己的求职流程——也是这个仓库里相同的 `/scrape`、`/apply` 和 `/interview` 工作流，每周都会用在我的职业生涯中。我对每位雇主都坦诚说明了这一点，而不是把它当成负担，通常反而引发了真实的技术对话。

在 69 份定制化申请、20 次一轮面试和 1 份签约合同之后，我于 2026 年 6 月开始了一份 AI 工程师的工作。许多人一直在问它“真的有效吗”。答案是：它确实帮我拿到了工作。现在它也属于你。

*更完整的版本，包括整个申请漏斗流程，见 [LinkedIn](https://www.linkedin.com/in/mads-lorentzen/)。*

## 这个项目是什么

这是一个结构化的工作流，把 Claude Code 转变成一套全栈求职申请助手。核心流程（自我画像、职位匹配评估以及草稿-评审者申请管线）是跨语言和跨国家的。职位搜索技能主要面向丹麦市场（Jobindex、Jobnet、Akademikernes Jobbank 等），但该模式也可以很容易替换为你所在地区的本地招聘平台。

```
/setup          /scrape              /apply <url>
  |                |                     |
  v                v                     v
填写个人资料    搜索职位            评估匹配度
  |                |                     |
  v                v                     v
档案资料已就绪  展示候选职位       起草 CV + 求职信
                   |                     |
                   v                     v
               选择一个职位         审稿人代理评审
               -> /apply            -> 修改 -> 最终输出
```

这个框架编码了职业指导的最佳实践，包括结构化评估标准、前瞻性求职信写法和可选的薪资基准分析。

## 先决条件

- [Claude Code](https://claude.com/claude-code)（CLI）。如果你打算用其他代理工具（Codex、Antigravity、Gemini CLI）？可从 [AGENTS.md](AGENTS.md) 开始——职位搜索技能已经内置，且 [社区分支](https://github.com/MadsLorentzen/ai-job-search/discussions/78) 也能适配完整工作流。
- Python 3.10+
- [Bun](https://bun.sh)（用于职位搜索 CLI 工具）
- 带有 `lualatex` 和 `xelatex` 的 LaTeX 环境：如 [TeX Live](https://tug.org/texlive/)、[MacTeX](https://tug.org/mactex/)、[TinyTeX](https://yihui.org/tinytex/) 或 [MiKTeX](https://miktex.org/)。CV 使用 `lualatex` 编译（在较新的 MiKTeX 环境中，`pdflatex` 常会因 `fontawesome5` 字体扩展错误失败）；求职信则使用 `xelatex`，因为 `cover.cls` 依赖 `fontspec`。如果你使用的是最小版 TeX 安装（如 TinyTeX 或 BasicTeX），请安装 [SETUP.md](SETUP.md#minimal-tex-install-tinytexbasictex) 中列出的额外包。
- 可选：`pip install pypdf`，用于 `/apply` 的 ATS 可解析性检查（BSD 许可；无需 Poppler）。Poppler 的 `pdftotext` 仍可作为备用方案（macOS：`brew install poppler`，Debian/Ubuntu：`apt install poppler-utils`，Windows：`choco install poppler`）。如果两者都没有，检查会退化为视觉关键词审核。

## 快速开始

> 🎥 **想先看实际演示？** [The Next New Thing 做了一个动手演示](https://www.youtube.com/watch?v=HoVxjMNFYv4)，展示了从设置到完成申请的实际工作流（录制于 2026 年 8 月；命令可能略有演进）。

### 1. Fork 并克隆

```bash
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
```

> [!IMPORTANT]
> **Fork 这个仓库始终是公开的**——GitHub 不允许为公共仓库创建私有 Fork——而且 `/setup`（下面第 3 步）会把你的个人数据（姓名、联系方式、工作经历、薪资期望）写入**已跟踪**文件。
> 如果这是你自己的求职副本，而不是为了向上游贡献代码，请使用 **私有仓库** 并将这个仓库作为 `upstream`，两分钟方案见 [SETUP.md 章节 8](SETUP.md#8-pulling-upstream-updates-into-your-fork)，而且所有更新流程都相同。只有在需要回馈源码时才建议直接 Fork。

### 2. 安装职位搜索工具

PowerShell：

```powershell
$tools = @("jobbank-search", "jobdanmark-search", "jobindex-search", "jobnet-search", "linkedin-search", "freehire-search")
foreach ($tool in $tools) {
  Push-Location ".agents/skills/$tool/cli"
  bun install
  Pop-Location
}
```

Bash / zsh / Git Bash：

```bash
for tool in jobbank-search jobdanmark-search jobindex-search jobnet-search linkedin-search freehire-search; do
  (cd .agents/skills/$tool/cli && bun install)
done
```

对于 `linkedin-search` 和 `freehire-search`，安装是可选的：两者都没有运行时依赖，可直接使用纯 `bun`；`bun install` 只会拉取 TypeScript 开发类型。

### 3. 设置你的个人资料

```bash
claude
# 然后在 Claude Code 中：
/setup
```

`/setup` 提供三种路线：读取你已经填充好的 `documents/` 文件夹（CV PDF、LinkedIn 导出、学历证明、推荐信、以往申请材料），在聊天中导入单个粘贴的简历，或者走访谈式引导。它会自动识别你具备哪些材料，并按情况提问。Documents 文件夹模式是幂等且安全的，可在你添加更多材料后反复执行；详细布局见 `documents/README.md`。

### 4. 搜索职位

```bash
/scrape
```

此命令会搜索多个招聘平台，匹配你个人资料对应的职位，去重后按合适度排序展示。你可以直接从中挑选一个职位运行 `/apply`，或者当抓取结果过多而不想逐个查看时，可以先执行 `/rank`，批量按匹配框架给它们打分，并得到排序后的短名单。

### 5. 提交申请

```bash
/apply https://jobindex.dk/job/1234567
```

如果 URL 无法抓取（有些招聘网站会阻止自动访问），也可以直接粘贴岗位描述文本：

```bash
/apply <把完整岗位描述粘贴到这里>
```

这会运行完整工作流：评估匹配度、生成 CV 和求职信、由第二个代理评审、修订、最终展示结果。

职位描述被视为不可信输入（系统不会遵循其内嵌指令，也不会从其内容中抓取链接），但防御的层级是指令级而不是沙箱——在不熟悉的招聘平台上，发送前请快速核对抓取和生成的内容。更多细节见 [SECURITY.md](SECURITY.md)。

## 其他命令

`/setup`、`/scrape` 和 `/apply` 构成核心工作流。完成个人资料后，还有 10 个扩展命令：

- **`/interview`**：为已跟踪申请中的安排面试做准备。它根据申请档案（原始岗位描述、面试官实际阅读过的 CV 和求职信、早期轮次反馈）构建分阶段准备包，研究公司和面试官，并遵循“先验证再使用”的规则，映射可能问题到你的 STAR 例子，再提供按角色扮演协议进行的模拟面试。对缺口给出诚实的桥接回答，而不是编造经历。
- **`/outcome`**：记录申请结果——面试阶段、录用、拒绝、沉默。它会把提交的 CV、求职信和岗位描述归档到 `documents/applications/<company>_<role>/`，保留符合 `/setup` 路径 A 格式的 `outcome.md`，并更新跟踪器。它还负责处理还没拿到结果之前的“拉伸任务”：`/outcome followup` 会向你展示已经安静很久的开放申请，按你用过的写作风格起草一段适合渠道的跟进信息（仅基于你已提交材料中的事实，且仅作为草稿，不自动发送；同一申请最多两次），并在记录面试阶段时附带感谢信。一旦少量申请结束，它会引导你回到 `/setup`，根据实际拿到的面试来校准匹配框架。
- **`/notion-sync`**：通过官方 Notion MCP Server 把流程的只读视图发布到 Notion 数据库（OAuth，无需 API Key）——每个排序后的岗位一行，每个已跟踪申请一行，并为每行生成只读简介页。仓库文件仍然是系统记录：没有同步回写，且文档仅同步文件名。它与 `/html-report` 互补：后者是你在桌面端生成的深度离线仪表盘；前者是从 Notion 运行环境快速查看的简洁视图。
- **`/gmail-sync`**：通过 Gmail 连接器读取你的邮件，识别开放申请中的状态信号——面试邀请、评估链接、录用、拒绝——并在写入跟踪器或 `outcome.md` 前先以批量方式提给你审批，且在每条建议中标注来源邮件。录用不会直接提议 `hired`/`offer_declined`，因为这需要你的决定；冲突或未命中信号会被标记为需人工 `/outcome` 复核，而不是猜测。
- **`/rank`**：连接 `/scrape` 和 `/apply`：它会批量根据匹配框架为新抓取的岗位进行打分（并行代理抓取每个岗位并评价五个维度），返回带有诚实优缺点的排序短名单。Deal-breakers 会直接否决，期限会给出紧急标记，失效岗位会被标记为过期。选中编号后，它会接入完整的 `/apply` 流程。
- **`/expand`**：通过扫描你资料中已链接的公开来源（GitHub 仓库、作品集网站、Kaggle、Google Scholar）并检索命名课程和证书的教学大纲，扩充你的个人资料。发现的能力会以来源标签写回个人档案。适合在 `/setup` 后使用，帮助揭示仅靠文档无法完整表达的技能。
- **`/upskill`**：分析你的个人资料、已跟踪岗位和已排序未跟踪岗位（`/rank` 记录于 `seen_jobs.json` 的差距）之间的差异——或单个岗位 `/upskill <URL>`。生成优先级热力图和学习计划，并附带网络检索得到的学习资源和时间估算。适合在申请间隙做职业规划。
- **`/html-report`**：从 `job_search_tracker.csv` 和申请档案生成独立 HTML 仪表盘——统计卡片、状态/行业/渠道/漏斗图表（内联 SVG，无外部依赖），以及可筛选的申请表格。可在浏览器中直接打开，完全离线。每次 `/apply` 或 `/outcome` 新增记录后都可重新生成。
- **`/add-template`**：注册你自己的 CV 或求职信模板（LaTeX、Typst 或其他工具链），替换默认模板。它会记录模板说明（源扩展名、编译命令、字体、样式规则、页数限制），执行强制测试编译，并把模板接入 `/apply`。见 [Custom templates](#custom-templates) 下文。
- **`/add-portal`**：为你所在市场的招聘平台生成职位搜索技能。它会调查该平台（搜索 URL 模式、结果结构、访问规则），按已提供技能的同一结构生成 CLI 技能，并在注册前执行实时查询测试。见 [Job search tools](#job-search-tools) 下文。

`/reset` 也可用，见下文 [Starting over](#starting-over)。

## 文件结构

```
ai-job-search/
├── CLAUDE.md                          # 主要候选人资料 + 工作流规则
├── .claude/
│   ├── commands/
│   │   ├── apply.md                   # /apply 工作流（草稿-评审）
│   │   ├── setup.md                   # /setup 入门（文档夹、CV 导入或访谈）
│   │   ├── expand.md                  # /expand 从文档和在线存在扩充能力
│   │   ├── add-template.md            # /add-template 注册自定义模板（LaTeX, Typst, ...）
│   │   ├── add-portal.md              # /add-portal 为你所在市场生成岗位搜索技能
│   │   ├── rank.md                    # /rank 对抓取到的职位排序筛选
│   │   ├── outcome.md                 # /outcome 记录申请结果、归档材料
│   │   ├── gmail-sync.md              # /gmail-sync 从 Gmail 自动检测申请状态
│   │   ├── interview.md               # /interview 分阶段准备 + 模拟面试
│   │   ├── html-report.md             # /html-report 生成申请跟踪仪表盘
│   │   ├── notion-sync.md             # /notion-sync 在 Notion 数据库中展示单向流程
│   │   └── reset.md                   # /reset 清除个人资料或文档夹
│   ├── skills/
│   │   ├── job-application-assistant/  # 核心申请技能
│   │   │   ├── SKILL.md               # 技能定义
│   │   │   ├── 01-candidate-profile.md # 教育、经验、技能
│   │   │   ├── 02-behavioral-profile.md# PI/DISC/人格评估
│   │   │   ├── 03-writing-style.md    # 语气、结构、做与不做
│   │   │   ├── 04-job-evaluation.md   # 岗位匹配评分框架
│   │   │   ├── 05-cv-templates.md     # LaTeX CV 结构 + 定制规则
│   │   │   ├── 06-cover-letter-templates.md # LaTeX 求职信模板
│   │   │   └── 07-interview-prep.md   # STAR 例子 + 面试框架
│   │   ├── job-scraper/               # 岗位搜索编排
│   │   └── upskill/                   # /upskill 技能差距分析与学习计划
│   └── settings.json                  # Claude Code 权限（共享、范围化）
├── .agents/skills/                    # 岗位搜索 CLI 工具
│   ├── jobbank-search/                # Akademikernes Jobbank（丹麦）
│   ├── jobdanmark-search/             # Jobdanmark.dk（丹麦）
│   ├── jobindex-search/               # Jobindex.dk（丹麦）
│   ├── jobnet-search/                 # Jobnet.dk（丹麦，政府平台）
│   ├── linkedin-search/               # LinkedIn 公共职位列表（跨国）
│   └── freehire-search/               # freehire.me 技术岗位聚合（多市场、REST API）
├── cv/
│   └── main_example.tex               # moderncv LaTeX 模板
├── cover_letters/
│   ├── cover.cls                      # 自定义求职信 LaTeX 类
│   ├── cover_example.tex              # 示例求职信（结构参考 + CI 烟雾测试）
│   └── OpenFonts/                     # Lato + Raleway 字体
├── templates/                         # 通过 /add-template 注册的自定义模板
│   └── README.md                      # 文件夹说明
├── documents/                         # /setup 路径 A 和 /expand 使用的职业材料
│   ├── README.md                      # 文件夹说明
│   ├── cv/                            # 主 CV（PDF 或 .tex）
│   ├── linkedin/                      # LinkedIn profile 导出（PDF）
│   ├── diplomas/                      # 学位证书和成绩单
│   ├── references/                    # 推荐信
│   └── applications/                  # 过往申请记录（<company>_<role>/）
├── .github/workflows/ci.yml           # CI：LaTeX 烟雾编译、技能 lint、CLI 类型检查
├── salary_lookup.py                   # 薪资基准工具（需要你自己的数据）
├── tools/
│   ├── check_framework_version.py     # CI 检查：技能文件变更时需更新 framework_version
│   ├── check_upstream_updates.py      # 预览上游更新会影响哪些个性化文件
│   ├── convert_salary_excel.py        # 将工资 Excel 转换为 JSON
│   ├── lint_skills.py                 # CI lint：检查 skills、commands、settings.json
│   ├── robots_check.py                # 对浏览器请求重试做 robots.txt 审核
│   ├── security_guards.py             # CI 守卫：权限白名单、gitignore 规则、清单
│   ├── upstream_triage.py             # 将上游提交分为值得查看与可能跳过
│   ├── verify_layout.py               # 评估已编译 PDF 的页布局（空洞、孤立标题、页脚碰撞）
│   ├── verify_pdf.py                  # 检查已编译 PDF 的页数和可提取文本
│   └── README_SALARY_TOOL.md          # 薪资工具安装说明
├── job_scraper/                       # 抓取器状态（已看岗位、抓取结果）
├── gmail_sync/                        # /gmail-sync 状态（已处理消息 ID、最后同步日期）
├── upskill/                           # /upskill 生成的报告输出（按运行生成 markdown）
├── job_search_tracker.csv             # 申请跟踪电子表格
└── SETUP.md                           # 详细安装与设置指南
```

## `/apply` 工作原理

`/apply` 命令运行一个基于“草稿-评审者”的工作流，并强制执行 PDF 编译：

1. 解析岗位描述（URL 或文本）
2. 按你的个人资料评估匹配度（技能、经验、文化、地点、职业方向）
3. 起草符合岗位需求的 CV 和求职信（LaTeX）
4. 生成一个评审代理，研究公司并批判草稿
5. 根据评审反馈进行修订
6. 编译并检查 PDF：CV 使用 `lualatex`，求职信使用 `xelatex`；Claude 会阅读渲染后的页面并反复修正 LaTeX，直到 CV 恰好两页且没有孤立标题，求职信恰好一页且签名可见、字体一致
7. 对 CV 做 ATS 检查：提取 PDF 的文本层（`pdftotext`，可选依赖），验证它在 ATS 解析器眼中的样子——联系人详情必须以文字出现、不能出现乱码、阅读顺序合理——然后对岗位关键词覆盖率做评分。真正支持的关键词会写进经验条目；真实缺口会诚实保留，而不是硬塞进去
8. 最终展示结果，并给出核验清单

所有 CV 和求职信中的表述都要与你的真实资料一致。系统永远不会捏造技能或经历。

### 这个工作流的不同之处

- **PDF 核验循环。** 大多数 LaTeX 简历模板看起来在 `.tex` 文件中没问题，但在 PDF 中却崩掉：职位标题被孤立到下一页、求职信溢出到第二页、列表字体悄悄回落到正文字体。`/apply` 会在每次申请中编译并视觉检查每个 PDF，并应用针对性修正（如 `\needspace`、`\enlargethispage`、列表项目的字体匹配包装），直到排版干净为止。
- **对 PDF 文本层的 ATS 验证。** ATS 读取的是 PDF 内嵌文本，而不是渲染页面——而 LaTeX 可能会静默生成一个“看起来正常但提取时乱码”的 PDF（例如邮箱位置变成图标符号、列布局导致文本交错）。`/apply` 会用 `pdftotext` 提取已编译 CV 的文本层，验证联系人信息、阅读顺序和岗位关键词覆盖率。诚实规则被强制执行：不真实支持的关键词必须承认缺口，而不是硬塞进去。
- **按相关性加权裁剪 CV。** 当简历超过两页时，工作流不会机械地从“最早”一节删除内容，而是按以下三项打分：a) 与目标岗位的相关性，b) 文档中该表述的独特性，c) 求职信是否依赖它，然后优先裁剪总分最低的内容。一个较老职位中的某个关键词命中项，会优先保留，而不是被最近岗位中无关表达替代。
- **草稿-评审者分离。** 草稿由一个代理写出；然后另一个全新的 Claude 代理被启动，用于研究公司并批评草稿。随后草稿者再修改。这有助于发现遗漏关键词、弱框架和泛泛而谈的语言。
- **高效的评审代理分发。** 评审者接收的是内联草稿，而不是重读整份材料；最终只运行一次核验清单，而不是两边各跑一遍。注意：步骤 5 中新增的“编译并检查”会消耗掉一部分 token，但会显著减少错误 PDF 流向用户的问题。

---

## 适用于什么场景

这个项目非常适合：

- 你正在找工作，而且需要批量管理申请
- 你希望让 AI 帮你评估岗位与个人背景的匹配度
- 你需要个性化简历和求职信，而不是标准模板
- 你希望在面试前快速做准备和复盘
- 你要管理多个岗位来源、状态、时间线和归档材料

如果你只是临时找一份工作，当然也能用；但它的设计目标是为了中等到高频求职过程。

## 贡献与支持

如果你想改进这个仓库、修正错误、增加平台适配或提交模板/技能补丁，欢迎参与贡献。项目本身是开源的，欢迎 Fork 和 PR。

如果你希望支持作者：

- 访问 [Ko-fi](https://ko-fi.com/madslorentzen)
- 提交有用的改进、修复和讨论
- 通过 GitHub 参与社区交流

## 国内用户与 CodeBuddy

- **CodeBuddy（腾讯云代码助手）适配**：`.codebuddy/skills/` 为每个命令提供了薄指针技能，`.codebuddy/rules/` 提供两条常驻规则；完整说明见 [CODEBUDDY_CN.md](CODEBUDDY_CN.md)。
- **中国大陆招聘平台**：Boss 直聘、拉勾、前程无忧、智联、猎聘等站点经实测均不可匿名抓取（登录墙 / WAF / robots.txt 明确禁止），证据与替代方案见 [PORTALS_CN.md](PORTALS_CN.md)。国内主路径是「在招聘 App 里复制岗位描述 → 粘贴给申请流程」。
- **可选补充源**：`.agents/skills/v2ex-search/`（V2EX 公开招聘节点，公开 API v1），默认关闭，启用前需在本地完成 robots 核验与真机查询。

## 结论

AI Job Search 的核心设计是：把求职过程变成一个透明、可验证、可迭代的流程，而不是一堆“看起来不错”的模板生成结果。它强调：

- 真实个人资料
- 诚实的匹配评估
- 结构化申请
- PDF 可编译与可检查
- ATS 友好
- 面试准备和结果跟踪

这让它更接近一个“职业工具箱”，而不仅仅是一个聊天机器人生成文案的脚本。

如果你准备开始使用这个项目，建议从以下顺序入手：

1. 阅读 [README.md](README.md)
2. 阅读 [SETUP.md](SETUP.md)
3. 执行 `/setup`
4. 用 `/scrape` 找岗位
5. 用 `/apply` 处理重点岗位

---

中文版本基于英文项目说明整理，适合快速了解该仓库的工作流、结构与使用方式。更多细节请直接参考 [README.md](README.md) 及对应目录下的规范文件。
