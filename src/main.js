import './style.css';
import { profile, acts, xhsNotes, xhsStats, xhsIntro, douyin, douyinIntro, cctvWorks, xProfile, coaligne, tweets, repos } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const isFine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// 让非 button 元素（羊皮卷/信封/画框等 div）也支持键盘激活
function onActivate(el, handler) {
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.addEventListener('click', handler);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
  });
}

const seen = new Set();
let actIndex = -1; // 当前幕
let sceneTimer = null; // 第一幕场景切换定时器（切幕时需清除）

const ACTS = acts; // 幕信息统一来自 data.js，改幕名只改一处

/* ═══ 魔法棒光标 + 金粉轨迹 ═══════════════ */
if (isFine) {
  const wand = $('#wand');
  const layer = $('#sparkleLayer');
  let lastTrail = 0;
  let px = -100, py = -100;
  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    const angle = Math.max(-30, Math.min(30, dx * 1.2));
    // 发光头位于精灵图 (12,11)，把手绘旋转中心放在头上，尾随鼠标速度轻摆
    wand.style.transform = `translate(${px - 12}px, ${py - 11}px) rotate(${angle * 0.5}deg)`;
    const now = performance.now();
    if (now - lastTrail > 46 && (Math.abs(dx) + Math.abs(dy) > 3)) {
      lastTrail = now;
      const s = document.createElement('span');
      s.className = 'trail';
      s.style.left = `${px + rand(-6, 6)}px`;
      s.style.top = `${py + rand(-6, 6)}px`;
      s.style.width = s.style.height = `${rand(3, 6.5)}px`;
      layer.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }, { passive: true });
}

/* ═══ 字体就绪检测 ═══════════════════════════
   花体字已本地化（@font-face + preload），随站点一起加载，
   不再走 Google Fonts 外网往返。document.fonts.ready 通常在
   首帧前即完成；保留 1.2s 兜底仅为兼容极慢设备，避免首屏空等。 */
function fontsReady() {
  if (!document.fonts || !document.fonts.ready) return Promise.resolve();
  const cap = new Promise((r) => setTimeout(r, 1200));
  const load = Promise.allSettled([
    document.fonts.load("400 1em 'Great Vibes'"),
    document.fonts.load("500 1em 'Caveat'"),
    document.fonts.load("700 1em 'Playfair Display'"),
  ]).then(() => document.fonts.ready);
  return Promise.race([load, cap]);
}

