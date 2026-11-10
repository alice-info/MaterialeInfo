/*
  Comportamentul comun al paginilor de materiale. Nu trebuie modificat pentru un material nou.
  O pagină de material are <body data-root="../" data-id="..."> și folosește componentele din design.html.
*/
(function () {
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
window.store = store;

const root = document.body.dataset.root || '';
const id = document.body.dataset.id || '';
const LISTA = window.MATERIALE || [];
const CLASE = window.CLASE || {};
const SITE = window.SITE || {};
const eu = LISTA.find(m => m.id === id);
const href = m => root + 'materiale/' + m.id + '.html';

/* mod proiector: aplicat cât mai devreme */
if (store.get('mat-proj') === '1') document.documentElement.classList.add('proj');

/* ---------- bara de sus ---------- */
const areSolutii = document.querySelector('details.sol, details.hint');
const bar = document.createElement('div');
bar.className = 'bar';
bar.innerHTML = `<div class="wrap">
  <nav class="nav-left" aria-label="Navigare">
    <a href="${root}index.html">${SITE.nume || 'Materiale'}</a>
    ${eu ? `<span class="sep">/</span><a href="${root}index.html#clasa-${eu.clasa}">${CLASE[eu.clasa] || ''}</a><span class="sep">/</span><span class="here">${eu.titlu}</span>` : ''}
  </nav>
  <div class="bar-ctrl">
    ${areSolutii ? '<button class="tgl" id="tglSol" type="button" aria-pressed="false">Arată toate soluțiile</button>' : ''}
    <button class="tgl" id="tglProj" type="button" aria-pressed="false">Mod proiector</button>
  </div></div>`;
document.body.insertBefore(bar, document.body.firstChild);

const tglSol = document.getElementById('tglSol'), tglProj = document.getElementById('tglProj');
if (tglSol) tglSol.addEventListener('click', () => {
  const on = tglSol.getAttribute('aria-pressed') !== 'true';
  tglSol.setAttribute('aria-pressed', on);
  tglSol.textContent = on ? 'Ascunde toate soluțiile' : 'Arată toate soluțiile';
  document.querySelectorAll('details.sol, details.hint').forEach(d => d.open = on);
});
function setProj(on) { document.documentElement.classList.toggle('proj', on); tglProj.setAttribute('aria-pressed', on); store.set('mat-proj', on ? '1' : '0'); }
tglProj.addEventListener('click', () => setProj(tglProj.getAttribute('aria-pressed') !== 'true'));
if (store.get('mat-proj') === '1') setProj(true);

/* ---------- eticheta de deasupra titlului ---------- */
const eyebrow = document.querySelector('.hero .eyebrow');
if (eyebrow && !eyebrow.textContent.trim() && eu)
  eyebrow.textContent = [CLASE[eu.clasa], eu.tip].filter(Boolean).join(' · ');

/* ---------- lecția anterioară / următoare din aceeași clasă ---------- */
const main = document.querySelector('main');
if (eu && main) {
  const din = LISTA.filter(m => m.clasa === eu.clasa);
  const k = din.indexOf(eu), prev = din[k - 1], next = din[k + 1];
  if (prev || next) {
    const p = document.createElement('nav');
    p.className = 'pager'; p.setAttribute('aria-label', 'Alte lecții');
    p.innerHTML = (prev ? `<a href="${href(prev)}"><span>Lecția anterioară</span><b>${prev.titlu}</b></a>` : '<span></span>') +
                  (next ? `<a class="next" href="${href(next)}"><span>Lecția următoare</span><b>${next.titlu}</b></a>` : '');
    main.appendChild(p);
  }
}

/* ---------- subsol ---------- */
const foot = document.createElement('footer');
foot.innerHTML = `<div class="wrap">${SITE.nume || ''}${SITE.autor ? ' · ' + SITE.autor : ''} · <a href="${root}index.html">Toate materialele</a></div>`;
document.body.appendChild(foot);

/* ---------- blocuri de cod: <script type="text/x-cpp" class="cod"> ... </script> ---------- */
document.querySelectorAll('script.cod').forEach(s => {
  const src = s.textContent.replace(/^\n+/, '').replace(/\s+$/, '');
  const box = document.createElement('div'); box.className = 'code';
  const pre = document.createElement('pre'), code = document.createElement('code');
  code.className = 'language-' + (s.dataset.lang || 'cpp'); code.textContent = src; pre.appendChild(code);
  const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = s.dataset.limbaj || 'C++';
  const btn = document.createElement('button'); btn.className = 'copy'; btn.type = 'button'; btn.textContent = 'Copiază';
  btn.addEventListener('click', () => {
    const reset = t => { btn.textContent = t; setTimeout(() => btn.textContent = 'Copiază', 1400); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(code); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); reset('Selectat'); };
    try { navigator.clipboard.writeText(src).then(() => reset('Copiat'), fallback); } catch (e) { fallback(); }
  });
  box.append(tag, btn, pre);
  s.replaceWith(box);
  try { if (window.hljs) hljs.highlightElement(code); } catch (e) {}
});

/* blocuri de cod scrise direct în pagină (<div class="code"><pre><code>...</code></pre></div>): adăugăm butonul de copiere */
document.querySelectorAll('.code').forEach(box => {
  if (box.querySelector('.copy')) return;
  const code = box.querySelector('code'); if (!code) return;
  const btn = document.createElement('button'); btn.className = 'copy'; btn.type = 'button'; btn.textContent = 'Copiază';
  btn.addEventListener('click', () => {
    const reset = t => { btn.textContent = t; setTimeout(() => btn.textContent = 'Copiază', 1400); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(code); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); reset('Selectat'); };
    try { navigator.clipboard.writeText(code.textContent).then(() => reset('Copiat'), fallback); } catch (e) { fallback(); }
  });
  box.insertBefore(btn, box.firstChild);
});

