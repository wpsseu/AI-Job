---
description: 中国大陆使用规则：主流招聘站不可抓取，主路径是粘贴 JD；中文简历用自定义模板；robots 与登录墙红线
---

# 中国大陆使用规则

1. **不要写爬虫去抓 Boss 直聘、拉勾、前程无忧、智联、猎聘、实习僧、牛客。**
   原因与实测证据见 `PORTALS_CN.md`：登录墙、风控/WAF 拦截、robots.txt 明确禁止
   （智联 `Disallow: */api/*` 与 `/*.json*`；猎聘 `Disallow: /*?*`）。
   用 `/add-portal` 接入时遇到登录墙应直接停止，不要"想办法绕过"。
2. **主路径是粘贴 JD 文本。** 让用户在招聘 App 里复制岗位描述，然后跑申请流程
   （`/apply <粘贴的 JD>`）。流程能力不受影响。
3. **可选的补充源**：`.agents/skills/v2ex-search/`（V2EX 公开招聘节点，公开 API v1）。
   默认 `enabled: false`；启用前必须先跑 robots 核验与真机查询，见其 `SKILL.md`。
4. **中文简历走自定义模板。** 默认 moderncv 是英文模板。让用户运行 `/add-template`
   注册中文模板（`ctex`/`xeCJK` + `xelatex`，或 Typst），`/apply` 会按其声明的
   编译命令与页数限制出稿。中文 PDF 必须确认文本层能提取出中文，否则 ATS 读不到。
5. **国内邮箱**：`/gmail-sync` 依赖 Gmail 连接器，QQ/163/Outlook 邮箱不适用，
   不要尝试改造，改为手动 `/outcome` 记录。
6. **薪资基准**：`salary_lookup.py` 需要自备数据源，国内可放入脉脉/看准/OfferShow
   等自己整理的数据（格式见 `tools/README_SALARY_TOOL.md`），没有数据就跳过该步骤。