/* ═══ 首屏：手写标题 + 细闪 + 彗星弧 ═══════ */
(function initTitle() {
  const h1 = $('#mainTitle');
  const text = "Daisy's Stage";
  const frag = document.createDocumentFragment();
  for (const c of text) {
    const sp = document.createElement('span');
    if (c === ' ') { sp.className = 'ch space'; sp.innerHTML = '&nbsp;'; }
    else { sp.className = 'ch'; sp.textContent = c; }
    frag.appendChild(sp);
  }
  h1.appendChild(frag);

  const tip = document.createElement('div');
  tip.id = 'quillTip';
  h1.parentElement.appendChild(tip);

  const chars = $$('.ch', h1);
  let i = 0;
  const writeNext = () => {
    if (i >= chars.length) {
      tip.style.opacity = '0';
      // 写字动画结束后清除 clip-path：残留的裁剪框与 background-clip:text 叠加会产生矩形底色块
      chars.forEach((c) => { c.classList.remove('written'); c.classList.add('done'); });
      startSparkles();
      return;
    }
    const ch = chars[i];
    ch.classList.add('written');
    const hr = h1.getBoundingClientRect();
    const cr = ch.getBoundingClientRect();
    const wr = h1.parentElement.getBoundingClientRect();
    tip.style.opacity = '1';
    tip.style.left = `${cr.right - wr.left - 4}px`;
    tip.style.top = `${cr.top - wr.top + cr.height * 0.55}px`;
    i++;
    setTimeout(writeNext, 105);
  };
  // 等字体到位后再启动书写 + 放开副标题/中文/戏票的淡入动画，消除字形跳变
  fontsReady().then(() => {
    $('#intro').classList.add('typo-ready');
    setTimeout(writeNext, 160);
  });

  function startSparkles() {
    const box = $('#titleSparkles');
    for (let k = 0; k < 14; k++) {
      const sp = document.createElement('span');
      sp.className = 'tspark';
      sp.style.left = `${rand(2, 98)}%`;
      sp.style.top = `${rand(0, 100)}%`;
      sp.style.animationDelay = `${rand(0, 2.8)}s`;
      sp.style.animationDuration = `${rand(2.2, 3.6)}s`;
      box.appendChild(sp);
    }
    // 彗星弧：每 6 秒划过一次
    const path = $('#arcPath');
    const comet = $('#arcComet');
    const len = path.getTotalLength();
    const fly = () => {
      const t0 = performance.now();
      const dur = 1600;
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const pt = path.getPointAtLength(p * len);
        comet.setAttribute('cx', pt.x);
        comet.setAttribute('cy', pt.y);
        comet.setAttribute('opacity', p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    setTimeout(function loop() { fly(); setTimeout(loop, 6000); }, 800);
  }
})();

/* ═══ 戏票 → 撕票 → 开幕 ═══════════════════ */
const overlay = $('#curtainOverlay');
let overlayBusy = false;

async function curtainCycle(caption, midway) {
  if (overlayBusy) return;
  overlayBusy = true;
  const curtains = $$('.c-curtain');
  try {
    $('#cAct').textContent = caption[0];
    $('#cTitle').textContent = caption[1];
    $('#cZh').textContent = caption[2] || '';
    overlay.hidden = false;
    overlay.classList.remove('show-caption');
    // 幕布先处于拉开态（无过渡），再瞬时合拢盖住画面
    curtains.forEach((c) => { c.style.transition = 'none'; });
    overlay.classList.add('opening');
    void overlay.offsetWidth; // 强制重排，确保拉开态生效
    curtains.forEach((c) => { c.style.transition = ''; });
    overlay.classList.add('pulling'); // 牵引金绳随幕布落下轻摆
    overlay.classList.remove('opening'); // 合拢
    await sleep(1400);
    overlay.classList.remove('pulling');
    overlay.classList.add('show-caption');
    await sleep(900);
    if (midway) await midway();       // 幕布合着时切换场景，避免露出旧画面
    await sleep(300);
    overlay.classList.remove('show-caption');
    overlay.classList.add('pulling'); // 拉开时金绳再摆一次
    overlay.classList.add('opening'); // 拉开
    await sleep(1400);
    overlay.hidden = true;
    overlay.classList.remove('opening', 'pulling');
  } finally {
    // 任一步抛错也要收起幕布并解锁，否则整页无法再交互
    overlay.hidden = true;
    overlay.classList.remove('opening', 'show-caption', 'pulling');
    overlayBusy = false;
  }
}

$('#ticket').addEventListener('click', async () => {
  const t = $('#ticket');
  if (t.classList.contains('torn')) return;
  t.classList.add('torn');
  await sleep(720); // 等副券撕离动画
  // 幕布合拢盖住画面后，在 midway 里静默切换到剧场并铺好第一幕，再拉开——全程不闪回首屏
  await curtainCycle(
    ['Tonight', "Daisy's Stage", '演出开始'],
    async () => {
      $('#theater').hidden = false;
      $('#intro').classList.add('away');
      switchAct(0);
      await sleep(250);
    }
  );
});

/* ═══ 多层视差 ═══════════════════════════ */
if (isFine) {
  const frame = $('#frame');
  const layers = $$('.layer', frame);
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  (function loop() {
    // 页面不可见或还在首屏时不做无谓的变换计算
    if (!document.hidden && !$('#theater').hidden) {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      for (const l of layers) {
        const d = parseFloat(l.dataset.depth || 1);
        const back = l.classList.contains('l-proscenium') ? 1 : -1;
        const sc = l.classList.contains('l-backdrop') ? 1.06 : l.classList.contains('l-proscenium') ? 1.03 : 1;
        l.style.transform = `translate3d(${cx * d * 14 * back}px, ${cy * d * 8 * back}px, 0) scale(${sc})`;
      }
    }
    requestAnimationFrame(loop);
  })();
}

/* ═══ 金色飘尘 ═══════════════════════════ */
(function dust() {
  const box = $('#dust');
  for (let i = 0; i < 34; i++) {
    const m = document.createElement('span');
    m.className = 'mote';
    m.style.left = `${rand(2, 98)}%`;
    m.style.top = `${rand(0, 100)}%`;
    const s = rand(2.5, 7);
    m.style.width = m.style.height = `${s}px`;
    m.style.animationDuration = `${rand(14, 30)}s`;
    m.style.animationDelay = `${rand(-30, 0)}s`;
    box.appendChild(m);
  }
})();

/* ═══ 节目单 ═══════════════════════════ */
const pbList = $('#pbList');
ACTS.forEach((a, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button><span class="pnum">${a.numeral}.</span><span>${a.pb}</span></button>`;
  li.querySelector('button').addEventListener('click', () => goAct(i));
  pbList.appendChild(li);
});
function syncPlaybill() {
  $$('#pbList li').forEach((li, i) => {
    li.classList.toggle('seen', seen.has(i));
    li.classList.toggle('now', i === actIndex);
  });
}

/* ═══ 幕切换 ═══════════════════════════ */
function switchAct(i) {
  // 离开第一幕时取消尚未落地的场景切换定时器，防止回到剧场后渲染错乱
  if (i !== 0) clearTimeout(sceneTimer);
  ACTS.forEach((a, k) => { $(a.el).hidden = k !== i; });
  actIndex = i;
  const a = ACTS[i];
  $('#asNum').textContent = a.num;
  $('#asTitle').textContent = `${a.title} · ${a.zh}`;
  $('#ropeHint').textContent = i === ACTS.length - 1 ? 'Encore · 回到第一幕' : 'Pull for the next act';
  seen.add(i);
  syncPlaybill();
  if (i === 0) buildLibrary();
  if (i === 1) buildOnair();
  if (i === 2) buildPost();
  if (i === 3) buildFinale();
  updateRope();
}

// 第一幕需看完全部场次才点亮拉绳；其余幕可直接进入下一幕
function updateRope() {
  const rope = $('#rope');
  if (!rope) return;
  const ready = actIndex !== 0 || scenesSeen.size >= SCENES.length;
  rope.classList.toggle('ready', ready);
  rope.classList.toggle('locked', !ready);
  rope.setAttribute('aria-label', ready ? '拉动金绳，进入下一幕' : '请先看完本幕所有场次');
  const hint = $('#ropeHint');
  if (hint) hint.textContent = actIndex === ACTS.length - 1 ? 'Encore · 回到第一幕' : 'Pull for the next act';
}

async function goAct(i) {
  if (overlayBusy || i === actIndex) return;
  const a = ACTS[i];
  await curtainCycle([a.num, a.title, a.zh], () => switchAct(i));
}

$('#rope').addEventListener('click', async () => {
  if (overlayBusy || actIndex < 0) return;
  const rope = $('#rope');
  if (!rope.classList.contains('ready')) {
    // 未看完本幕：绳子轻晃一下并提示，不切幕
    rope.classList.remove('nudge');
    void rope.offsetWidth;
    rope.classList.add('nudge');
    return;
  }
  // 先拉绳：下拉 → 回弹，再幕布合拢换幕
  rope.classList.remove('pulling');
  void rope.offsetWidth;
  rope.classList.add('pulling');
  await sleep(560);
  rope.classList.remove('pulling');
  goAct((actIndex + 1) % ACTS.length);
});

/* ═══ 第一幕 · 剧评人的图书馆 ═══════════════ */
const SCENES = [
  { key: 'reviews', label: '剧评与影评', en: 'Scene 1 · Reviews', cats: ['剧评', '影评'], screen: 'xhs' },
  { key: 'journal', label: '新闻与校园', en: 'Scene 2 · Journalism', cats: ['思考', '校园'], screen: 'xhs' },
  { key: 'dance', label: '侧台之舞', en: 'Scene 3 · Dance', cats: [], screen: 'douyin' }
];
let sceneIndex = 0;
const scenesSeen = new Set([0]); // 第一幕已浏览的场次，全部看完才解锁下一幕拉绳

const PARCH_POS_1 = [
  { l: 30.5, t: 24, r: -3 }, { l: 41, t: 23, r: 2 }, { l: 51.5, t: 25, r: -1.5 }, { l: 62, t: 23, r: 3 },
  { l: 32, t: 51, r: 2.5 }, { l: 43.5, t: 53, r: -2 }, { l: 55, t: 51, r: 1.5 }, { l: 66.5, t: 53, r: -2.5 }
];
const PARCH_POS_2 = [
  { l: 32, t: 24, r: 2.5 }, { l: 44.5, t: 23, r: -2 }, { l: 57, t: 25, r: 3 },
  { l: 34, t: 51, r: -2.5 }, { l: 46, t: 53, r: 1.5 }, { l: 58, t: 51, r: -1.5 }
];
const FRAME_POS = [
  { l: 29, t: 26, r: -2 }, { l: 44.5, t: 28, r: 1.5 }, { l: 60, t: 26, r: 2 }
];

// 取第 k 个坐标：预设不够时在舞台安全区内按网格补位，避免取模回绕导致卡片重叠。
// 补位意味着 data.js 的数据条数超出了预设坐标，建议同步扩充对应坐标数组。
function posAt(positions, k, label) {
  if (k < positions.length) return positions[k];
  if (k === positions.length) {
    console.warn(`[daisy-stage] ${label} 的数据多于预设坐标，已自动补位。请扩充坐标数组以保持排版。`);
  }
  const extra = k - positions.length;
  const col = extra % 4, row = Math.floor(extra / 4);
  return { l: 30 + col * 12, t: 26 + row * 22, r: (k % 2 ? 1 : -1) * 2 };
}

function subtitleCols(scene) {
  if (scene.screen === 'douyin') {
    // 抖音也用竖版镜框手记面板，与小红书一致（头像待用户提供后替换）
    return {
      kind: 'profile',
      intro: douyinIntro,
      platform: 'douyin',
      link: { text: '抖音主页 →', url: douyin.collection.url }
    };
  }
  // 竖版「剧评人手记」：复古相框头像 + 文艺简介，替代原先杂乱的三列堆字
  return {
    kind: 'profile',
    intro: xhsIntro,
    platform: 'xhs',
    link: { text: '小红书主页 →', url: xhsStats.url }
  };
}

function buildLibrary() {
  const root = $('#act-library');
  root.innerHTML = `
    <div class="subtitle-screen" id="subScreen"></div>
    <div class="parch-zone" id="parchZone"></div>
    <div class="scene-switch">
      <button id="ssPrev" aria-label="上一场">◀</button>
      <span class="ss-label" id="ssLabel"></span>
      <button id="ssNext" aria-label="下一场">▶</button>
    </div>`;
  $('#ssPrev').addEventListener('click', () => switchScene(-1));
  $('#ssNext').addEventListener('click', () => switchScene(1));
  renderScene(0, true);
}

function switchScene(dir) {
  // 立即累加目标（连续点击可正确跳多场），并清掉上一次未落地的定时器，避免竞态
  const target = (sceneIndex + dir + SCENES.length) % SCENES.length;
  sceneIndex = target;
  scenesSeen.add(target);
  updateRope();
  const zone = $('#parchZone');
  $$('.parchment, .goldframe', zone).forEach((el) => el.classList.add('flyout'));
  clearTimeout(sceneTimer);
  sceneTimer = setTimeout(() => renderScene(target), 420);
}

function renderScene(i, first) {
  sceneIndex = i;
  const scene = SCENES[i];
  const zone = $('#parchZone');
  $('#ssLabel').innerHTML = `<i>${scene.en}</i>${scene.label}`;
  // 字幕屏
  const sc = subtitleCols(scene);
  const sub = $('#subScreen');
  if (sc.kind === 'profile') {
    const it = sc.intro;
    const isDy = sc.platform === 'douyin';
    // 用户头像待提供：拿到后把下面 <svg> 换成 <img src="assets/...头像.jpg"> 即可
    const glyph = isDy
      ? `<path d="M58 26 v34 a11 11 0 1 1 -7 -10 v-19 l-16 4 v26 a11 11 0 1 1 -7 -10 v-33 z" fill="url(#spGold)" />`
      : `<text x="50" y="57" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="40" fill="url(#spGold)">D</text>`;
    sub.classList.add('is-profile');
    sub.innerHTML = `
      <div class="sp-frame">
        <div class="sp-photo">
          <svg viewBox="0 0 100 100" aria-label="${it.name} 头像">
            <defs>
              <radialGradient id="spBg" cx="38%" cy="30%" r="80%">
                <stop offset="0" stop-color="#4a3320" />
                <stop offset="1" stop-color="#1a1008" />
              </radialGradient>
              <linearGradient id="spGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#f7e6b4" />
                <stop offset="1" stop-color="#b8913f" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#spBg)" />
            <circle cx="50" cy="39" r="19" fill="none" stroke="url(#spGold)" stroke-width="1.2" opacity=".7" />
            ${glyph}
            <text x="50" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="9" letter-spacing="2" fill="#c9a86a">DAISYYY</text>
            <path d="M30 88 Q50 96 70 88" fill="none" stroke="url(#spGold)" stroke-width=".8" opacity=".6" />
          </svg>
        </div>
      </div>
      <div class="sp-handle">${it.handle}</div>
      <div class="sp-rule"></div>
      <div class="sp-verses">${it.lines.map((l) => `<span>${l}</span>`).join('')}</div>
      <div class="sp-topics">${it.topics}</div>`;
  } else {
    sub.classList.remove('is-profile');
    sub.innerHTML =
      sc.cols.map((t, k) => `<span class="sub-col ${['a', 'b', 'c'][k]}">${t}</span>`).join('');
  }
  sub.insertAdjacentHTML('beforeend', `<a class="sub-link" href="${sc.link.url}" target="_blank" rel="noopener">${sc.link.text}</a>`);
  // 内容
  zone.innerHTML = '';
  if (scene.key === 'dance') {
    douyin.videos.forEach((v, k) => {
      const p = posAt(FRAME_POS, k, '抖音视频');
      const el = document.createElement('div');
      el.className = 'goldframe';
      el.style.left = p.l + '%'; el.style.top = p.t + '%';
      el.style.transform = `rotate(${p.r}deg)`;
      el.style.animationDelay = `${-k * 2.4}s`;
      el.innerHTML = `<div class="gf-inner"><img src="assets/theater/${v.id}.jpg" alt="${v.title}" loading="lazy" /></div><div class="gf-plate">${v.ep} · ♥ ${v.likes}</div>`;
      onActivate(el, () => openModal(`
        <span class="mc-no"><span>Side Stage · 侧台之舞</span><span>抖音 · ${v.ep}</span></span>
        <h3 class="mc-title">${v.title}</h3>
        <p class="mc-excerpt">合集「${douyin.collection.name}」· ${douyin.collection.episodes} 集 · ${douyin.collection.plays} 播放\n「${douyin.description}」</p>
        <div class="mc-meta"><span>♥ ${v.likes}</span></div>
        <a class="mc-link" href="${v.url}" target="_blank" rel="noopener"><span>去抖音看 ↗</span></a>`));
      zone.appendChild(el);
    });
    // 合集引言羊皮条：完整文案 + 可点击弹层（原先被 .78cqw 挤到截断且无法点开）
    const q = document.createElement('div');
    q.className = 'parchment quote-card';
    q.style.left = '38%'; q.style.top = '64%'; q.style.width = '19cqw';
    q.style.transform = 'rotate(-1.5deg)';
    q.innerHTML = `<span class="p-seal">D</span><span class="p-quote">${douyin.description}</span><span class="p-quote-cta">展开题跋 ↗</span>`;
    onActivate(q, () => openModal(`
      <span class="mc-no"><span>Programme Note · 题跋</span><span>走进剧场有梦做</span></span>
      <h3 class="mc-title" style="font-size:1.15rem">${douyin.description}</h3>
      <p class="mc-excerpt">这句话也是我小红书剧评的题跋。演员鞠躬，观众鼓掌——剧场把 120 分钟借给我们，我们把其中的震动写进文字、拍进镜头，再交还给它。愿每一次谢幕，都值得被记住。</p>
      <a class="mc-link" href="${douyin.collection.url}" target="_blank" rel="noopener"><span>去抖音看完整合集 ↗</span></a>`));
    zone.appendChild(q);
  } else {
    const notes = xhsNotes.filter((n) => scene.cats.includes(n.cat));
    const positions = scene.key === 'reviews' ? PARCH_POS_1 : PARCH_POS_2;
    notes.forEach((n, k) => {
      const p = posAt(positions, k, '小红书笔记');
      const el = document.createElement('div');
      el.className = 'parchment' + (first ? ' flyin' : '');
      el.style.left = p.l + '%'; el.style.top = p.t + '%';
      el.style.transform = `rotate(${p.r}deg)`;
      el.style.animationDelay = `${-k * 1.7}s`;
      el.innerHTML = `
        <span class="p-seal">D</span>
        <img src="assets/theater/${n.id}.jpg" alt="${n.title}" loading="lazy" />
        <span class="p-title">${n.title}</span>`;
      el.addEventListener('mouseenter', () => { zone.classList.add('spot'); el.classList.add('lit'); });
      el.addEventListener('mouseleave', () => { zone.classList.remove('spot'); el.classList.remove('lit'); });
      onActivate(el, () => openModal(`
        <span class="mc-no"><span>Programme No.${String(xhsNotes.indexOf(n) + 1).padStart(3, '0')}</span><span>${n.cat}</span></span>
        <h3 class="mc-title">${n.title}</h3>
        <p class="mc-excerpt">${n.excerpt}</p>
        <div class="mc-meta"><span>♥ ${n.likes}</span><span>★ ${n.collects}</span><span>${n.date}</span></div>
        <a class="mc-link" href="${n.url}" target="_blank" rel="noopener"><span>阅读原文 ↗</span></a>`));
      zone.appendChild(el);
    });
  }
}

/* ═══ 第二幕 · 央视放映厅 ═══════════════════ */
function buildOnair() {
  const root = $('#act-onair');
  root.innerHTML = `
    <div class="proj-beam"></div>
    <div class="silver-screen"><img id="ssImg" src="assets/tv/${cctvWorks[0].id}.jpg" alt="" /></div>
    <div class="clapper" id="clapper"></div>
    <div class="filmstrip" id="filmstrip"></div>`;
  const strip = $('#filmstrip');
  cctvWorks.forEach((w, i) => {
    const f = document.createElement('div');
    f.className = 'fframe' + (i === 0 ? ' now' : '');
    f.innerHTML = `<img src="assets/tv/${w.id}.jpg" alt="${w.title}" loading="lazy" /><span class="f-no">S${i + 1}</span>`;
    onActivate(f, () => selectWork(i));
    strip.appendChild(f);
  });
  renderClapper(0);

  function selectWork(i) {
    $$('.fframe', strip).forEach((f, k) => f.classList.toggle('now', k === i));
    const img = $('#ssImg');
    const w = cctvWorks[i];
    const fresh = img.cloneNode();
    fresh.src = `assets/tv/${w.id}.jpg`;
    img.replaceWith(fresh);
    renderClapper(i);
  }
  function renderClapper(i) {
    const w = cctvWorks[i];
    $('#clapper').innerHTML = `
      <div class="cl-top"></div>
      <div class="cl-body">
        <span class="cl-role">我的角色 · ${w.role}</span>
        <div class="cl-title">S${i + 1} · ${w.title}</div>
        <div class="cl-meta">${w.type} · ${w.platform}<br>${w.date}</div>
        ${w.note ? `<div class="cl-note">▸ ${w.note}</div>` : ''}
        <a class="cl-link" href="${w.url}" target="_blank" rel="noopener">Watch ↗</a>
      </div>`;
  }
}

/* ═══ 第三幕 · 猫头鹰邮报 ═══════════════════ */
const ENV_POS = [
  { l: 19, t: 20, r: -3 }, { l: 66, t: 20, r: 2.5 }, { l: 18.5, t: 46, r: 2 }, { l: 66.5, t: 46, r: -2.5 }
];

function buildPost() {
  const root = $('#act-post');
  root.innerHTML = `
    <div class="profile-card" id="profileCard">
      <div class="pc-inner"><img src="assets/phone/profile.png" alt="X profile @Daisyyy_LS" /></div>
      <div class="pc-caption">The Witch's File · @Daisyyy_LS</div>
    </div>
    <div class="magic-photo" id="magicPhoto" style="left:41%;top:66%;transform:rotate(-1.5deg)">
      <div class="mp-inner">
        <video src="assets/video/concept-film.mp4" autoplay muted loop playsinline></video>
        <span class="mp-tag">会动的照片 · AI 概念片</span>
      </div>
    </div>`;

  onActivate($('#profileCard'), () => openModal(`
    <span class="mc-no"><span>The Witch's File</span><span>X · 主页</span></span>
    <h3 class="mc-title">${xProfile.name} · ${xProfile.handle}</h3>
    <p class="mc-excerpt">${xProfile.bio}</p>
    <div class="mc-meta"><span>${xProfile.followers} followers</span><span>${xProfile.posts} posts</span></div>
    <a class="mc-link" href="${xProfile.url}" target="_blank" rel="noopener"><span>View on X ↗</span></a>`));

  onActivate($('#magicPhoto'), () => openModal(`
    <span class="mc-no"><span>Moving Photograph</span><span>AI 视频</span></span>
    <video src="assets/video/concept-film.mp4" controls autoplay playsinline></video>
    <h3 class="mc-title">风格化 AI 产品概念片</h3>
    <p class="mc-excerpt">美式卡通风格的产品发布概念片，从分镜到成片全部由 AI 视频生成完成。</p>
    <a class="mc-link" href="${tweets[2].url}" target="_blank" rel="noopener"><span>View on X ↗</span></a>`));

  // 4 条推文 → 信封
  tweets.forEach((t, k) => {
    const p = posAt(ENV_POS, k, '推文信封');
    const el = document.createElement('div');
    el.className = 'env';
    el.style.left = p.l + '%'; el.style.top = p.t + '%';
    el.style.transform = `rotate(${p.r}deg)`;
    el.style.animationDelay = `${-k * 2.1}s`;
    el.innerHTML = `<span class="e-seal">D</span><div class="e-type">${t.type}</div><div class="e-text">${t.text}</div>`;
    onActivate(el, () => openModal(`
      <span class="mc-no"><span>Owl Post · 猫头鹰邮报</span><span>${t.date}</span></span>
      <h3 class="mc-title" style="font-size:1.05rem">${t.text}</h3>
      ${t.video ? '' : `<img src="assets/phone/${t.id}.png" alt="" style="width:100%;border-radius:4px;margin-bottom:1rem" />`}
      ${t.stats ? `<div class="mc-meta"><span>${t.stats}</span></div>` : ''}
      ${t.github ? `<a class="mc-link" href="${t.github}" target="_blank" rel="noopener" style="background:#2c2416"><span>GitHub 仓库 ↗</span></a>` : ''}
      <a class="mc-link" href="${t.url}" target="_blank" rel="noopener"><span>View on X ↗</span></a>`));
    root.appendChild(el);
  });

  // CoAligne 特别信
  const co = document.createElement('div');
  co.className = 'env special';
  co.style.left = '21%'; co.style.top = '66%'; co.style.transform = 'rotate(-1.5deg)';
  co.style.animationDelay = '-3.2s';
  co.innerHTML = `<span class="e-seal" style="background:radial-gradient(circle at 35% 30%, #4a7fbf, #173356)">C</span><div class="e-type">📌 Pinned · Product</div><div class="e-text">${coaligne.title} — ${coaligne.desc}</div>`;
  onActivate(co, () => openModal(`
    <span class="mc-no"><span>Pinned · Product</span><span>coaligne.com</span></span>
    <h3 class="mc-title">${coaligne.title}</h3>
    <p class="mc-excerpt">${coaligne.desc}。在这里，团队成员和 AI Agent 共享同一份项目上下文。</p>
    <div class="mc-meta"><span>我的角色：${coaligne.role}</span></div>
    <a class="mc-link" href="${coaligne.url}" target="_blank" rel="noopener"><span>coaligne.com ↗</span></a>`));
  root.appendChild(co);

  // GitHub 卷轴信
  const rp = document.createElement('div');
  rp.className = 'env special';
  rp.style.left = '64%'; rp.style.top = '66%'; rp.style.transform = 'rotate(2deg)';
  rp.style.animationDelay = '-5s';
  rp.innerHTML = `<span class="e-seal" style="background:radial-gradient(circle at 35% 30%, #4a7fbf, #173356)">G</span><div class="e-type">📌 AI 实践 · GitHub</div><div class="e-text">${repos.map((r) => r.name).join(' · ')}</div>`;
  onActivate(rp, () => openModal(`
    <span class="mc-no"><span>Pinned · AI 实践</span><span>GitHub</span></span>
    <h3 class="mc-title">一些小的 AI 实践</h3>
    ${repos.map((r) => `
      <p class="mc-excerpt" style="margin-bottom:.6rem"><b>${r.name}</b>（${r.lang}）<br>${r.desc}${r.demo ? `<br><a href="${r.demo}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}</p>`).join('')}
    ${repos.map((r) => `<a class="mc-link" href="${r.url}" target="_blank" rel="noopener"><span>${r.name} ↗</span></a>`).join('')}`));
  root.appendChild(rp);
}

/* ═══ 谢幕 ═══════════════════════════════ */
function buildFinale() {
  const root = $('#act-finale');
  root.innerHTML = `
    <div class="finale-card">
      <h2>Curtain Call</h2>
      <p class="f-sub">谢谢观看 · 演出永不落幕</p>
      <p class="f-contact">
        ${profile.name} ${profile.nameEn}<br>
        <a href="mailto:${profile.email}">${profile.email}</a><br>
        WeChat ${profile.wechat} · <a href="${profile.github}" target="_blank" rel="noopener">GitHub</a> · <a href="${xProfile.url}" target="_blank" rel="noopener">X</a> · <a href="${xhsStats.url}" target="_blank" rel="noopener">小红书</a>
      </p>
      <p class="f-line">${profile.footerLine}</p>
    </div>`;
}

/* ═══ 弹层 ═══════════════════════════════ */
let lastFocused = null; // 打开弹层前的焦点，关闭后归还
function openModal(inner) {
  const modal = $('#modal');
  lastFocused = document.activeElement;
  $('#modalCard').innerHTML = `<button class="mc-close" aria-label="关闭">×</button>` + inner;
  modal.hidden = false;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  $('.mc-close', $('#modalCard')).focus();
}
function closeModal() {
  const modal = $('#modal');
  modal.hidden = true;
  $$('#modalCard video').forEach((v) => v.pause());
  if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-modal-close]') || e.target.closest('.mc-close')) closeModal();
});
document.addEventListener('keydown', (e) => {
  const modal = $('#modal');
  if (modal.hidden) return;
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key === 'Tab') {
    // 焦点陷阱：Tab / Shift+Tab 在弹层内循环，避免焦点跑到被遮住的舞台元素上
    const f = $$('a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])', $('#modalCard'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ═══ 移动端竖屏版 ═══════════════════════ */
(function buildMobile() {
  const root = $('#mobile');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const noteCard = (n) => `
    <a class="mb-card mb-note" href="${n.url}" target="_blank" rel="noopener">
      <img src="assets/theater/${n.id}.jpg" alt="${esc(n.title)}" loading="lazy" />
      <div class="mb-body">
        <span class="mb-cat">${esc(n.cat)} · ♥ ${esc(n.likes)}</span>
        <h4>${esc(n.title)}</h4>
        <p>${esc(n.excerpt)}</p>
      </div>
    </a>`;

  const dyCard = (v) => `
    <a class="mb-card mb-dy" href="${v.url}" target="_blank" rel="noopener">
      <img src="assets/theater/${v.id}.jpg" alt="${esc(v.title)}" loading="lazy" />
      <div class="mb-body">
        <span class="mb-cat">${esc(v.ep)} · ♥ ${esc(v.likes)}</span>
        <h4>${esc(v.title)}</h4>
      </div>
    </a>`;

  const cctvCard = (w) => `
    <a class="mb-card mb-tv" href="${w.url}" target="_blank" rel="noopener">
      <img src="assets/tv/${w.id}.jpg" alt="${esc(w.title)}" loading="lazy" />
      <div class="mb-body">
        <span class="mb-cat">${esc(w.type)} · ${esc(w.platform)} · ${esc(w.date)}</span>
        <h4>${esc(w.title)}</h4>
        <p class="mb-role">我的角色：${esc(w.role)}${w.note ? ` · ${esc(w.note)}` : ''}</p>
      </div>
    </a>`;

  const tweetCard = (t) => `
    <div class="mb-card mb-tweet">
      <span class="mb-cat">${esc(t.type)} · ${esc(t.date)}${t.stats ? ` · ${esc(t.stats)}` : ''}</span>
      <p>${esc(t.text)}</p>
      ${t.video
        ? `<video src="${t.video}" controls playsinline preload="metadata"></video>`
        : `<img src="assets/phone/${t.id}.png" alt="" loading="lazy" />`}
      <div class="mb-links">
        <a href="${t.url}" target="_blank" rel="noopener">在 X 上查看 →</a>
        ${t.github ? `<a href="${t.github}" target="_blank" rel="noopener">GitHub →</a>` : ''}
      </div>
    </div>`;

  root.innerHTML = `
    <header class="mb-hero">
      <p class="mb-over">Tonight · 今夜上演</p>
      <h1 class="mb-title">Daisy's Stage</h1>
      <p class="mb-slogan">${esc(profile.slogan)}</p>
      <p class="mb-name">${esc(profile.name)} · ${esc(profile.nameEn)}</p>
      <nav class="mb-nav" aria-label="作品目录"><a href="#mb-library">剧评与短视频</a><a href="#mb-screening">央视放映厅</a><a href="#mb-owl">AI 与海外内容</a></nav>
    </header>

    <section class="mb-act" id="mb-library">
      <div class="mb-acthead"><span>Act I</span><h2>The Critic's Library<em>剧评人的图书馆</em></h2></div>
      <div class="mb-xhs-intro">
        <div class="mb-xhs-badge">D</div>
        <div>
          <h4>${esc(xhsIntro.handle)}</h4>
          <p class="mb-xhs-role">${esc(xhsIntro.role)}</p>
          <p>${xhsIntro.lines.map(esc).join(' · ')}</p>
          <span class="mb-cat">${esc(xhsIntro.topics)} · ${esc(xhsIntro.foot)}</span>
        </div>
      </div>
      <a class="mb-strip" href="${xhsStats.url}" target="_blank" rel="noopener">
        小红书 · 粉丝 ${esc(xhsStats.fans)} · 获赞 ${esc(xhsStats.likes)} —— 访问主页 →
      </a>
      <div class="mb-scroll">${xhsNotes.map(noteCard).join('')}</div>
      <a class="mb-strip" href="${douyin.collection.url}" target="_blank" rel="noopener">
        抖音 ·「${esc(douyin.collection.name)}」${douyin.collection.episodes} 集 · ${esc(douyin.collection.plays)} 播放 —— 访问主页 →
      </a>
      <div class="mb-scroll">${douyin.videos.map(dyCard).join('')}</div>
    </section>

    <section class="mb-act" id="mb-screening">
      <div class="mb-acthead"><span>Act II</span><h2>Now Showing<em>央视放映厅</em></h2></div>
      ${cctvWorks.map(cctvCard).join('')}
    </section>

    <section class="mb-act" id="mb-owl">
      <div class="mb-acthead"><span>Act III</span><h2>Owl Post<em>猫头鹰邮报</em></h2></div>
      <a class="mb-card mb-profile" href="${xProfile.url}" target="_blank" rel="noopener">
        <img src="assets/phone/profile.png" alt="X profile" loading="lazy" />
        <div class="mb-body">
          <h4>${esc(xProfile.name)} <small>${esc(xProfile.handle)}</small></h4>
          <p>${esc(xProfile.bio)}</p>
          <span class="mb-cat">${esc(xProfile.followers)} followers · ${esc(xProfile.posts)} posts —— 访问主页 →</span>
        </div>
      </a>
      ${tweets.map(tweetCard).join('')}
      <a class="mb-card mb-coaligne" href="${coaligne.url}" target="_blank" rel="noopener">
        <span class="mb-cat">${esc(coaligne.role)}</span>
        <h4>${esc(coaligne.title)}</h4>
        <p>${esc(coaligne.desc)}</p>
      </a>
      <div class="mb-repos">
        ${repos.map((r) => `<a href="${r.url}" target="_blank" rel="noopener"><strong>${esc(r.name)}</strong><span>${esc(r.desc)}</span></a>`).join('')}
      </div>
    </section>

    <footer class="mb-finale">
      <h2>Curtain Call<em>谢幕</em></h2>
      <p>Email · ${esc(profile.email)}</p>
      <p>WeChat · ${esc(profile.wechat)}</p>
      <p><a href="${profile.github}" target="_blank" rel="noopener">GitHub · Daisyyy-LS →</a></p>
      <p class="mb-foot">${esc(profile.footerLine)}</p>
      <p class="mb-foot">桌面端可体验互动剧场交互版。</p>
    </footer>`;
})();
