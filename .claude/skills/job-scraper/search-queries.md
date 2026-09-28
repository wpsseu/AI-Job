# Search Queries for Job Scraper

<!-- SETUP: 由 /setup 按本人信息生成。市场：中国（北京 / 上海 / 苏州，接受出差驻场与海外） -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` 会自动发现 `.agents/skills/*/SKILL.md` 下所有 skill，先跑 CLI，再用本文件的 `site:` 模板做 WebSearch 兜底。

当前状态（`/setup` 已按市场设置）：

| Portal skill | enabled | 说明 |
|---|---|---|
| `linkedin-search` | true | 跨国可用；国内岗位覆盖有限，但外企 / 海外岗信号好。查询见 Priority 4 的英文 query |
| `freehire-search` | true | 国际 tech 聚合，偏远程 / 外企；可用 `--region/--country/--remote` |
| `v2ex-search` | false | V2EX jobs 节点，量小、偏远程外企；需要时把 frontmatter 改 `enabled: true` |
| `jobindex / jobnet / jobdanmark / jobbank` | false | 丹麦站点演示，对中国市场无用，保持关闭（关闭不产生任何成本） |

**中国市场没有可用的 portal CLI。** BOSS 直聘、猎聘、脉脉、企业官网招聘页均有登录墙与反爬机制：`/add-portal` 的契约要求 robots 核验与匿名可达，这几类站点会被直接拒绝，不要尝试为其生成 skill。国内岗位的获取路径是：

1. **手动粘贴 JD**（推荐，信号最好）：把 BOSS / 猎聘 / 脉脉 / 官网上的职位正文或链接直接给到 `/apply`，跳过 `/scrape`。
2. **WebSearch `site:` 检索兜底**：用下方 query 找到职位页，再人工打开取全文（登录墙内容抓取不到，需复制粘贴）。
3. **企业官网 careers 页**：用 `site:<company-careers-domain>` 直接检索，命中率高于聚合站。

`site:` 查询模板是 **WebSearch 兜底**，专为没有 CLI 的站点、公司招聘页与 CLI 失败时使用。

**Language scope:** 本人工作语言为 **中文（母语）** 与 **英语（CET-6，可技术会议交流）**。查询以中文为主；LinkedIn / 外企岗用英文关键词。JD 要求日语或德语 → 未声明语言，Language Gate 硬否决；JD 要求 "fluent English" 高于已声明水平 → FLAG 并交本人判断，不静默通过也不静默丢弃（见 `04-job-evaluation.md`）。

## Search Sites

Primary（本人所在市场，均无 CLI，走 `site:` 检索 + 手动粘贴）：
- **zhipin.com**（BOSS 直聘）- 国内互联网 / 车企岗位量最大，需登录，只能检索到标题页
- **liepin.com**（猎聘）- 中高端岗位与猎头渠道
- **maimai.cn**（脉脉）- 职场社区与内推信息，常能拿到 team / 汇报线情报
- **企业官网 careers 页** - 车企 / Tier One / AI 公司招聘页（site: 检索命中率高于聚合站）

Secondary：
- **linkedin.com/jobs** - 已被 `linkedin-search` CLI 覆盖；外企与海外岗用英文 query
- **nowcoder.com / 牛客**、**eleduck.com**（电鸭，远程岗）- 可选补充

## Query Categories

按"职能"而非单一职位标题组织 —— 同一类工作在不同公司叫法不同。每个分类内给出多个标题变体。检索时叠加城市词（北京 / 上海 / 苏州）。

### Priority 1: AI 评测负责人 / 大模型评测

最强且最想做的方向。

```
site:zhipin.com "AI评测" 北京
site:zhipin.com "大模型评测" 北京 OR 上海
site:liepin.com "算法评测" OR "模型评测" 北京
site:liepin.com "AI 质量" OR "评测负责人" 上海
site:maimai.cn "大模型评测" 北京
site:zhipin.com "Agent 评测" 北京 OR 苏州
site:linkedin.com/jobs "LLM evaluation" OR "AI evaluation" China
```

### Priority 2: 智能座舱测试经理 / 车载 AI 测试

领域专长方向。

```
site:zhipin.com "智能座舱测试" 北京 OR 上海 OR 苏州
site:zhipin.com "车载测试" "智能座舱" 北京
site:liepin.com "座舱测试经理" OR "车载测试负责人" 上海
site:liepin.com "智能驾驶测试" OR "智驾测试" 北京
site:zhipin.com "DMS" OR "OMS" OR "舱内感知" 测试 上海
```

### Priority 3: 测试开发架构师 / 测试平台负责人

可平移的相邻方向（有落地经验，正式头衔较弱，属"需要讲清楚"的一类）。

```
site:zhipin.com "测试开发架构师" 北京 OR 上海
site:zhipin.com "测试平台" 负责人 北京
site:liepin.com "自动化测试负责人" OR "测试架构师" 上海 OR 苏州
site:zhipin.com "测试开发专家" 车载 OR 汽车 北京
```

### Priority 4: 更宽的技术 / 质量网

更宽口径，兜住叫法不标准的岗位。

```
site:zhipin.com "AI 测试" 北京 OR 上海
site:zhipin.com "大模型" 测试 苏州 OR 上海
site:liepin.com "质量负责人" 汽车电子 北京
site:linkedin.com/jobs "test architect" OR "QA manager" automotive China
site:linkedin.com/jobs "AI quality" OR "model evaluation" China OR remote
```

## Location Filter

评估抓取结果时核对城市。本人可接受范围：

- **北京**（现居，理想）
- **上海**（可接受）
- **苏州**（可接受，曾任职地）
- **需长期出差 / 客户驻场的岗位**（可接受，明确写在 JD 里的也算 PASS）
- **海外岗位**（可接受，含 relocation）- 不因地理位置否决，但需在报告中点明签证 / 时区等实际约束
- **国内其他城市远程**：borderline，按需单独判断

语言与地点无关，走 Language Gate 单独判定。

## Language Filter

工作语言见 CLAUDE.md 的 Languages 表（中文母语、英语 CET-6）。按 `04-job-evaluation.md` 的 Language Gate 过滤：要求未声明语言（日语 / 德语）→ 排除；要求高于已声明水平（如 "fluent English"）→ 不排除，明确 FLAG 交本人判断。仅 JD 文本语言不同、岗位本身不需要该语言的，正常保留。

## Salary Filter（deal-breaker）

- 月薪低于 **25K** → 直接跳过，不评分不撰写（CLAUDE.md Deal-breakers）
- 目标基线 **31K × 15**（年薪约 46.5 万）：低于基线的岗位在 Career Alignment 维度扣分，并在报告中点明差额
- JD 未写薪资时不要推测，标注"薪资未知"并在评估里提示

## Date Filter

只保留 14 天内发布、或申请截止日期未过的职位。无法确定发布日期的，保留但标注 "date unknown"。

## Adapting Queries

用户指定 focus 时，从对应分类取 query，并额外生成 2-3 条针对该 focus 的自定义 query。例如：
- "/scrape 大模型评测" -> Priority 1 全部 query + `"大模型评测" <focus>` 变体
- "/scrape 上海" -> 各分类 query 叠加 上海
