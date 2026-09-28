# 安装指南

让 AI Job Search 框架运行起来的分步说明。

## 1. 先决条件

### Claude Code

安装 Claude Code（Anthropic 的 Claude CLI）：

```bash
npm install -g @anthropic-ai/claude-code
```

你需要 Anthropic API Key，或者 Claude Pro / Team 订阅。详细信息请见 [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code)。

### Python

需要 Python 3.10+，用于薪资查询工具。可通过以下命令检查：

```bash
python3 --version
```

在 Windows 上，`py --version` 往往是最可靠的检查方式。如果你的系统把 Python 暴露为 `python` 而不是 `python3`，那在下面的命令中也用 `python`。

### Bun（用于职位搜索工具）

职位搜索 CLI（4 个丹麦门户 + 2 个跨地区工具 `linkedin-search` 和 `freehire-search`）是用 TypeScript 编写的，运行时需要 Bun。

- macOS/Linux：

```bash
curl -fsSL https://bun.sh/install | bash
```

- Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://bun.sh/install.ps1 | iex"
```

如果你更喜欢包管理器，Windows 上也可以使用 `winget install Oven-sh.Bun`。

### LaTeX（用于编译 CV 和求职信）

安装 LaTeX 发行版来将生成的 `.tex` 文件编译成 PDF：

- **Windows:** [MiKTeX](https://miktex.org/download)
- **macOS:** [MacTeX](https://tug.org/mactex/)
- **Linux:** `sudo apt install texlive-full` 或 `sudo dnf install texlive-scheme-full`

CV 使用 `lualatex` 编译（在较新的 MiKTeX 安装中，`pdflatex` 常常因 `fontawesome5` 字体扩展错误而失败）。求职信使用 `xelatex`，因为 `cover.cls` 需要 `fontspec` 以支持自定义 Lato/Raleway 字体。

#### 最小 TeX 安装：TinyTeX/BasicTeX

完整的 TeX 发行版开箱即用，但最小化发行版在股票模板正常编译前，需要额外安装几个包。

在 macOS 上，用户级 TinyTeX 安装避免了系统级安装，也不需要 `sudo`：

```bash
curl -fsSL https://yihui.org/tinytex/install-bin-unix.sh -o /tmp/tinytex-install-bin-unix.sh
sh /tmp/tinytex-install-bin-unix.sh /tmp --no-path
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
```

然后安装模板依赖：

```bash
tlmgr install \
  moderncv fontawesome5 fontawesome6 academicons import luatexbase pgf \
  titlesec textpos xltxtra xunicode cite realscripts needspace
```

对于 BasicTeX/MacTeX，请先确保 TeX 二进制目录在 `PATH` 中（例如 `/Library/TeX/texbin`），然后再运行同样的 `tlmgr install ...` 命令。

安装后做快速烟雾测试：

```bash
cd cv && lualatex -interaction=nonstopmode -halt-on-error main_example.tex && cd ..

SMOKE_DIR="$(mktemp -d /tmp/ai-job-cover-smoke.XXXXXX)"
cp -R cover_letters/cover.cls cover_letters/OpenFonts "$SMOKE_DIR/"
cat >"$SMOKE_DIR/cover_smoke.tex" <<'EOF'
\documentclass[]{cover}
\begin{document}
\namesection{Test}{Candidate}{test@example.com}
\companyname{Example Company}
\companyaddress{123 Hiring Street\\Example City}
\currentdate{\today}
\lettercontent{Dear Hiring Manager,}
\lettercontent{This smoke test verifies that xelatex can load cover.cls and the bundled fonts.}
\closing{Sincerely,}
\signature{Test Candidate}
\end{document}
EOF
(cd "$SMOKE_DIR" && xelatex -interaction=nonstopmode -halt-on-error cover_smoke.tex)
```

#### Windows: 基础版 MiKTeX

完整的 MiKTeX 安装器捆绑了所有 CTAN 包，开箱即用，但较小的 [Basic MiKTeX](https://miktex.org/download) 安装器（`basic-miktex-*.exe`）只包含最小包集合，在股票模板编译前，需要进行几次一次性的设置。

默认情况下，MiKTeX 会按需安装缺失包，但会对每个包弹出 GUI 提示——这会阻塞非交互式终端（包括 Claude Code 的 Bash 工具）。把它改成静默自动安装：

```powershell
initexmf --admin --set-config-value=[MPM]AutoInstall=1
initexmf --set-config-value=[MPM]AutoInstall=1
```

（如果你是为所有用户安装了 MiKTeX，则在提升权限的管理员 PowerShell 中运行第一行；第二行适用于仅当前用户安装。只会有一条生效——取决于安装方式；两条都跑通常也无害。）

如果你不想依赖按需安装（例如后面需要完全离线编译），可以提前安装与上面 macOS TinyTeX 部分相同的包集合，使用 MiKTeX 的包管理器：

```powershell
mpm --admin --install=moderncv --install=fontawesome5 --install=fontawesome6 --install=academicons --install=import --install=luatexbase --install=pgf --install=titlesec --install=textpos --install=xltxtra --install=xunicode --install=cite --install=realscripts --install=needspace
```

如果 MiKTeX 是按当前用户安装的，去掉 `--admin` 即可。如果某个包名无法解析，`mpm --find=<name>` 可以搜索仓库中对应的正确名称。

安装后做快速烟雾测试（PowerShell）：

```powershell
Set-Location cv; lualatex -interaction=nonstopmode -halt-on-error main_example.tex; Set-Location ..

$SmokeDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "ai-job-cover-smoke-$(Get-Random)")
Copy-Item cover_letters\cover.cls, cover_letters\OpenFonts -Destination $SmokeDir -Recurse
@'
\documentclass[]{cover}
\begin{document}
\namesection{Test}{Candidate}{test@example.com}
\companyname{Example Company}
\companyaddress{123 Hiring Street\\Example City}
\currentdate{\today}
\lettercontent{Dear Hiring Manager,}
\lettercontent{This smoke test verifies that xelatex can load cover.cls and the bundled fonts.}
\closing{Sincerely,}
\signature{Test Candidate}
\end{document}
'@ | Set-Content (Join-Path $SmokeDir "cover_smoke.tex")
Push-Location $SmokeDir; xelatex -interaction=nonstopmode -halt-on-error cover_smoke.tex; Pop-Location
```

### 可选：ATS 文本提取（pypdf，然后是 pdftotext）

`/apply` 会对已编译的 CV 执行 ATS 可解析性检查：它会提取 PDF 的文本层，并验证联系信息、阅读顺序和关键词覆盖率，方式与招聘管理系统看到的一致。

默认提取器是 **pypdf**（BSD 许可，`pip install pypdf`）。Poppler 的 `pdftotext` 仍然可作为可选备用：

- **macOS:** `brew install poppler`
- **Debian/Ubuntu:** `sudo apt install poppler-utils`
- **Windows:** `choco install poppler`

如果某个命令仍然使用 `pdftotext -layout`，也必须同时传入 `-enc UTF-8`。如果 **两者都不可用**，`/apply` 会跳过机械检查并给出警告，退回到视觉关键词审查——除此之外一切都正常工作。

## 2. Fork 并克隆

```bash
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
gh repo set-default <your-github-username>/ai-job-search
```

或者手动：在 GitHub 上 Fork，然后克隆你的 Fork。

> **`set-default` 这行不是可选项。** `gh repo fork --clone` 会把
> **upstream** 仓库设为 gh 的默认仓库（"The `upstream` remote will be set as the default remote repository" —— `gh repo fork --help`），而 gh 在
> **创建 issue 和 PR** 时都会使用默认仓库。没有这一步，之后任何在这个克隆中运行的 `gh issue create` —— 无论是你自己还是你让 agent 帮你跟踪申请 —— 都会悄悄落到上游的 **公开** 跟踪器里，把 issue 内容以你的 GitHub 身份发布到一个你无法删除的仓库中（#389）。

> **在继续之前请注意：Fork 是公开的。** GitHub 无法让公共仓库的 Fork 变成私有，而 `/setup`（第 6 节）会把你的个人数据写入 **已跟踪** 文件——把这些提交推到 Fork 就会公开。如果这个副本用于你自己的求职，而不是为了贡献代码，最好使用一个 **私有仓库**，并将这个仓库作为 `upstream`：参考第 8 节、第 1 步，了解精确命令以及为什么将你的个性化内容提交到那里依然是正确选择。这个指南中的其他内容在两种方式下都一样工作。

## 3. 安装职位搜索 CLI 依赖

在仓库根目录运行这些命令。

- PowerShell：

```powershell
$tools = @("jobbank-search", "jobdanmark-search", "jobindex-search", "jobnet-search", "linkedin-search", "freehire-search")
foreach ($tool in $tools) {
  Push-Location ".agents/skills/$tool/cli"
  bun install
  Pop-Location
}
```

- Bash / zsh / Git Bash：
```bash
for tool in jobbank-search jobdanmark-search jobindex-search jobnet-search linkedin-search freehire-search; do
  (cd .agents/skills/$tool/cli && bun install)
