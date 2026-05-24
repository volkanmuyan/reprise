/* ──────────────────────────────────────────
   REPRISE  —  Share Service
   Konser kartı + Wrapped görseli üretir,
   Web Share API veya PNG indirme ile paylaşır.
──────────────────────────────────────────── */
(function (global) {
  'use strict';

  // ── CARD CSS (literal hex values — no CSS vars, resolves cleanly in html-to-image) ──
  const CARD_CSS = `
.rp-sc, .rp-sc *, .rp-sc *::before, .rp-sc *::after {
  box-sizing: border-box; margin: 0; padding: 0;
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.rp-sc {
  background: #0A0A0A; color: #F5F3EF;
  overflow: hidden; display: flex; flex-direction: column;
  position: fixed; left: -9999px; top: 0; z-index: 99999;
}
.rp-sc.story  { width: 360px; height: 640px; }
.rp-sc.square { width: 360px; height: 360px; }

.rp-sc-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 26px 26px 0;
}
.rp-sc-logo {
  font-size: 16px; font-weight: 800; letter-spacing: -0.5px;
  color: #C8FF00; text-transform: lowercase;
}
.rp-sc-ctx { font-size: 10px; color: #444; font-weight: 500; }

.rp-sc-body {
  flex: 1; padding: 22px 26px 18px;
  display: flex; flex-direction: column; justify-content: flex-end;
}
.rp-sc-artist {
  font-size: 40px; font-weight: 900; color: #F5F3EF;
  line-height: 1; letter-spacing: -1.5px; text-transform: lowercase;
  word-break: break-word; margin-bottom: 8px;
}
.rp-sc-venue { font-size: 13px; color: #8A8780; text-transform: lowercase; margin-bottom: 3px; }
.rp-sc-date  { font-size: 11px; color: #333; text-transform: lowercase; margin-bottom: 26px; }

.rp-sc-score-row { display: flex; align-items: baseline; gap: 3px; margin-bottom: 18px; }
.rp-sc-score     { font-size: 76px; font-weight: 900; color: #C8FF00; line-height: 1; letter-spacing: -3px; }
.rp-sc-score-den { font-size: 22px; font-weight: 600; color: #C8FF00; opacity: 0.5; padding-bottom: 7px; }

.rp-sc-comment {
  font-size: 13px; color: #6A6760; font-style: italic;
  line-height: 1.6; border-left: 2px solid #C8FF00; padding-left: 10px;
}

.rp-sc-stub { position: relative; padding: 14px 26px; }
.rp-sc-stub-line { border-top: 1.5px dashed #1E1E1E; }
.rp-sc-hole {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 22px; height: 22px; border-radius: 50%;
  background: #0A0A0A; border: 1.5px dashed #1E1E1E;
}
.rp-sc-hole.l { left: 12px; }
.rp-sc-hole.r { right: 12px; }

.rp-sc-ftr { padding: 0 26px 26px; display: flex; flex-direction: column; gap: 8px; }
.rp-sc-metrics { display: flex; gap: 20px; }
.rp-sc-metric { display: flex; flex-direction: column; gap: 2px; }
.rp-sc-m-label { font-size: 9px; color: #333; text-transform: lowercase; font-weight: 600; letter-spacing: 0.05em; }
.rp-sc-m-val   { font-size: 13px; font-weight: 700; color: #F5F3EF; }
.rp-sc-sig { display: flex; align-items: center; justify-content: space-between; }
.rp-sc-uname { font-size: 11px; font-weight: 600; color: #555; }
.rp-sc-brand { font-size: 10px; color: #2A2A2A; }

/* Square adjustments */
.rp-sc.square .rp-sc-body { padding: 14px 26px; justify-content: center; }
.rp-sc.square .rp-sc-artist { font-size: 28px; letter-spacing: -1px; margin-bottom: 6px; }
.rp-sc.square .rp-sc-score  { font-size: 52px; }
.rp-sc.square .rp-sc-score-den { font-size: 18px; }
.rp-sc.square .rp-sc-date { margin-bottom: 16px; }
.rp-sc.square .rp-sc-comment { font-size: 12px; }

/* Wrapped card */
.rp-sc-wr-row { margin-bottom: 22px; }
.rp-sc-wr-label { font-size: 10px; color: #444; text-transform: lowercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 4px; }
.rp-sc-wr-big { font-size: 60px; font-weight: 900; color: #C8FF00; line-height: 1; letter-spacing: -2px; }
.rp-sc-wr-mid { font-size: 28px; font-weight: 800; color: #F5F3EF; letter-spacing: -0.5px; }
.rp-sc-wr-sub { font-size: 13px; color: #8A8780; text-transform: lowercase; }
.rp-sc-wr-unit { font-size: 13px; color: #555; font-weight: 500; }
`;

  let _cssInjected = false;
  function injectCSS() {
    if (_cssInjected) return;
    _cssInjected = true;
    const s = document.createElement('style');
    s.id = 'rp-share-card-css';
    s.textContent = CARD_CSS;
    document.head.appendChild(s);
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtDate(dateStr) {
    if (!dateStr) return '';
    const M = ['ocak','şubat','mart','nisan','mayıs','haziran','temmuz','ağustos','eylül','ekim','kasım','aralık'];
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
    } catch { return dateStr; }
  }

  function getConcertContext(concert) {
    try {
      const all  = global.DataService.getHistory();
      const year = concert.date ? new Date(concert.date + 'T12:00:00').getFullYear() : null;
      if (!year) return '';
      const inYear = all
        .filter(c => c.date && new Date(c.date + 'T12:00:00').getFullYear() === year)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const idx = inYear.findIndex(c => c.id === concert.id);
      return idx >= 0 ? `${year}'te ${idx + 1}. konser` : '';
    } catch { return ''; }
  }

  // ── CONCERT CARD ──────────────────────────────────────────────────────────
  function buildConcertCard(concert, user, ratio) {
    injectCSS();
    const el = document.createElement('div');
    el.className = `rp-sc ${ratio}`;

    const uname  = user?.username ? `@${user.username}` : '';
    const ctx    = getConcertContext(concert);
    const venue  = [concert.venue, concert.city].filter(Boolean).join(' · ');

    const scoreHtml = concert.rating
      ? `<div class="rp-sc-score-row">
           <span class="rp-sc-score">${esc(String(concert.rating))}</span>
           <span class="rp-sc-score-den">/10</span>
         </div>`
      : '';

    const commentHtml = concert.notes
      ? `<p class="rp-sc-comment">"${esc(concert.notes)}"</p>`
      : '';

    const stubHtml = (ratio === 'story')
      ? `<div class="rp-sc-stub">
           <div class="rp-sc-hole l"></div>
           <div class="rp-sc-stub-line"></div>
           <div class="rp-sc-hole r"></div>
         </div>`
      : '';

    el.innerHTML = `
      <div class="rp-sc-hdr">
        <span class="rp-sc-logo">reprise</span>
        <span class="rp-sc-ctx">${esc(ctx)}</span>
      </div>
      <div class="rp-sc-body">
        <div class="rp-sc-artist">${esc(concert.artist || '')}</div>
        <div class="rp-sc-venue">${esc(venue)}</div>
        <div class="rp-sc-date">${fmtDate(concert.date)}</div>
        ${scoreHtml}
        ${commentHtml}
      </div>
      ${stubHtml}
      <div class="rp-sc-ftr">
        <div class="rp-sc-sig">
          <span class="rp-sc-uname">${esc(uname)}</span>
          <span class="rp-sc-brand">reprise.app</span>
        </div>
      </div>`;

    return el;
  }

  // ── WRAPPED CARD ──────────────────────────────────────────────────────────
  function buildWrappedCard(stats, user, ratio) {
    injectCSS();
    const el = document.createElement('div');
    el.className = `rp-sc ${ratio}`;

    const uname = user?.username ? `@${user.username}` : '';

    const rows = [];

    rows.push(`
      <div class="rp-sc-wr-row">
        <div class="rp-sc-wr-label">${stats.year} · konser sayın</div>
        <div class="rp-sc-wr-big">${stats.total}</div>
        <div class="rp-sc-wr-unit">konser</div>
      </div>`);

    if (stats.avgRating) rows.push(`
      <div class="rp-sc-wr-row">
        <div class="rp-sc-wr-label">ortalama puan</div>
        <div class="rp-sc-wr-mid">${stats.avgRating} <span class="rp-sc-wr-unit">/ 10</span></div>
      </div>`);

    if (stats.best) rows.push(`
      <div class="rp-sc-wr-row">
        <div class="rp-sc-wr-label">en iyi konser</div>
        <div class="rp-sc-wr-sub" style="font-size:18px;font-weight:800;color:#F5F3EF;text-transform:lowercase">${esc(stats.best.artist)}</div>
        ${stats.best.venue ? `<div class="rp-sc-wr-unit">${esc([stats.best.venue, stats.best.city].filter(Boolean).join(' · '))}</div>` : ''}
      </div>`);

    if (stats.uniqueArtists > 1) rows.push(`
      <div class="rp-sc-wr-row">
        <div class="rp-sc-wr-label">farklı sanatçı</div>
        <div class="rp-sc-wr-mid">${stats.uniqueArtists}</div>
      </div>`);

    if (stats.topCity) rows.push(`
      <div class="rp-sc-wr-row">
        <div class="rp-sc-wr-label">en çok gittiğin şehir</div>
        <div class="rp-sc-wr-sub" style="font-size:16px;font-weight:700;color:#F5F3EF;text-transform:lowercase">${esc(stats.topCity.name)} <span class="rp-sc-wr-unit">${stats.topCity.count} konser</span></div>
      </div>`);

    el.innerHTML = `
      <div class="rp-sc-hdr">
        <span class="rp-sc-logo">reprise</span>
        <span class="rp-sc-ctx">${stats.year} wrapped</span>
      </div>
      <div class="rp-sc-body" style="justify-content:flex-start;padding-top:24px">
        ${rows.join('')}
      </div>
      <div class="rp-sc-ftr">
        <div class="rp-sc-sig">
          <span class="rp-sc-uname">${esc(uname)}</span>
          <span class="rp-sc-brand">reprise.app</span>
        </div>
      </div>`;

    return el;
  }

  // ── RENDER TO PNG ──────────────────────────────────────────────────────────
  async function renderToPng(el, ratio) {
    const DIMS = {
      story:  { w: 360, h: 640 },
      square: { w: 360, h: 360 },
    };
    const { w, h } = DIMS[ratio] || DIMS.story;
    el.style.width  = w + 'px';
    el.style.height = h + 'px';
    document.body.appendChild(el);

    try {
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 80)); // layout settle

      const lib = global.htmlToImage;
      if (!lib) throw new Error('html-to-image kütüphanesi yüklenmedi');

      return await lib.toPng(el, {
        width:  w,
        height: h,
        pixelRatio: 3,   // 3× → 1080p output
        cacheBust: true,
        skipAutoScale: true,
        style: { 'border-radius': '0' },
      });
    } finally {
      el.remove();
    }
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  const ShareService = {

    async concertCard(concert, user, ratio = 'story') {
      const el = buildConcertCard(concert, user, ratio);
      return renderToPng(el, ratio);
    },

    async wrappedCard(stats, user, ratio = 'story') {
      const el = buildWrappedCard(stats, user, ratio);
      return renderToPng(el, ratio);
    },

    async shareOrDownload(dataUrl, filename) {
      // Try Web Share API with file
      if (navigator.share) {
        try {
          const blob = await fetch(dataUrl).then(r => r.blob());
          const file = new File([blob], filename, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            return 'shared';
          }
        } catch (e) {
          if (e.name === 'AbortError') return 'cancelled';
        }
      }
      // Fallback: trigger download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return 'downloaded';
    },
  };

  global.ShareService = ShareService;

})(window);
