// Daisy's Stage — 全站内容数据（唯一数据源）
// 桌面端与移动端均从本文件读取，修改内容只需改这里

export const profile = {
  siteName: "Daisy's Stage",
  siteSub: "A Play in Three Acts",
  slogan: "Life's a play. Trying every role.",
  name: "梁爽",
  nameEn: "Daisy Liang",
  email: "liangshuang119209@163.com",
  wechat: "Daisyyy_LS",
  github: "https://github.com/Daisyyy-LS",
  footerLine: "做过记者，写过剧评，现在做 AI 产品。这个页面是我用 Vibe Coding 做的。"
};

// 幕信息与 main.js 的渲染一一对应：el 是舞台容器，pb 是节目单文案
export const acts = [
  { id: 'library', el: '#act-library', numeral: 'I', num: 'Act I', title: "The Critic's Library", zh: '剧评人的图书馆', pb: 'The Library · 剧评与舞', hint: '我写剧评，也跳舞' },
  { id: 'onair', el: '#act-onair', numeral: 'II', num: 'Act II', title: 'Now Showing', zh: '央视放映厅', pb: 'Now Showing · 央视', hint: '我在央视做节目' },
  { id: 'post', el: '#act-post', numeral: 'III', num: 'Act III', title: 'Owl Post', zh: '猫头鹰邮报', pb: 'Owl Post · 掌心', hint: 'Build in public' },
  { id: 'finale', el: '#act-finale', numeral: 'IV', num: 'Curtain Call', title: 'Curtain Call', zh: '谢幕', pb: 'Curtain Call · 谢幕', hint: '演出永不落幕' }
];

// ── 第一幕：小红书笔记（海报墙）────────────────────
export const xhsNotes = [
  { id: 'n14', title: '剧女的一生应该结四次婚（舞剧版）', cat: '剧评', date: '2025-04-05', likes: '139', collects: '32', excerpt: '电流每秒跑三十万公里，但你的谢幕回眸永远比光慢半拍。', url: 'https://xhslink.cn/o/89u7ZZIzME1', featured: true },
  { id: 'n02', title: '「剧女」几百年前原来叫这个名字', cat: '剧评', date: '2025-10-13', likes: '2114', collects: '453', excerpt: '我们明明本来毫无交集，但是在戏剧的宇宙里相遇。', url: 'https://xhslink.cn/o/7Ial9BThxvf' },
  { id: 'n01', title: '剧女至少此刻 仍有一场美梦可做', cat: '剧评', date: '2026-06-22', likes: '1142', collects: '198', excerpt: '演员鞠躬，观众鼓掌，谢谢我们借给彼此的 120 分钟。', url: 'https://xhslink.cn/o/4ZsCZvr8YSX' },
  { id: 'n04', title: '我从没在大女主剧中期待看到这样复杂的角色', cat: '剧评', date: '2025-01-21', likes: '744', collects: '48', excerpt: '她的一生根本不是「恋爱脑」三个字就能简单概括的。——《国色芳华》', url: 'https://xhslink.cn/o/AHpXLDai6Ih' },
  { id: 'n05', title: '不管 what is love 先看剧最重要', cat: '剧评', date: '2025-11-01', likes: '771', collects: '31', excerpt: '今日成功品鉴期待已久的摇滚红与黑。', url: 'https://xhslink.cn/o/7KM1hIQay5a' },
  { id: 'n03', title: '在乌镇，戏剧是呼吸，播客是回响', cat: '剧评', date: '2025-10-30', likes: '76', collects: '13', excerpt: '当乌镇的幕布落下，另一场关于戏剧的对话正在声音里延续。', url: 'https://xhslink.cn/o/54DSXhMI69r' },
  { id: 'n06', title: '好东西最让我感动的是小孩看完了铁梅的报道', cat: '影评', date: '2024-12-28', likes: '4133', collects: '578', excerpt: '正因为我们足够乐观和自信，才能直面悲剧。——《好东西》', url: 'https://xhslink.cn/o/5ivAckAVoYj', featured: true },
  { id: 'n07', title: '看完电影《水饺皇后》的第一反应是', cat: '影评', date: '2025-04-26', likes: '215', collects: '26', excerpt: '被揉捏过、蒸煮过，却始终保有向阳而生的筋道。', url: 'https://xhslink.cn/o/2rykjaZeQFf' },
  { id: 'n09', title: '南方周末是我年少时关于文字的英雄主义', cat: '思考', date: '2024-12-29', likes: '2558', collects: '737', excerpt: '新闻是关于人的新闻，我坚信记者是必要的。', url: 'https://xhslink.cn/o/8ogM8lSSFL8', featured: true },
  { id: 'n08', title: '我想请问拍纪录片到底有什么意义', cat: '思考', date: '2024-10-26', likes: '1261', collects: '444', excerpt: '每个人的人生都对自己拥有完全的意义。', url: 'https://xhslink.cn/o/24Kq2P8UyAc' },
  { id: 'n11', title: '北京环球确诊为中传自习室', cat: '校园', date: '2024-12-11', likes: '4000', collects: '363', excerpt: '在全世界最快乐的地方，做最痛苦的事情。', url: 'https://xhslink.cn/o/4J9RAfKLkEb', featured: true },
  { id: 'n10', title: '这不就是你当初最向往的地方嘛', cat: '校园', date: '2024-07-24', likes: '469', collects: '84', excerpt: '去巴黎和在后方都是在作战，不管是运动员还是媒体。——央视实习手记', url: 'https://xhslink.cn/o/5q1PiQL7D3X' },
  { id: 'n12', title: '你是说我一个剧女自己策划出了戏剧新生活吗', cat: '校园', date: '2025-06-16', likes: '273', collects: '64', excerpt: '一拍脑门写了一个打通剧场到文旅的综艺策划案。', url: 'https://xhslink.cn/o/5XIMJuTxy7I' },
  { id: 'n13', title: '中传作业｜每个人心中都有一个真正的王菲', cat: '校园', date: '2024-11-29', likes: '420', collects: '91', excerpt: '要恍惚地面对世界，笔直地面对自己。', url: 'https://xhslink.cn/o/29RxtuhffZs' }
];

