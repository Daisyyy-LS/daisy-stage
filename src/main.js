import './style.css';
import { profile, xhsNotes, xhsStats, douyin, cctvWorks, xProfile, coaligne, tweets, repos } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const isFine = matchMedia('(hover: hover) and (pointer: fine)').matches;

const seen = new Set();
let actIndex = -1; // 当前幕

const ACTS = [
  { el: '#act-library', num: 'Act I', title: "The Critic's Library", zh: '剧评人的图书馆', pb: 'The Library · 剧评与舞' },
  { el: '#act-onair', num: 'Act II', title: 'Now Showing', zh: '央视放映厅', pb: 'Now Showing · 央视' },
  { el: '#act-post', num: 'Act III', title: 'Owl Post', zh: '猫头鹰邮报', pb: 'Owl Post · 掌心' },
  { el: '#act-finale', num: 'Curtain Call', title: 'Curtain Call', zh: '谢幕', pb: 'Curtain Call · 谢幕' }
];

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
    wand.style.transform = `translate(${px - 6}px, ${py - 30}px) rotate(${-8 + angle * 0.4}deg)`;
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
  setTimeout(writeNext, 700);

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

function curtainSet(state) {
  // state: 'closed'（合拢覆盖）| 'opening'（向两边拉开）
  overlay.classList.toggle('opening', state === 'opening');
}

async function curtainCycle(caption, midway) {
  if (overlayBusy) return;
  overlayBusy = true;
  // 1. 幕布合拢（瞬间覆盖 → 滑入）
  $('#cAct').textContent = caption[0];
  $('#cTitle').textContent = caption[1];
  $('#cZh').textContent = caption[2] || '';
  overlay.hidden = false;
  overlay.classList.remove('opening', 'show-caption');
  const halves = $$('.c-half');
  halves.forEach((h) => { h.style.transition = 'none'; h.style.transform = ''; });
  overlay.classList.add('opening'); // 先处于拉开状态（屏幕外）
  await sleep(30);
  halves.forEach((h) => { h.style.transition = ''; h.style.transform = ''; });
  overlay.classList.remove('opening'); // 滑回合拢
  await sleep(1150);
  overlay.classList.add('show-caption');
  await sleep(1000);
  midway && midway();
  await sleep(350);
  // 2. 拉开
  overlay.classList.remove('show-caption');
  overlay.classList.add('opening');
  await sleep(1250);
  overlay.hidden = true;
  overlay.classList.remove('opening');
  overlayBusy = false;
}

