/* ──────────────────────────────────────────
   REPRISE  —  Share Service (Canvas-based)
   Konser kartı + Wrapped görseli üretir,
   Web Share API veya PNG indirme ile paylaşır.
──────────────────────────────────────────── */
(function (global) {
  'use strict';

  // ── HELPERS ──────────────────────────────────────────────────────────────
  const MONTHS_TR = ['ocak','şubat','mart','nisan','mayıs','haziran',
                     'temmuz','ağustos','eylül','ekim','kasım','aralık'];

  function fmtDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.getDate() + ' ' + MONTHS_TR[d.getMonth()] + ' ' + d.getFullYear();
    } catch { return dateStr; }
  }

  function getConcertLabel(concert) {
    try {
      const all  = global.DataService.getHistory();
      const year = concert.date ? new Date(concert.date + 'T12:00:00').getFullYear() : null;
      if (!year) return '';
      const inYear = all
        .filter(c => c.date && new Date(c.date + 'T12:00:00').getFullYear() === year)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const idx = inYear.findIndex(c => c.id === concert.id);
      return idx >= 0 ? year + "’te " + (idx + 1) + ". konser" : '';
    } catch { return ''; }
  }

  // Word-wrap text to fit maxWidth; returns array of line strings
  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
      const probe = line ? line + ' ' + word : word;
      if (ctx.measureText(probe).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = probe;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  // ── CONCERT CARD ──────────────────────────────────────────────────────────
  function drawConcertCard(ctx, W, H, concert, user, ratio) {
    const S   = ratio === 'square';
    const PAD = 26;

    // Background
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.textBaseline = 'top';
    ctx.textAlign    = 'left';
    ctx.fillStyle    = '#C8FF00';
    ctx.font         = '800 16px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('reprise', PAD, PAD);

    const ctxLabel = getConcertLabel(concert);
    if (ctxLabel) {
      ctx.fillStyle  = '#444444';
      ctx.font       = '500 10px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign  = 'right';
      ctx.fillText(ctxLabel, W - PAD, PAD + 3);
    }

    // Footer
    const uname = user && user.username ? '@' + user.username : '';
    ctx.textBaseline = 'bottom';
    if (uname) {
      ctx.fillStyle = '#555555';
      ctx.font      = '600 11px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(uname, PAD, H - PAD);
    }
    ctx.fillStyle  = '#2A2A2A';
    ctx.font       = '400 10px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign  = 'right';
    ctx.fillText('reprise.app', W - PAD, H - PAD);

    // Stub (story only)
    const FOOTER_H  = 50;
    const STUB_H    = 50;

    if (!S) {
      const stubCenterY = H - FOOTER_H - STUB_H / 2;

      // Dashed line
      ctx.strokeStyle = '#1E1E1E';
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(PAD + 14, stubCenterY);
      ctx.lineTo(W - PAD - 14, stubCenterY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Left hole
      ctx.fillStyle = '#0A0A0A';
      ctx.beginPath();
      ctx.arc(PAD - 2, stubCenterY, 11, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#1E1E1E';
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right hole
      ctx.fillStyle = '#0A0A0A';
      ctx.beginPath();
      ctx.arc(W - PAD + 2, stubCenterY, 11, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#1E1E1E';
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Body content — drawn bottom-up
    const BODY_BOTTOM = S
      ? H - FOOTER_H - PAD
      : H - FOOTER_H - STUB_H - 18;

    let y = BODY_BOTTOM;

    // Comment / notes
    if (concert.notes) {
      const noteText  = '“' + concert.notes + '”';
      ctx.font        = 'italic 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
      const noteLines = wrapText(ctx, noteText, W - PAD * 2 - 14);
      const NOTE_LH   = 21;
      const noteH     = noteLines.length * NOTE_LH;
      const noteTop   = y - noteH;

      ctx.fillStyle    = '#6A6760';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      noteLines.forEach(function(line, i) {
        ctx.fillText(line, PAD + 14, noteTop + i * NOTE_LH);
      });

      // Accent left bar
      ctx.fillStyle = '#C8FF00';
      ctx.fillRect(PAD, noteTop - 2, 2, noteH + 4);

      y = noteTop - 18;
    }

    // Score
    if (concert.rating) {
      const scoreStr  = String(concert.rating);
      const scoreSize = S ? 52 : 76;
      const denSize   = S ? 18 : 22;

      ctx.fillStyle    = '#C8FF00';
      ctx.font         = '900 ' + scoreSize + 'px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      const scoreW = ctx.measureText(scoreStr).width;
      ctx.fillText(scoreStr, PAD, y);

      ctx.font        = '600 ' + denSize + 'px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.globalAlpha = 0.5;
      ctx.fillText('/10', PAD + scoreW + 4, y - 7);
      ctx.globalAlpha = 1;

      y -= scoreSize + 26;
    }

    // Date
    if (concert.date) {
      ctx.fillStyle    = '#333333';
      ctx.font         = '400 11px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      ctx.fillText(fmtDate(concert.date), PAD, y);
      y -= 14;
    }

    // Venue
    const venue = [concert.venue, concert.city].filter(Boolean).join(' · ');
    if (venue) {
      ctx.fillStyle    = '#8A8780';
      ctx.font         = '400 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      ctx.fillText(venue, PAD, y);
      y -= 21;
    }

    // Artist name (may wrap)
    const artist = (concert.artist || '').toLowerCase();
    if (artist) {
      const artistSize = S ? 28 : 40;
      ctx.font = '900 ' + artistSize + 'px -apple-system, "Helvetica Neue", Arial, sans-serif';
      const artistLines = wrapText(ctx, artist, W - PAD * 2);

      ctx.fillStyle    = '#F5F3EF';
      ctx.textBaseline = 'bottom';
      ctx.textAlign    = 'left';
      for (var i = artistLines.length - 1; i >= 0; i--) {
        ctx.fillText(artistLines[i], PAD, y);
        y -= artistSize;
      }
    }
  }

  // ── WRAPPED CARD ──────────────────────────────────────────────────────────
  function drawWrappedCard(ctx, W, H, stats, user) {
    const PAD     = 26;
    const ROW_GAP = 22;

    // Background
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.textBaseline = 'top';
    ctx.textAlign    = 'left';
    ctx.fillStyle    = '#C8FF00';
    ctx.font         = '800 16px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('reprise', PAD, PAD);

    ctx.fillStyle  = '#444444';
    ctx.font       = '500 10px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign  = 'right';
    ctx.fillText(stats.year + ' wrapped', W - PAD, PAD + 3);

    // Footer
    const uname = user && user.username ? '@' + user.username : '';
    ctx.textBaseline = 'bottom';
    if (uname) {
      ctx.fillStyle = '#555555';
      ctx.font      = '600 11px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(uname, PAD, H - PAD);
    }
    ctx.fillStyle  = '#2A2A2A';
    ctx.font       = '400 10px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign  = 'right';
    ctx.fillText('reprise.app', W - PAD, H - PAD);

    // Rows — drawn top-down
    var y = PAD + 16 + 24;

    function rowLabel(text) {
      ctx.fillStyle    = '#444444';
      ctx.font         = '600 10px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(text, PAD, y);
      y += 16;
    }

    // Total concerts
    rowLabel(stats.year + ' · konser sayın');
    ctx.fillStyle    = '#C8FF00';
    ctx.font         = '900 60px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign    = 'left';
    ctx.fillText(String(stats.total), PAD, y);
    y += 64;
    ctx.fillStyle = '#555555';
    ctx.font      = '500 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('konser', PAD, y);
    y += 17 + ROW_GAP;

    // Average rating
    if (stats.avgRating && y < H - 80) {
      rowLabel('ortalama puan');
      ctx.fillStyle    = '#F5F3EF';
      ctx.font         = '800 28px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      var avgW = ctx.measureText(stats.avgRating).width;
      ctx.fillText(stats.avgRating, PAD, y);
      ctx.fillStyle = '#555555';
      ctx.font      = '500 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('/ 10', PAD + avgW + 6, y + 10);
      y += 32 + ROW_GAP;
    }

    // Best concert
    if (stats.best && y < H - 80) {
      rowLabel('en iyi konser');
      ctx.fillStyle    = '#F5F3EF';
      ctx.font         = '800 18px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      ctx.fillText((stats.best.artist || '').toLowerCase(), PAD, y);
      y += 22;
      var bestVenue = [stats.best.venue, stats.best.city].filter(Boolean).join(' · ');
      if (bestVenue) {
        ctx.fillStyle = '#555555';
        ctx.font      = '500 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(bestVenue, PAD, y);
        y += 17;
      }
      y += ROW_GAP;
    }

    // Unique artists
    if (stats.uniqueArtists > 1 && y < H - 80) {
      rowLabel('farklı sanatçı');
      ctx.fillStyle    = '#F5F3EF';
      ctx.font         = '800 28px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      ctx.fillText(String(stats.uniqueArtists), PAD, y);
      y += 32 + ROW_GAP;
    }

    // Top city
    if (stats.topCity && y < H - 60) {
      rowLabel('en çok gittiğin şehir');
      ctx.fillStyle    = '#F5F3EF';
      ctx.font         = '700 16px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      var cityName = (stats.topCity.name || '').toLowerCase();
      var cityW    = ctx.measureText(cityName).width;
      ctx.fillText(cityName, PAD, y);
      ctx.fillStyle = '#555555';
      ctx.font      = '500 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(stats.topCity.count + ' konser', PAD + cityW + 8, y + 2);
    }
  }

  // ── RENDER TO PNG ──────────────────────────────────────────────────────────
  function renderToPng(drawFn, ratio) {
    const SCALE = 3;
    const DIMS  = { story: { w: 360, h: 640 }, square: { w: 360, h: 360 } };
    const dim   = DIMS[ratio] || DIMS.story;

    const canvas  = document.createElement('canvas');
    canvas.width  = dim.w * SCALE;
    canvas.height = dim.h * SCALE;
    const ctx = canvas.getContext('2d');
    ctx.scale(SCALE, SCALE);

    drawFn(ctx, dim.w, dim.h);

    return canvas.toDataURL('image/png');
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  const ShareService = {

    async concertCard(concert, user, ratio) {
      ratio = ratio || 'story';
      return renderToPng(
        function(ctx, w, h) { drawConcertCard(ctx, w, h, concert, user, ratio); },
        ratio
      );
    },

    async wrappedCard(stats, user, ratio) {
      ratio = ratio || 'story';
      return renderToPng(
        function(ctx, w, h) { drawWrappedCard(ctx, w, h, stats, user); },
        ratio
      );
    },

    async shareOrDownload(dataUrl, filename) {
      if (navigator.share) {
        try {
          const blob = await fetch(dataUrl).then(function(r) { return r.blob(); });
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