export const xhsStats = { fans: '1000+', likes: '6 万+', url: 'https://xhslink.cn/o/7U0EgDUiywn' };

// ── 第一幕侧翼：抖音灯箱 ──────────────────────────
export const douyin = {
  collection: { name: '走进剧场有梦做', plays: '1871.9 万', episodes: 21, url: 'https://www.douyin.com/user/MS4wLjABAAAA6mOfiVRLonbngn1adypqrWQ7pg1GtGFgihqUMH8JsS1SEQmtUzIklBn3EpWi_HQ7' },
  description: '演员鞠躬，观众鼓掌，谢谢我们借给彼此的 120 分钟。',
  videos: [
    { id: 'douyin-01', ep: '第 1 集', title: '舞剧《海的一半》北京首演谢幕', likes: '37.6 万', url: 'https://v.douyin.com/KT31tE997Ls/' },
    { id: 'douyin-02', ep: '第 2 集', title: '舞剧《垂虹别意·唐寅》· 为君翻作琵琶行', likes: '5.9 万', url: 'https://v.douyin.com/5dszbZMKGM8/' },
    { id: 'douyin-03', ep: '第 4 集', title: '北舞原创舞剧《唱支山歌给党听》排练片段', likes: '1071', url: 'https://v.douyin.com/W6vm6IL5vtA/' }
  ]
};