/* ---------- cuprins automat: <nav class="toc" data-auto> ---------- */
const toc = document.querySelector('nav.toc[data-auto]');
if (toc && main) {
  const eticheta = el => {
    if (el.dataset.toc) return el.dataset.toc;
    const h = el.querySelector('h2, h3'); if (!h) return '';
    const c = h.cloneNode(true); c.querySelectorAll('.src').forEach(x => x.remove());
    return c.textContent.replace(/^Problema\s+/, '').trim();
  };
  const items = [];
  main.querySelectorAll(':scope > section[id]').forEach(sec => {
    const h2 = sec.querySelector(':scope > h2');
    if (h2 || sec.dataset.toc) items.push({ id: sec.id, t: eticheta(sec), sub: false });
    sec.querySelectorAll('.prob[id]').forEach(p => {
      if (p.querySelector('h2') || p.closest('.show')) return;   // .show = exemple din ghidul de design
      items.push({ id: p.id, t: eticheta(p), sub: !!(h2 || sec.dataset.toc) });
    });
  });
  toc.innerHTML = '<p>Cuprins</p><ol>' + items.map(i => `<li${i.sub ? ' class="sub"' : ''}><a href="#${i.id}">${i.t}</a></li>`).join('') + '</ol>';
}
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.toc a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); }
  }), { rootMargin: '-15% 0px -75% 0px' });
  [...map.keys()].forEach(i => { const t = document.getElementById(i); if (t) io.observe(t); });
}

/* think timers */
document.querySelectorAll('[data-timer]').forEach(t => {
  let id = null;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const draw = () => {
    t.classList.remove('over');
    t.innerHTML = 'Timp de gândire:';
    [3, 5, 10].forEach(m => { const b = document.createElement('button'); b.type = 'button'; b.textContent = m + ' min'; b.onclick = () => start(m * 60); t.appendChild(b); });
  };
  const start = secs => {
    clearInterval(id); t.innerHTML = '';
    const clock = document.createElement('span'); clock.className = 'clock'; clock.textContent = fmt(secs);
    const stop = document.createElement('button'); stop.type = 'button'; stop.textContent = 'Oprește';
    stop.onclick = () => { clearInterval(id); draw(); };
    t.append(clock, stop);
    id = setInterval(() => {
      secs--; clock.textContent = fmt(Math.max(secs, 0));
      if (secs <= 0) { clearInterval(id); t.classList.add('over'); clock.textContent = 'Timpul a expirat'; stop.textContent = 'Din nou'; }
    }, 1000);
  };
  draw();
});

/* stepper */
function Stepper(root, build) {
  const cellsEl = root.querySelector('[data-cells]'), statusEl = root.querySelector('[data-status]');
  const statsEl = root.querySelector('[data-stats]'), ctEl = root.querySelector('[data-ct]');
  const prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]'), play = root.querySelector('[data-play]');
  let frames = [], arr = [], i = 0, timer = null;
  function render() {
    const f = frames[i];
    cellsEl.innerHTML = '';
    arr.forEach((v, k) => {
      const c = document.createElement('div'); c.className = 'cell';
      const isL = k === f.l, isR = k === f.r;
      if (f.win && k >= f.win[0] && k <= f.win[1]) c.classList.add('win');
      if (f.good && f.good.includes(k)) c.classList.add('win');
      if (f.done && f.done(k)) c.classList.add('done');
      if (f.bad && f.bad.includes(k)) c.classList.add('bad');
      if (isL && isR) c.classList.add('lr'); else if (isL) c.classList.add('l'); else if (isR) c.classList.add('r');
      if (v === null) c.classList.add('ghost');
      if (isL) c.insertAdjacentHTML('beforeend', `<span class="ptr pl">${f.ln || 'st'}</span>`);
      if (isR) c.insertAdjacentHTML('beforeend', `<span class="ptr pr">${f.rn || 'dr'}</span>`);
      if (v !== null) c.append(String(v));
      const ix = document.createElement('span'); ix.className = 'ix'; ix.textContent = v === null ? 'end()' : (f.base1 ? k + 1 : k); c.appendChild(ix);
      cellsEl.appendChild(c);
    });
    statusEl.innerHTML = f.msg;
    if (statsEl) statsEl.innerHTML = f.stats || '';
    ctEl.textContent = `pas ${i + 1} / ${frames.length}`;
    prev.disabled = i === 0; next.disabled = i === frames.length - 1;
    if (i === frames.length - 1) stop();
  }
  function stop() { clearInterval(timer); timer = null; play.textContent = 'Rulează'; }
  function reset() { stop(); const r = build(); arr = r.arr; frames = r.frames; i = 0; render(); }
  prev.addEventListener('click', () => { stop(); if (i > 0) { i--; render(); } });
  next.addEventListener('click', () => { stop(); if (i < frames.length - 1) { i++; render(); } });
  play.addEventListener('click', () => {
    if (timer) return stop();
    if (i === frames.length - 1) { i = 0; render(); }
    play.textContent = 'Pauză';
    timer = setInterval(() => { if (i < frames.length - 1) { i++; render(); } else stop(); }, 1100);
  });
  reset();
  return { reset };
}


window.Stepper = Stepper;
})();