done
```

对于 `linkedin-search` 和 `freehire-search`，安装是可选的：两者都没有运行时依赖，可直接使用纯 `bun`；`bun install` 只会拉取 TypeScript 开发类型。

如果你不在丹麦，你也可以通过 `/add-portal` 为你当地的招聘网站生成等价搜索技能——它会为任意公开门户生成同样的 CLI 结构，并在注册前执行一次真实查询测试。参见 README 中的“Job search tools”部分。

## 4. 运行设置访谈

在仓库中启动 Claude Code：

```bash
claude
```

然后运行入门流程：

```
/setup
```

Claude 会提供三条路径：

- **路径 A（文档文件夹）：** 在 `documents/` 下加入你的 CV、LinkedIn 导出、学历证明、推荐信或过去申请材料。Claude 会读取并交叉引用它们，再提出个人资料更新建议。这种方式最适合你有多个来源文件时。
- **路径 B（单个 CV 导入）：** 通过 `@` 提及文件或直接粘贴文本，分享一份 CV/简历。Claude 会提取内容，并对缺失项提出后续追问。
- **路径 C（访谈模式）：** 按章节逐段回答结构化访谈问题。

三种路径都会得到同样的结果：完整填充的个人资料文件。

### 会被填充哪些内容

| 文件 | 内容 |
|------|---------|
| `CLAUDE.md` | 你的完整候选人资料 |
| `01-candidate-profile.md` | 结构化教育、经验、技能 |
| `02-behavioral-profile.md` | 行为评估 |
| `04-job-evaluation.md` | 个性化技能匹配领域和职业目标 |
| `05-cv-templates.md` | 你的背景个人简介模板 |
| `07-interview-prep.md` | 来自你经历的 STAR 例子 |
| `cv/main_example.tex` | 你的 LaTeX CV（带真实细节） |
| `search-queries.md` | `/scrape` 使用的职位搜索查询 |

### 重新运行 setup

你以后也可以更新特定章节：

```
/setup --section skills
/setup --section experience
/setup --section search
```

`--section search` 选项在你的优先级变化时特别有用。它会重新运行搜索配置访谈，并根据你的完整资料提出你可能没考虑过的岗位类型。

## 5. 可选：设置薪资基准

如果你有薪资数据（来自工会、薪资调查、Glassdoor 或个人调研）：

1. **方案 A：** 在仓库根目录手动创建 `salary_data.json`（格式见 `tools/README_SALARY_TOOL.md`）
2. **方案 B：** 从 Excel 转换：
   ```bash
   pip install openpyxl
   python3 tools/convert_salary_excel.py path/to/salary-data.xlsx --source "My Salary Data 2025"
   ```

这会生成 `salary_data.json`，用于 `/apply` 工作流中的薪资基准。如果跳过这一步，薪资查询会被直接忽略。

## 6. 测试工作流

找到一个你感兴趣的职位描述，然后：

```
/apply https://jobindex.dk/job/1234567
```

或者直接粘贴岗位描述：

```
/apply [把职位描述文本粘贴在这里]
```

Claude 会：
1. 根据你的资料评估匹配度
2. 询问你是否继续
3. 起草一份定制化的 CV 和求职信
4. 让评审代理批评草稿
5. 修订并展示最终输出

## 7. 编译你的文档

当 `/apply` 生成 LaTeX 文件后：

```bash
# Bash / zsh / Git Bash
cd cv && lualatex main_<company>_<role>.tex && cd ..
cd cover_letters && xelatex cover_<company>_<role>.tex && cd ..
```

```powershell
# PowerShell
Set-Location cv; lualatex main_<company>_<role>.tex; Set-Location ..
Set-Location cover_letters; xelatex cover_<company>_<role>.tex; Set-Location ..
```

这些命令适用于股票模板（moderncv CV、`cover.cls` 求职信）。如果你想使用自己的 LaTeX 模板，运行 `/add-template`——它会记录模板的编译引擎、字体、样式规则和页数限制，进行测试编译，并把模板接入 `/apply`。参见 README 中的“LaTeX templates”部分。

## 8. 将上游更新合并到你的 Fork

上游会持续完善你 Fork 中已个性化的 methodology 文件，所以从第一天起就要规划更新：

**优先使用 release，而不是裸 `master`。** 已打标签的 [releases](../../releases) 是经过筛选的检查点，每个都描述在 [CHANGELOG.md](CHANGELOG.md) 中。更新到某个 tag 会拿到稳定、已记录的状态，而不是 `master` 在代码审查过程中随时可能变化的内容。先执行 `git fetch upstream --tags`，然后在想要稳定时合并一个 release（例如 `git merge v1.0.0`）；只有在你明确想要最新未发布改动时，才直接拉取 `master`。下面的步骤对两种方式都适用——你在看到 `upstream/master` 的地方用 release tag 替换即可。

1. **先提交你的个性化内容——但要知道这些提交落到哪里。** `/setup` 会直接修改 `CLAUDE.md` 和资料技能文件；这些修改是 **你的**，并提交它们是让更新合并得更干净的前提。但 GitHub 上的 **Fork 是公开的**——公共仓库的 Fork 无法设为私有——所以任何你 **提交并推到 fork** 的内容都会对任何人可见。如果你确实想让你的个人资料存在于远程仓库中，不要推到 fork：创建一个 **私有仓库**，把它推上去，并将这个仓库添加为 `upstream` 远程（`git remote add upstream https://github.com/MadsLorentzen/ai-job-search.git`）来继续接收更新。仅本地提交而不推送也可以。真正敏感的文件（tracker、薪资数据、`documents/`、申请归档）本来就被 gitignore 了，因此无论如何都不会进入 git。未提交的工作树是 `git pull` 拒绝合并的最常见原因（`Your local changes ... would be overwritten`）。
2. **拉取前先预览哪些内容发生了变化：**
   ```bash
   git remote add upstream https://github.com/MadsLorentzen/ai-job-search.git   # 仅第一次需要，如果你克隆的是自己的 fork
   git fetch upstream    # 如果你直接克隆的是模板，则用 origin
   python3 tools/check_upstream_updates.py
   ```
   它会对比你框架文件中的 `framework_version` 标记和上游版本，准确列出哪些 methodology 文件发生了变化，并附带每个文件的 diff 命令。

   这两个工具回答两个不同的问题，值得都运行一下：
   - **`check_upstream_updates.py`** —— *我的个性化文件里哪些变了？* 它读取每个 methodology 文件上的 `framework_version` 标记，因此能精确指出 release 改动了哪些定制文件。
   - **`upstream_triage.py`** —— *哪些上游提交值得我关注？* 它会遍历你落后于上游的提交，并将它们按“值得审查”与“大概率跳过”排序，过滤你已经 cherry-pick 的提交（通过 `git patch-id` 匹配，因此移植过的工作会自动消失，无需手动记账），另外过滤掉你删除了的文件对应提交，以及你在 `.github/upstream-wontport.txt` 里列出的 SHA。它是只读报告——它打印可执行的 `git cherry-pick` 命令，但绝不会直接合并、推送或打开 PR，因为在 fork 上，“适用 cleanly”不等于“正确”。

     ```bash
     python3 tools/upstream_triage.py --remote upstream
     ```

     Fork 还继承了一个 `.github/workflows/upstream-watch.yml`，它每周运行一次，并把结果写进单个滚动 issue（在上游模板本身上是 no-op，并在 fork 上保持禁用，直到你手动启用 Actions）。
