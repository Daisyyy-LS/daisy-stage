# Daisy's Stage — 梁爽交互作品集

一场三幕剧的复古奇幻剧场风作品集网站。用户是设计师/内容创作者，审美要求极高；任何改动前先读本文件和 `../作品集-上下文交接.md`。

## 运行与构建

```bash
npm install        # 如需国内镜像：--registry=https://registry.npmmirror.com
npm run dev        # Vite 开发服务器
npx vite build     # 产物到 dist/（纯静态，dist/index.html 必须存在）
```

## 发布（已上线，两个地址同步更新）

- Kimi 平台：https://daisy-stage.ok.kimi.link ，Website ID `1a1aa702-a9c2-816c-8000-0000b5485455`
  更新：`npx vite build` → 把 **dist/ 的内容**（根含 index.html，不要包 dist 文件夹本身）打成 zip → `kimix website validate static <zip>` → `kimix website publish <id> static <zip> --wait`；kimix 在 `~/.kimi-work/bin/kimix.exe`；上传限制约 10MB
- GitHub Pages：https://daisyyy-ls.github.io/daisy-stage/ ，仓库 `Daisyyy-LS/daisy-stage`（main=源码，gh-pages=dist 内容）
  注意本机 github.com:443 被网络拦，git push 不通；推送走 REST API 脚本 `../.fftmp/push_gh.py`（用 `gh auth token` 取凭据，gh.exe 在 `C:\Program Files\GitHub CLI\gh.exe`）
- 媒体改动留意体积；ffmpeg 在 `../.fftmp/node_modules/ffmpeg-static/ffmpeg.exe`（npm 需 `--registry=https://registry.npmmirror.com` 并设 `FFMPEG_BINARIES_URL=https://registry.npmmirror.com/-/binary/ffmpeg-static`）

## 架构

- `index.html`：结构（首屏 intro / 剧场 theater / 幕布 curtain-overlay / 弹层 modal）
- `src/data.js`：★ 全部内容数据（小红书 14 篇、抖音 3 视频、央视 7 节目、X 4 推文、GitHub 仓库、联系方式）。改内容只动这里
- `src/main.js`：交互逻辑。关键坐标矩阵：第一幕 `PARCH_POS_1`（8 卷）/ `PARCH_POS_2`（6 卷）/ `FRAME_POS`（3 金框）、第三幕 `ENV_POS`（6 信封）——**数量必须与 data.js 的数据条数一致**，少了会取模回绕导致重叠
- `src/style.css`：设计系统。`.frame` 是 16:9 画框（`container-type: size`），内部元素一律用 cqw/% 定位
- `public/assets/`：art/（2 张卡通场景画）、theater/（小红书+抖音图）、tv/（央视截图）、phone/（X 截图）、video/（概念片 3.9MB）

## 硬约束（踩过的坑，勿复现）

1. `[hidden]` 会被 `display:grid` 覆盖 → CSS 里必须有 `[hidden]{display:none!important}`
2. rAF 在后台标签页停摆 → 关键类名切换用 setTimeout 驱动，不要依赖 rAF
3. 场景用 AI 插画 + HTML 叠加，不要纯 CSS 画场景
4. **舞台安全区**：所有内容元素必须收在 frame 的 x 17–83% / y 15–92% 之内（两侧是幕布、顶部是拱框、底部是观众席剪影）。改坐标后用 getBoundingClientRect 换算成 frame 百分比逐一验证
5. 首屏花体（Great Vibes）升部笔画高，`.ch` 的 clip-path 余量不能小于 `inset(-45% …)`
6. 撕票交互：只有 `.t-stub`（右侧虚线票根）撕落，主票留到幕布合拢
7. 幕布转场全程约 3.8–4.5s，期间 `overlayBusy` 会吞掉点击（正常行为）

## 设计基调

复古奇幻 + 哈利波特式魔法感：暖黑 #17100c / 赭金 #c9a86a / 天鹅绒红 #a01830；金粉漂浮、轻微浮动呼吸感、魔法棒光标；缓动 `cubic-bezier(.19,1,.22,1)`。三幕：Act I 剧评人的图书馆（漂浮羊皮卷）、Act II 央视放映厅（银幕+胶片条）、Act III 猫头鹰邮报（火漆信封+魔法照片），幕间拉金绳转场。