$('#ticket').addEventListener('click', async () => {
  const t = $('#ticket');
  if (t.classList.contains('torn')) return;
  t.classList.add('torn');
  await sleep(650);
  const theater = $('#theater');
  theater.hidden = false;
  switchAct(0, true); // 直接铺好第一幕
  await curtainCycle(['Tonight', "Daisy's Stage", '演出开始'], null);
  $('#intro').classList.add('away');
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
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;
    for (const l of layers) {
      const d = parseFloat(l.dataset.depth || 1);
      const back = l.classList.contains('l-proscenium') ? 1 : -1;
      const sc = l.classList.contains('l-backdrop') ? 1.06 : l.classList.contains('l-proscenium') ? 1.03 : 1;
      l.style.transform = `translate3d(${cx * d * 14 * back}px, ${cy * d * 8 * back}px, 0) scale(${sc})`;
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
  li.innerHTML = `<button><span class="pnum">${['I', 'II', 'III', 'IV'][i]}.</span><span>${a.pb}</span><span class="stamp">已检</span></button>`;
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
function switchAct(i, instant) {
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
}

async function goAct(i) {
  if (overlayBusy || i === actIndex) return;
  const a = ACTS[i];
  await curtainCycle([a.num, a.title, a.zh], () => switchAct(i));
}

$('#rope').addEventListener('click', () => {
  if (overlayBusy || actIndex < 0) return;
  $('#rope').classList.remove('pulling');
  void $('#rope').offsetWidth;
  $('#rope').classList.add('pulling');
  goAct((actIndex + 1) % ACTS.length);
});

/* ═══ 第一幕 · 剧评人的图书馆 ═══════════════ */
const SCENES = [
  { key: 'reviews', label: '剧评与影评', en: 'Scene 1 · Reviews', cats: ['剧评', '影评'], screen: 'xhs' },
  { key: 'journal', label: '新闻与校园', en: 'Scene 2 · Journalism', cats: ['思考', '校园'], screen: 'xhs' },
  { key: 'dance', label: '侧台之舞', en: 'Scene 3 · Dance', cats: [], screen: 'douyin' }
];
let sceneIndex = 0;

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

function subtitleCols(scene) {
  if (scene.screen === 'douyin') {
    return {
      cols: ['抖音 · 走进剧场有梦做', `合集 ${douyin.collection.episodes} 集 · ${douyin.collection.plays} 播放`, '演员鞠躬 观众鼓掌'],
      link: { text: '抖音主页 →', url: douyin.collection.url }
    };
  }
  return {
    cols: ['小红书 · 剧评与光影', `粉丝 ${xhsStats.fans} · 获赞 ${xhsStats.likes}`, '戏剧 电影 新闻理想'],
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
  const zone = $('#parchZone');
  $$('.parchment, .goldframe', zone).forEach((el) => el.classList.add('flyout'));
  setTimeout(() => renderScene((sceneIndex + dir + SCENES.length) % SCENES.length), 420);
}

function renderScene(i, first) {
  sceneIndex = i;
  const scene = SCENES[i];
  const zone = $('#parchZone');
  $('#ssLabel').innerHTML = `<i>${scene.en}</i>${scene.label}`;
  // 字幕屏
  const sc = subtitleCols(scene);
  $('#subScreen').innerHTML =
    sc.cols.map((t, k) => `<span class="sub-col ${['a', 'b', 'c'][k]}">${t}</span>`).join('') +
    `<a class="sub-link" href="${sc.link.url}" target="_blank" rel="noopener">${sc.link.text}</a>`;
  // 内容
  zone.innerHTML = '';
  if (scene.key === 'dance') {
    douyin.videos.forEach((v, k) => {
      const p = FRAME_POS[k];
      const el = document.createElement('div');
      el.className = 'goldframe';
      el.style.left = p.l + '%'; el.style.top = p.t + '%';
      el.style.transform = `rotate(${p.r}deg)`;
      el.style.animationDelay = `${-k * 2.4}s`;
      el.innerHTML = `<div class="gf-inner"><img src="assets/theater/${v.id}.jpg" alt="${v.title}" loading="lazy" /></div><div class="gf-plate">${v.ep} · ♥ ${v.likes}</div>`;
      el.addEventListener('click', () => openModal(`
        <span class="mc-no"><span>Side Stage · 侧台之舞</span><span>抖音 · ${v.ep}</span></span>
        <h3 class="mc-title">${v.title}</h3>
        <p class="mc-excerpt">合集「${douyin.collection.name}」· ${douyin.collection.episodes} 集 · ${douyin.collection.plays} 播放\n「${douyin.description}」</p>
        <div class="mc-meta"><span>♥ ${v.likes}</span></div>
        <a class="mc-link" href="${v.url}" target="_blank" rel="noopener"><span>去抖音看 ↗</span></a>`));
      zone.appendChild(el);
    });
    // 合集引言羊皮条
    const q = document.createElement('div');
    q.className = 'parchment';
    q.style.left = '42%'; q.style.top = '66%'; q.style.width = '13cqw';
    q.style.transform = 'rotate(-1.5deg)';
    q.innerHTML = `<span class="p-title" style="font-size:.78cqw;padding:.4cqw .3cqw">「${douyin.description}」—— 这句话也是我小红书剧评的题跋</span>`;
    zone.appendChild(q);
  } else {
    const notes = xhsNotes.filter((n) => scene.cats.includes(n.cat));
    const positions = scene.key === 'reviews' ? PARCH_POS_1 : PARCH_POS_2;
    notes.forEach((n, k) => {
      const p = positions[k % positions.length];
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
      el.addEventListener('click', () => openModal(`
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
    f.addEventListener('click', () => selectWork(i));
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

  $('#profileCard').addEventListener('click', () => openModal(`
    <span class="mc-no"><span>The Witch's File</span><span>X · 主页</span></span>
    <h3 class="mc-title">${xProfile.name} · ${xProfile.handle}</h3>
    <p class="mc-excerpt">${xProfile.bio}</p>
    <div class="mc-meta"><span>${xProfile.followers} followers</span><span>${xProfile.posts} posts</span></div>
    <a class="mc-link" href="${xProfile.url}" target="_blank" rel="noopener"><span>View on X ↗</span></a>`));

  $('#magicPhoto').addEventListener('click', () => openModal(`
    <span class="mc-no"><span>Moving Photograph</span><span>AI 视频</span></span>
    <video src="assets/video/concept-film.mp4" controls autoplay playsinline></video>
    <h3 class="mc-title">风格化 AI 产品概念片</h3>
    <p class="mc-excerpt">美式卡通风格的产品发布概念片，从分镜到成片全部由 AI 视频生成完成。</p>
    <a class="mc-link" href="${tweets[2].url}" target="_blank" rel="noopener"><span>View on X ↗</span></a>`));

  // 4 条推文 → 信封
  tweets.forEach((t, k) => {
    const p = ENV_POS[k];
    const el = document.createElement('div');
    el.className = 'env';
    el.style.left = p.l + '%'; el.style.top = p.t + '%';
    el.style.transform = `rotate(${p.r}deg)`;
    el.style.animationDelay = `${-k * 2.1}s`;
    el.innerHTML = `<span class="e-seal">D</span><div class="e-type">${t.type}</div><div class="e-text">${t.text}</div>`;
    el.addEventListener('click', () => openModal(`
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
  co.addEventListener('click', () => openModal(`
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
  rp.addEventListener('click', () => openModal(`
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
function openModal(inner) {
  $('#modalCard').innerHTML = `<button class="mc-close" aria-label="关闭">×</button>` + inner;
  $('#modal').hidden = false;
}
function closeModal() {
  $('#modal').hidden = true;
  $$('#modalCard video').forEach((v) => v.pause());
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-modal-close]') || e.target.closest('.mc-close')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
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
      <p class="mb-hint">一场三幕剧 · 向下滚动开场 ↓</p>
    </header>

    <section class="mb-act">
      <div class="mb-acthead"><span>Act I</span><h2>The Critic's Library<em>剧评人的图书馆</em></h2></div>
      <a class="mb-strip" href="${xhsStats.url}" target="_blank" rel="noopener">
        小红书 · 粉丝 ${esc(xhsStats.fans)} · 获赞 ${esc(xhsStats.likes)} —— 访问主页 →
      </a>
      <div class="mb-scroll">${xhsNotes.map(noteCard).join('')}</div>
      <a class="mb-strip" href="${douyin.collection.url}" target="_blank" rel="noopener">
        抖音 ·「${esc(douyin.collection.name)}」${douyin.collection.episodes} 集 · ${esc(douyin.collection.plays)} 播放 —— 访问主页 →
      </a>
      <div class="mb-scroll">${douyin.videos.map(dyCard).join('')}</div>
    </section>

    <section class="mb-act">
      <div class="mb-acthead"><span>Act II</span><h2>Now Showing<em>央视放映厅</em></h2></div>
      ${cctvWorks.map(cctvCard).join('')}
    </section>

    <section class="mb-act">
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
      <p class="mb-foot">横屏或桌面端打开，可体验完整剧场交互版。</p>
    </footer>`;
})();
