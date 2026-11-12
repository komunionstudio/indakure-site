// IndaKure — subtle scroll reveals. Uses Web Animations so React-managed inline styles stay untouched.
(function () {
  if (window.__ikMotion) return; window.__ikMotion = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // page transition: two color layers "grow" up from the bottom with a soft bud-shaped crown; the next page lets them carry on upward.
  const EASE_OUT = 'cubic-bezier(.22,.61,.36,1)';
  const GROW = 'cubic-bezier(.7,0,.2,1)';
  const QUOTES = ['Good days start here', 'Gardeners welcome', 'Certified <em style="font-style:italic;font-weight:600;font-synthesis:weight">flower</em> girls', 'We teach before we sell', 'A different kind of <em style="font-style:italic;font-weight:600;font-synthesis:weight">flower</em> shop', 'Good <em style="font-style:italic;font-weight:600;font-synthesis:weight">flower</em>, good people', 'Tended with care', 'Let\u2019s talk <em style="font-style:italic;font-weight:600;font-synthesis:weight">flower</em>', 'Bloom together', 'Out \u201Cgardening\u201D'];
  // [front, ink, back]
  const PAIRS = [['#2E4234', '#D4DC72', '#8A9161'], ['#5C5A24', '#D4DC72', '#C8923A'], ['#C8923A', '#2E4234', '#D4DC72'], ['#A8452C', '#F8F2E7', '#C8923A'], ['#D4DC72', '#2E4234', '#8A9161'], ['#8A9161', '#F8F2E7', '#2E4234']];
  const KEY = 'indakure-transition';
  const FONTS = [['600', 'normal', 'Tropiline-SemiBold'], ['400', 'italic', 'Tropiline-Italic']].map(([w, st, f]) => {
    const ff = new FontFace('Tropiline', "url('./fonts/" + f + ".otf') format('opentype')", { weight: w, style: st });
    document.fonts.add(ff); return ff.load().catch(() => {});
  });
  const fontsReady = Promise.race([Promise.all(FONTS), new Promise(r => setTimeout(r, 600))]);
  const CROWN = '18vh';
  let veil;
  function layer(color, crownTop) {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:-15%;width:130%;height:calc(100vh + ' + CROWN + ');background:' + color + ';will-change:transform;' +
      (crownTop ? 'top:-' + CROWN + ';border-radius:50% 50% 0 0 / ' + CROWN + ' ' + CROWN + ' 0 0;padding-top:' + CROWN : 'top:0;border-radius:0 0 50% 50% / 0 0 ' + CROWN + ' ' + CROWN + ';padding-bottom:' + CROWN) +
      ';box-sizing:border-box;display:flex;align-items:center;justify-content:center';
    return d;
  }
  function quote(q, ink) {
    const l = document.createElement('div');
    l.style.cssText = "font-family:'Tropiline',Georgia,serif;font-weight:600;font-synthesis:none;font-size:clamp(44px,7vw,112px);line-height:1.04;text-align:center;text-wrap:balance;max-width:min(1100px,84vw);color:" + ink;
    l.innerHTML = QUOTES[q];
    return l;
  }
  function build(q, p, crownTop) {
    veil.innerHTML = '';
    const back = layer(PAIRS[p][2], crownTop), front = layer(PAIRS[p][0], crownTop), line = quote(q, PAIRS[p][1]);
    front.appendChild(line); veil.appendChild(front);
    return { back, front, line };
  }
  function makeVeil() {
    let carried = null;
    try { carried = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY); } catch (e) {}
    if (carried && Date.now() - carried.t > 4000) carried = null;
    veil = document.createElement('div');
    veil.setAttribute('data-no-reveal', '');
    veil.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden';
    document.body.appendChild(veil);
    if (!carried) return;
    const { back, front, line } = build(carried.q, carried.p, false);
    line.style.visibility = 'hidden';
    fontsReady.then(() => { line.style.visibility = ''; run(); });
    function run() {
    const up = [{ transform: 'translateY(0)' }, { transform: 'translateY(calc(-100vh - ' + CROWN + '))' }];
    line.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-24px)' }], { duration: 420, delay: 260, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    front.animate(up, { duration: 900, delay: 420, easing: GROW, fill: 'forwards' }).onfinish = () => { veil.innerHTML = ''; };

    }
  }
  const DEST = { 'our story': 'Certified <em style="font-style:italic;font-weight:600;font-synthesis:weight">flower</em> girls', 'blog': 'Out \u201Cgardening\u201D' };
  function leave(href) {
    if (!veil) return (location.href = href);
    const page = decodeURIComponent(new URL(href).pathname.split('/').pop()).replace(/\.dc\.html$/i, '').toLowerCase();
    let last = -1; try { last = JSON.parse(sessionStorage.getItem(KEY + '-last')) ?? -1; } catch (e) {}
    let q;
    if (DEST[page]) { q = QUOTES.indexOf(DEST[page]); if (q < 0) q = QUOTES.push(DEST[page]) - 1; }
    else { const pool = QUOTES.map((_, i) => i).filter(i => i !== last && !Object.values(DEST).includes(QUOTES[i])); q = pool[Math.floor(Math.random() * pool.length)]; }
    const p = Math.floor(Math.random() * PAIRS.length);
    try { sessionStorage.setItem(KEY, JSON.stringify({ q, p, t: Date.now() })); sessionStorage.setItem(KEY + '-last', String(q)); } catch (e) {}
    const { back, front, line } = build(q, p, true);
    veil.style.pointerEvents = 'auto';
    const grow = [{ transform: 'translateY(calc(100vh + ' + CROWN + '))' }, { transform: 'translateY(0)' }];
    front.animate(grow, { duration: 820, easing: GROW, fill: 'both' });
    line.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 440, easing: EASE_OUT, fill: 'both' });
    setTimeout(() => (location.href = href), 1060);
  }
  if (document.body) makeVeil(); else document.addEventListener('DOMContentLoaded', makeVeil);
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('#') || /^(mailto|tel|javascript):/i.test(raw)) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    leave(url.href);
  });
  window.addEventListener('pageshow', e => { if (e.persisted && veil) { veil.innerHTML = ''; veil.style.pointerEvents = 'none'; } });
  const EASE = 'cubic-bezier(.22,.61,.36,1)';
  const done = new WeakSet();
  const TEXT_TAGS = /^(H1|H2|H3|H4|P|BLOCKQUOTE|LI|BUTTON|INPUT|LABEL|A|DIV|SPAN)$/;
  const BLOCKY = /^(DIV|P|H[1-6]|UL|OL|LI|SECTION|ARTICLE|HEADER|FOOTER|NAV|FORM|IMAGE-SLOT|IMG|BLOCKQUOTE|FIGURE)$/;

  function excluded(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.tagName === 'NAV' || n.id === 'top' || n.hasAttribute('data-no-reveal')) return true;
      const cs = getComputedStyle(n);
      if (cs.position === 'fixed' || (cs.animationName && cs.animationName !== 'none')) return true;
    }
    return false;
  }
  function isTextLeaf(el) {
    if (!TEXT_TAGS.test(el.tagName)) return false;
    if (getComputedStyle(el).display === 'inline') return false;
    if (el.tagName === 'INPUT') return true;
    for (const c of el.children) if (BLOCKY.test(c.tagName) && getComputedStyle(c).display !== 'inline') return false;
    return /^H\d|P$/.test(el.tagName) || el.textContent.trim().length > 0;
  }
  function kind(el) {
    if (el.__ikMedia || el.tagName === 'IMAGE-SLOT' || el.tagName === 'IMG') return 'media';
    if (/^H[12]$/.test(el.tagName)) return 'head';
    return 'text';
  }
  const KF = {
    head: [{ opacity: 0, transform: 'translateY(32px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
    text: [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
    media: [{ opacity: 0, clipPath: 'inset(100% 0 0 0)', transform: 'translateY(24px) scale(1.03)', filter: 'saturate(.3)' }, { opacity: 1, clipPath: 'inset(0% 0 0 0)', transform: 'none', filter: 'saturate(1)' }]
  };
  const DUR = { head: 1100, text: 800, media: 1500 };

  const io = new IntersectionObserver(entries => {
    const hits = entries.filter(e => e.isIntersecting).sort((a, b) =>
      (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left));
    hits.forEach((e, i) => {
      io.unobserve(e.target);
      const list = e.target.__ikList || []; e.target.__ikList = null;
      list.forEach(a => setTimeout(() => a.play(), Math.min(i * 90, 630)));
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  function scan() {
    const root = document.querySelector('x-dc') || document.body;
    const cands = [];
    root.querySelectorAll('h1,h2,h3,h4,p,div,a,span,button,input,label,li,blockquote,image-slot,img').forEach(el => {
      if (done.has(el)) return;
      const k = kind(el);
      if (k !== 'media' && !isTextLeaf(el)) return;
      if (excluded(el)) { done.add(el); return; }
      if (k === 'media') { const p = el.parentElement; if (p && p !== root && !done.has(p) && getComputedStyle(p).backgroundColor !== 'rgba(0, 0, 0, 0)' && p.children.length <= 3) { done.add(el); p.__ikMedia = true; cands.push(p); return; } }
      cands.push(el);
    });
    // prefer the outermost text leaf (e.g. an <a> holding a single line), and never animate inside media
    const set = new Set(cands);
    cands.forEach(el => {
      for (let n = el.parentElement; n && n !== root; n = n.parentElement) {
        if (set.has(n) || done.has(n) && n.__ikAnim) { set.delete(el); done.add(el); break; }
      }
    });
    set.forEach(el => {
      done.add(el);
      const k = kind(el);
      const anim = el.animate(KF[k], { duration: DUR[k], easing: k === 'media' ? 'cubic-bezier(.25,.8,.25,1)' : EASE, fill: 'both' });
      anim.pause(); anim.currentTime = 0;
      anim.onfinish = () => { anim.cancel(); el.__ikAnim = null; };
      el.__ikAnim = anim;
      // clipped media can't be observed reliably (zero-area clip) — watch its unclipped parent instead
      const w = (k === 'media' && el.parentElement) || el;
      (w.__ikList || (w.__ikList = [])).push(anim);
      io.observe(w);
    });
  }

  let t;
  const queue = () => { clearTimeout(t); t = setTimeout(scan, 80); };
  function start() {
    queue();
    new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
