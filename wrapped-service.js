/* ──────────────────────────────────────────
   REPRISE  —  Wrapped Service
   Yıl bazında konser istatistikleri hesaplar.
   Görselden tamamen bağımsız, saf veri servisi.
──────────────────────────────────────────── */
(function (global) {
  'use strict';

  function toYear(dateStr) {
    try { return new Date(dateStr + 'T12:00:00').getFullYear(); }
    catch { return null; }
  }

  function topEntry(concerts, key) {
    const counts = {};
    concerts.forEach(c => {
      const v = c[key];
      if (v) counts[v] = (counts[v] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? { name: top[0], count: top[1] } : null;
  }

  const WrappedService = {

    // Returns null if no concerts in year.
    compute(concerts, year) {
      const all = (concerts || []);
      const filtered = year
        ? all.filter(c => c.date && toYear(c.date) === Number(year))
        : all;

      if (!filtered.length) return null;

      const sorted = [...filtered].sort((a, b) => {
        const da = a.date ? new Date(a.date) : new Date(0);
        const db = b.date ? new Date(b.date) : new Date(0);
        return da - db;
      });

      const rated = filtered.filter(c => c.rating && !isNaN(Number(c.rating)));
      const avgRating = rated.length
        ? (rated.reduce((s, c) => s + Number(c.rating), 0) / rated.length).toFixed(1)
        : null;

      const best = rated.length
        ? rated.reduce((b, c) => Number(c.rating) > Number(b.rating) ? c : b)
        : null;

      const monthly = Array(12).fill(0);
      filtered.forEach(c => {
        if (c.date) {
          try { monthly[new Date(c.date + 'T12:00:00').getMonth()]++; }
          catch { /* skip */ }
        }
      });

      const artists = new Set(
        filtered.map(c => (c.artist || '').trim().toLowerCase()).filter(Boolean)
      );

      return {
        year:          Number(year) || null,
        total:         filtered.length,
        avgRating,
        best,
        topVenue:      topEntry(filtered, 'venue'),
        topCity:       topEntry(filtered, 'city'),
        uniqueArtists: artists.size,
        monthly,
        first: sorted[0]  || null,
        last:  sorted[sorted.length - 1] || null,
      };
    },

    // Years that have at least one concert, newest first.
    availableYears(concerts) {
      const ys = new Set();
      (concerts || []).forEach(c => {
        if (c.date) {
          const y = toYear(c.date);
          if (y) ys.add(y);
        }
      });
      return [...ys].sort((a, b) => b - a);
    },
  };

  global.WrappedService = WrappedService;

})(window);