// ── 第二幕：央视作品（监视器墙）────────────────────
export const cctvWorks = [
  { id: 'cctv-01', title: '《绽放巴黎》巴黎奥运 · 中国男子体操队看点', type: '纪录片', platform: 'CCTV5 / 央视频', date: '2024-07-16', role: '编辑', url: 'https://sports.cctv.com/2024/07/16/VIDEY7ngyWzOp2YsBpPOzGcP240716.shtml' },
  { id: 'cctv-02', title: '《中国荣耀》20240729 期 · 巴黎奥运', type: '赛事杂志', platform: 'CCTV5 · CCTV1 黄金档并机', date: '2024-07-29', role: '编导', url: 'https://sports.cctv.com/2024/07/29/VIDE07Udm1AHT9lHOFFfmDeE240729.shtml', note: '同期收视 TOP3' },
  { id: 'cctv-03', title: '《中国荣耀》20240809 期 · 邹敬园访谈', type: '访谈', platform: 'CCTV5 · CCTV1 黄金档并机', date: '2024-08-09', role: '采访提纲撰写 · 全部剪辑包装', url: 'https://sports.cctv.com/2024/08/09/VIDEvqsUMgiSIHzJnBA9zCeX240809.shtml' },
  { id: 'cctv-04', title: '巴黎奥运报道 · 郑钦文网球女单夺金创造历史', type: '报道', platform: 'CCTV5', date: '2024-08-07', role: '编辑', url: 'https://sports.cctv.com/2024/08/07/VIDEb4gF0truuhKNqKnmzlCJ240807.shtml' },
  { id: 'cctv-05', title: '《好记者讲好故事》2024 记者节特别节目', type: '特别节目', platform: '中央广播电视总台', date: '2024-11-09', role: '策划', url: 'https://tv.cctv.com/2024/11/09/VIDE9L9wUNUMFDp6NsjBiG7e241109.shtml', note: '话题阅读 5 亿+ · 热搜 TOP3' },
  { id: 'cctv-06', title: '《全民开麦》', type: '音乐节目', platform: 'CCTV15 音乐频道', date: '2024-12-05', role: '策划 · 脚本', url: 'https://tv.cctv.com/2024/12/05/VIDE0qWzH1a9QiMVS33bSHeP241205.shtml' },
  { id: 'cctv-07', title: '《诗承古今 雅聚宣南》百年丁香诗会', type: '诗会特别节目', platform: '央视文艺 · 中国音乐电视', date: '2025-04-24', role: '策划', url: 'https://tv.cctv.com/2025/04/24/VIDELo3dY2gXBtGJkD7GqBwB250424.shtml' }
];

// ── 第三幕：X / 手机 ─────────────────────────────
export const xProfile = {
  name: 'Daisy Liang', handle: '@Daisyyy_LS', url: 'https://x.com/Daisyyy_LS',
  bio: 'art→journalism→AI startup GTM@CoAligne · three ways to change how people see the world · working on all three',
  followers: '534', posts: '772'
};

export const coaligne = {
  title: 'What is CoAligne?',
  desc: '面向团队与 AI Agent 的共享工作空间',
  role: 'AI 产品经理 & GTM · 参与官网 Vibe Coding',
  url: 'https://coaligne.com'
};

export const tweets = [
  { id: 'tweet-01', type: '产品发布', date: '2026-08-14', text: 'DeepSeek Harness\'s "everything is a plugin" philosophy is wild — we built dsh-desktop: a cross-platform GUI wrapper, no Node/npm needed.', url: 'https://x.com/Daisyyy_LS/status/2088158021767831604', stats: '' },
  { id: 'tweet-02', type: 'build in public', date: '2026-07-28', text: 'I create a skill that assigns an animal persona to each team member — a weekly weather forecast for the team\'s work progress.', url: 'https://x.com/Daisyyy_LS/status/2082051951882379291', stats: '181 views', github: 'https://github.com/dataelement/coaligne-team-weather-report' },
  { id: 'tweet-03', type: 'demo 视频', date: '2026-07-07', text: 'A bold, quirky, American-cartoon-style launch video I created with AI video generation.', url: 'https://x.com/Daisyyy_LS/status/2074428792266015007', stats: '', video: 'assets/video/concept-film.mp4' },
  { id: 'tweet-04', type: 'build in public', date: '2026-06-09', text: 'day 1 of an experiment: using AI agents to run my own media company — X, RedNote, Douyin.', url: 'https://x.com/Daisyyy_LS/status/2064287812602794162', stats: '769 views · 17 likes' }
];

export const repos = [
  { name: 'world-model-playground', desc: '看片场 · 世界模型评测台：可交互标注原型，评测记录可导出', url: 'https://github.com/Daisyyy-LS/world-model-playground', demo: 'https://daisyyy-ls.github.io/world-model-playground', lang: 'HTML' },
  { name: 'world-model-data-kit', desc: '世界模型训练数据：从场景拆解到评测闭环', url: 'https://github.com/Daisyyy-LS/world-model-data-kit', lang: 'Python' },
  { name: 'podcast-planner', desc: 'Skill: turn guest + theme + format into a ready-to-record podcast planning doc', url: 'https://github.com/Daisyyy-LS/podcast-planner', lang: 'Python' },
  { name: 'coaligne-team-weather-report', desc: '团队天气预报 skill：动物人设 + 周报可视化', url: 'https://github.com/dataelement/coaligne-team-weather-report', lang: 'Python' }
];
