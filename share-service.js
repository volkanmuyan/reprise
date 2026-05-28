/* ──────────────────────────────────────────
   REPRISE  —  Share Service
   Canvas tabanlı PNG üretimi (html-to-image
   iOS PWA'da SVG foreignObject sebebiyle
   güvenilmez çalıştığından tamamen Canvas).
──────────────────────────────────────────── */
(function (global) {
  'use strict';

  const M_TR = ['ocak','şubat','mart','nisan','mayıs','haziran',
                'temmuz','ağustos','eylül','ekim','kasım','aralık'];

  function fmtDate(ds) {
    if (!ds) return '';
    try {
      const d = new Date(ds + 'T12:00:00');
      return d.getDate() + ' ' + M_TR[d.getMonth()] + ' ' + d.getFullYear();
    } catch { return ds; }
  }

  function getConcertLabel(c) {
    try {
      if (!global.DataService || typeof global.DataService.getHistory !== 'function') return '';
      const all  = global.DataService.getHistory();
      const year = c.date ? new Date(c.date + 'T12:00:00').getFullYear() : null;
      if (!year) return '';
      const inYear = all
        .filter(x => x.date && new Date(x.date + 'T12:00:00').getFullYear() === year)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const idx = inYear.findIndex(x => x.id === c.id);
      return idx >= 0 ? year + "'te " + (idx + 1) + ". konser" : '';
    } catch { return ''; }
  }

  function wrapText(ctx, text, maxW) {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function setLS(ctx, v) {
    try { ctx.letterSpacing = v; } catch (_) {}
  }

  // ── CONCERT CARD ──────────────────────────────────────────────────────────
  function drawConcert(ctx, W, H, concert, user, ratio) {
    const S   = ratio === 'square';
    const PAD = 26;
    const BG  = '#0A0A0A';

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // ── Header ──────────────────────────────────────────────────────────────
    ctx.textBaseline = 'top';
    ctx.textAlign    = 'left';
    setLS(ctx, '-0.5px');
    ctx.font      = '800 16px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle = '#C8FF00';
    ctx.fillText('reprise', PAD, PAD);
    setLS(ctx, '0px');

    const lbl = getConcertLabel(concert);
    if (lbl) {
      ctx.font      = '500 10px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle = '#444';
      ctx.textAlign = 'right';
      ctx.fillText(lbl, W - PAD, PAD + 3);
    }

    // ── Footer ──────────────────────────────────────────────────────────────
    const uname = user && user.username ? '@' + user.username : '';
    ctx.textBaseline = 'bottom';
    if (uname) {
      ctx.font      = '600 11px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle = '#555';
      ctx.textAlign = 'left';
      ctx.fillText(uname, PAD, H - PAD);
    }
    ctx.font      = '400 10px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle = '#2A2A2A';
    ctx.textAlign = 'right';
    ctx.fillText('reprise.app', W - PAD, H - PAD);

    // ── Stub (story only) ────────────────────────────────────────────────────
    // Footer occupies bottom ~37px. Stub occupies the 30px above it.
    const FOOTER_H = 37;
    const STUB_H   = 30;

    if (!S) {
      const sy = H - FOOTER_H - STUB_H / 2;  // vertical center of stub line

      // Dashed tear line
      ctx.strokeStyle = '#1E1E1E';
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(PAD, sy);
      ctx.lineTo(W - PAD, sy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Punch holes (background fill + dashed border)
      [23, W - 23].forEach(cx => {
        ctx.fillStyle = BG;
        ctx.beginPath();
        ctx.arc(cx, sy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1E1E1E';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // ── Body content (drawn bottom-up, mirrors flex-end) ────────────────────
    const BODY_BTM = S
      ? H - FOOTER_H - PAD
      : H - FOOTER_H - STUB_H - 18;  // 18 = body padding-bottom

    let y = BODY_BTM;

    // Comment
    if (concert.notes) {
      const txt   = '“' + concert.notes + '”';
      ctx.font    = 'italic 13px -apple-system,"Helvetica Neue",Arial,sans-serif';
      const lines = wrapText(ctx, txt, W - PAD * 2 - 14);
      const LH    = Math.round(13 * 1.6);  // 21px
      const blkH  = lines.length * LH;
      const top   = y - blkH;

      ctx.fillStyle    = '#6A6760';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      lines.forEach((l, i) => ctx.fillText(l, PAD + 14, top + i * LH));

      // Accent bar
      ctx.fillStyle = '#C8FF00';
      ctx.fillRect(PAD, top - 2, 2, blkH + 4);

      y = top - 18;
    }

    // Score
    if (concert.rating) {
      const s   = String(concert.rating);
      const FS  = S ? 52 : 76;
      const FSD = S ? 18 : 22;

      setLS(ctx, '-3px');
      ctx.font         = '900 ' + FS + 'px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#C8FF00';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      const sw = ctx.measureText(s).width;
      ctx.fillText(s, PAD, y);
      setLS(ctx, '0px');

      ctx.font        = '600 ' + FSD + 'px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.globalAlpha = 0.5;
      ctx.fillText('/10', PAD + sw + 4, y - 6);
      ctx.globalAlpha = 1;

      y -= FS + 26;
    }

    // Date
    if (concert.date) {
      ctx.font         = '400 11px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#333';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      ctx.fillText(fmtDate(concert.date), PAD, y);
      y -= 14;
    }

    // Venue
    const venue = [concert.venue, concert.city].filter(Boolean).join(' · ');
    if (venue) {
      ctx.font         = '400 13px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#8A8780';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      ctx.fillText(venue, PAD, y);
      y -= 21;
    }

    // Artist name
    const artist = (concert.artist || '').toLowerCase();
    if (artist) {
      const FS = S ? 28 : 40;
      setLS(ctx, S ? '-1px' : '-1.5px');
      ctx.font = '900 ' + FS + 'px -apple-system,"Helvetica Neue",Arial,sans-serif';
      const lines = wrapText(ctx, artist, W - PAD * 2);

      ctx.fillStyle    = '#F5F3EF';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      for (let i = lines.length - 1; i >= 0; i--) {
        ctx.fillText(lines[i], PAD, y);
        y -= FS;
      }
      setLS(ctx, '0px');
    }
  }

  // ── WRAPPED CARD ──────────────────────────────────────────────────────────
  function drawWrapped(ctx, W, H, stats, user) {
    const PAD     = 26;
    const ROW_GAP = 22;
    const BG      = '#0A0A0A';

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // Header
    setLS(ctx, '-0.5px');
    ctx.font         = '800 16px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle    = '#C8FF00';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('reprise', PAD, PAD);
    setLS(ctx, '0px');

    ctx.font      = '500 10px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle = '#444';
    ctx.textAlign = 'right';
    ctx.fillText(stats.year + ' wrapped', W - PAD, PAD + 3);

    // Footer
    const uname = user && user.username ? '@' + user.username : '';
    ctx.textBaseline = 'bottom';
    if (uname) {
      ctx.font      = '600 11px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle = '#555';
      ctx.textAlign = 'left';
      ctx.fillText(uname, PAD, H - PAD);
    }
    ctx.font      = '400 10px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle = '#2A2A2A';
    ctx.textAlign = 'right';
    ctx.fillText('reprise.app', W - PAD, H - PAD);

    let y = PAD + 16 + 24;

    const lbl = text => {
      ctx.font         = '600 10px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#444';
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(text, PAD, y);
      y += 16;
    };

    // Total concerts
    lbl(stats.year + ' · konser sayın');
    setLS(ctx, '-2px');
    ctx.font         = '900 60px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle    = '#C8FF00';
    ctx.textBaseline = 'top';
    ctx.textAlign    = 'left';
    ctx.fillText(String(stats.total), PAD, y);
    setLS(ctx, '0px');
    y += 64;
    ctx.font      = '500 13px -apple-system,"Helvetica Neue",Arial,sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText('konser', PAD, y);
    y += 17 + ROW_GAP;

    if (stats.avgRating && y < H - 90) {
      lbl('ortalama puan');
      ctx.font         = '800 28px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#F5F3EF';
      ctx.textBaseline = 'top';
      const aw = ctx.measureText(stats.avgRating).width;
      ctx.fillText(stats.avgRating, PAD, y);
      ctx.font      = '500 13px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText('/ 10', PAD + aw + 6, y + 10);
      y += 32 + ROW_GAP;
    }

    if (stats.best && y < H - 90) {
      lbl('en iyi konser');
      ctx.font         = '800 18px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#F5F3EF';
      ctx.textBaseline = 'top';
      ctx.fillText((stats.best.artist || '').toLowerCase(), PAD, y);
      y += 22;
      const bv = [stats.best.venue, stats.best.city].filter(Boolean).join(' · ');
      if (bv) {
        ctx.font      = '500 13px -apple-system,"Helvetica Neue",Arial,sans-serif';
        ctx.fillStyle = '#555';
        ctx.fillText(bv, PAD, y);
        y += 17;
      }
      y += ROW_GAP;
    }

    if (stats.uniqueArtists > 1 && y < H - 90) {
      lbl('farklı sanatçı');
      ctx.font         = '800 28px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#F5F3EF';
      ctx.textBaseline = 'top';
      ctx.fillText(String(stats.uniqueArtists), PAD, y);
      y += 32 + ROW_GAP;
    }

    if (stats.topCity && y < H - 60) {
      lbl('en çok gittiğin şehir');
      ctx.font         = '700 16px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle    = '#F5F3EF';
      ctx.textBaseline = 'top';
      const cn = (stats.topCity.name || '').toLowerCase();
      const cw = ctx.measureText(cn).width;
      ctx.fillText(cn, PAD, y);
      ctx.font      = '500 13px -apple-system,"Helvetica Neue",Arial,sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText(stats.topCity.count + ' konser', PAD + cw + 8, y + 2);
    }
  }

  // ── PNG RENDER ────────────────────────────────────────────────────────────
  function renderToPng(drawFn, ratio) {
    const SCALE = 3;
    const DIMS  = { story: { w: 360, h: 640 }, square: { w: 360, h: 360 } };
    const dim   = DIMS[ratio] || DIMS.story;
    const cv    = document.createElement('canvas');
    cv.width    = dim.w * SCALE;
    cv.height   = dim.h * SCALE;
    const ctx   = cv.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.scale(SCALE, SCALE);
    drawFn(ctx, dim.w, dim.h);
    return cv.toDataURL('image/png');
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  const ShareService = {

    async concertCard(concert, user, ratio) {
      ratio = ratio || 'story';
      return renderToPng(
        (ctx, w, h) => drawConcert(ctx, w, h, concert, user, ratio),
        ratio
      );
    },

    async wrappedCard(stats, user, ratio) {
      ratio = ratio || 'story';
      return renderToPng(
        (ctx, w, h) => drawWrapped(ctx, w, h, stats, user),
        ratio
      );
    },

    async shareOrDownload(dataUrl, filename) {
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
      const a = document.createElement('a');
      a.href = dataUrl; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      return 'downloaded';
    },
  };

  global.ShareService = ShareService;

})(window);