3. **正常合并。** `git merge upstream/master`（或 `git pull`）会对你个性化内容周围进行三方合并；由于 methodology 的修改通常不会碰你 `/setup` 填写的行，大多数更新都会干净合并。在个性化文件中出现冲突不是失败，而是特征——这意味着上游改动了你自定义过的 methodology 区段，而版本标记和其 changelog 提交会告诉你原因。处理方式是：保留你的数据，并在其周围采用方法论更新。

## 故障排除

### “salary_data.json not found”

如果你还没设置薪资基准，这属于正常现象。`/apply` 工作流会自动跳过这一步。

### 职位搜索 CLI 工具无法工作

确保已安装 Bun，并且在每个 CLI 目录中运行过 `bun install`。这些工具需要网络访问来抓取职位信息。

### LaTeX 编译错误

- CV：使用 `lualatex`（`pdflatex` 在较新的 MiKTeX 中常出现 `fontawesome5` 字体扩展错误；`lualatex` 能处理相同源文件）
- 求职信：使用 `xelatex`（因为 `OpenFonts/fonts/` 中有自定义字体）
- 确保你的 LaTeX 发行版包含 `moderncv` 包

### 求职信中找不到字体

求职信模板需要字体位于 `cover_letters/OpenFonts/fonts/` 下。确保该目录存在，并包含 Lato 和 Raleway 字体文件。

### 旧克隆中残留的 `.claude/settings.local.json`

共享的 Claude Code 权限现在位于 `.claude/settings.json`（范围仅包括 `bun run`、`python salary_lookup.py` 和 `python3 salary_lookup.py`）。较早版本的仓库里曾提交过更宽泛的 `.claude/settings.local.json`，它预先批准了 `Bash(curl:*)`、`Bash(python:*)` 和 `Bash(bun:*)`。如果你在这个变更之前克隆过仓库，旧文件会留在你的工作副本中，并且它的权限会覆盖在 `settings.json` 之上。删除它（或仅保留你自己的个人覆盖）：

```bash
rm .claude/settings.local.json
```
