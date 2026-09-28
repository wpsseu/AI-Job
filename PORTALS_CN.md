# 国内招聘平台接入评估（中国大陆）

这份文档记录的是**实测结果**，不是设想。结论先行：

> **Boss 直聘、拉勾、前程无忧、智联、猎聘等主流招聘站，都不能作为匿名抓取的
> 门户技能接入。** 原因有三类：登录墙、风控/WAF 拦截、robots.txt 明确禁止。
> 本仓库的 `/add-portal`（`.claude/commands/add-portal.md`）对这三类都有硬性
> 拒绝规则，所以"加个国内爬虫"这条路在框架内是被设计成走不通的。
>
> 国内真正可用的主路径是 **`/apply <粘贴 JD 文本>`** —— 流程能力（匹配评估、
> 定制简历、求职信、面试准备、跟踪）完全不受影响。

---

## 1. 实测结果（2026-09，本机直连，无代理）

| 平台 | 探测目标 | 实测返回 | 结论 |
|------|----------|----------|------|
| Boss 直聘 | `zhipin.com/wapi/zpgeek/search/joblist.json` | `{"code":37,"message":"您的环境存在异常."}` | ❌ 风控拦截（需设备指纹/签名 + 登录） |
| 拉勾 | `lagou.com/jobs/positionAjax.json` | 阿里云 WAF 页（`aliyun_waf_aa`） | ❌ WAF 拦截 + 需登录 |
| 前程无忧 51job | `we.51job.com/api/job/search-pc` | 阿里云 WAF 页 | ❌ WAF 拦截 |
| 智联招聘 | `fe-api.zhaopin.com/c/i/sou` | HTTP 200 但 `results: []`（接口已不对匿名调用返回数据） | ❌ 且 robots 明确禁止（见下） |
| 猎聘 | `liepin.com/zhaopin/` | 返回 HTML 壳 | ❌ robots 禁止带查询串的 URL |
| 实习僧 / 牛客 | 列表页 / API | 连接超时 | ❌ 本机不可达，且均有登录墙 |
| 电鸭 eleduck | `/api/v1/posts?category=8` | 404（路径不存在） | ❌ 无可用的公开搜索端点 |
| V2EX | `v2ex.com/api/topics/show.json?node_name=jobs` | 本机网络不可达（未验证） | ⚠️ 官方提供公开 API v1，已按契约建成 skill，默认 **disabled**，待你在本地真机验证后启用 |

### robots.txt 原文摘录（这两条是决定性的）

`https://www.zhaopin.com/robots.txt`：

```
User-agent: *
Disallow: /*?*
Disallow: */api/*
Disallow: /*.json*
```

`https://www.liepin.com/robots.txt`：

```
User-agent: *
Disallow: /*?*
```

智联的 `*/api/*` 与 `/*.json*` 直接禁止了它自己的 JSON 接口；猎聘的 `/*?*`
禁止了任何带查询串的 URL，而搜索必然带查询串。按本仓库
`tools/robots_check.py` 采用的保守规则（RFC 9309：最长匹配优先、等长时
`Disallow` 胜、`*` 或 `Claude-User` 任一命中即封），这两个站点的程序化访问
属于**明确被禁止**，不是灰色地带。

---

## 2. 那国内怎么用这套框架

### 主路径：粘贴 JD（推荐）

```
/apply <把 Boss 直聘 / 拉勾 / 猎聘 App 里的岗位描述整段粘贴进来>
```

`/apply` 本来就支持"URL 抓不到就粘贴文本"，而国内站点几乎必然抓不到。
粘贴后完整流程照跑：解析 JD → 匹配评估 → 定制 CV → 求职信 → 评审代理 →
编译校验 PDF → ATS 检查 → 归档到 `documents/applications/`。

> 安全提示：粘贴的 JD 是不可信输入。流程不会执行 JD 里嵌入的指令，也不会
> 抓取 JD 正文里的链接；公司相关信息必须独立联网核实。

### 辅助路径：V2EX 招聘节点（可选，默认关闭）

`.agents/skills/v2ex-search/` —— 用 V2EX 公开 API v1 抓 `jobs` / `career` /
`outsourcing` 节点的中文技术岗帖子。它是社区帖，不是结构化职位库，但可以
作为"中文技术岗信息流"的补充源。启用步骤见该 skill 的 `SKILL.md`（robots
核验 → 真机查询 → 打开 `enabled`）。

### 官方渠道路径

如果你能拿到某平台的**官方开放 API 授权**（企业/HR 侧合作、官方开发者平台），
用 `/add-portal` 接入即可 —— 它在"需要 credential"的场景下会从环境变量
`<SERVICE>_API_TOKEN` 读取，绝不通过命令行 flag 传递（flag 会进 shell
history 和进程列表）。

---

## 3. 中文 CV / 求职信模板

默认模板是英文 moderncv（banking 风格）+ `cover.cls`，直接写中文需要换模板：

```
/add-template
```

注册你自己的中文模板（`ctex` / `xeCJK` + `xelatex` 编译，或 Typst）。命令会
记录扩展名、编译命令、字体、页数限制，并强制做一次测试编译。中文简历的
ATS 检查要注意：确保 PDF 文本层能提取出中文（`tools/verify_pdf.py` 的
`--dump-text` 可以直接看），否则说明字体未嵌入或用了图片型排版。

## 4. 贡献回上游

按仓库约定（`CONTRIBUTING.md`、`.claude/commands/add-portal.md`），
**市场特定的数据源属于 fork，不向上游 PR**。如果你做出了能用的国内门户
skill，请发布到社区分支索引
[#78](https://github.com/MadsLorentzen/ai-job-search/discussions/78)，
让其他人可以复制 —— 复制前请完整读一遍代码，这是仓库刻意保留的人工步骤。
