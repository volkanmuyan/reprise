'use strict';
const express   = require('express');
const axios     = require('axios');
const NodeCache = require('node-cache');
const router    = express.Router();

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';
const TM_KEY  = () => process.env.TICKETMASTER_API_KEY;

// Genres/sub-segments to exclude (classical, opera, theatre, ballet etc.)
const EXCLUDE_GENRES = new Set([
  'classical', 'opera', 'ballet', 'theatre', 'theater',
  'broadway', 'musical', 'drama', 'comedy', 'cirque du soleil',
  'classical/opera',
]);

function isMusic(ev) {
  const cls = ev.classifications?.[0];
  if (!cls) return true;
  const segment = (cls.segment?.name || '').toLowerCase();
  if (segment && segment !== 'music') return false;
  const genre = (cls.genre?.name || '').toLowerCase();
  if (EXCLUDE_GENRES.has(genre)) return false;
  const subGenre = (cls.subGenre?.name || '').toLowerCase();
  if (EXCLUDE_GENRES.has(subGenre)) return false;
  return true;
}

function mapEvent(ev) {
  return {
    id:       ev.id,
    name:     ev.name,
    date:     ev.dates?.start?.localDate,
    time:     ev.dates?.start?.localTime,
    venue:    ev._embedded?.venues?.[0]?.name,
    city:     ev._embedded?.venues?.[0]?.city?.name,
    url:      ev.url,
    image:    ev.images?.find(i => i.ratio === '16_9' && i.width >= 1024)?.url
           || ev.images?.find(i => i.ratio === '16_9')?.url
           || ev.images?.[0]?.url,
    priceMin: ev.priceRanges?.[0]?.min,
  };
}

const fmt = d => d.toISOString().slice(0, 19) + 'Z';

// ── Featured concerts (homepage) ─────────────
// GET /api/concerts/featured?country=TR
router.get('/featured', async (req, res) => {
  if (!TM_KEY()) return res.json([]);

  const { country = 'TR' } = req.query;
  const now        = new Date();
  const twoMonths  = new Date(now);
  twoMonths.setMonth(twoMonths.getMonth() + 2);

  const dayKey   = now.toISOString().slice(0, 10);
  const cacheKey = `featured:${country}:${dayKey}`;
  const cached   = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${TM_BASE}/events.json`, {
      params: {
        apikey:             TM_KEY(),
        countryCode:        country,
        classificationName: 'Music',
        size:               100,
        sort:               'date,asc',
        startDateTime:      fmt(now),
        endDateTime:        fmt(twoMonths),
      },
    });

    const seen   = new Set();
    const events = (data._embedded?.events || [])
      .filter(isMusic)
      .filter(ev => {
        const key = ev.name.toLowerCase().split(/[^a-zçğışöüa-z0-9]/)[0].trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(mapEvent);

    cache.set(cacheKey, events, 10800);
    res.json(events);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Ticketmaster error', detail: err.message });
  }
});

// ── Ankara-specific concerts ──────────────────
// GET /api/concerts/ankara
// Focuses on Ankara venues: IF Performance Hall, CerModern, AKM, etc.
router.get('/ankara', async (req, res) => {
  if (!TM_KEY()) return res.json([]);

  const cacheKey = `ankara:${new Date().toISOString().slice(0, 10)}`;
  const cached   = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const now       = new Date();
  const sixMonths = new Date(now);
  sixMonths.setMonth(sixMonths.getMonth() + 6);

  try {
    const { data } = await axios.get(`${TM_BASE}/events.json`, {
      params: {
        apikey:             TM_KEY(),
        countryCode:        'TR',
        city:               'Ankara',
        classificationName: 'Music',
        size:               50,
        sort:               'date,asc',
        startDateTime:      fmt(now),
        endDateTime:        fmt(sixMonths),
      },
    });

    const events = (data._embedded?.events || [])
      .filter(isMusic)
      .map(mapEvent);

    cache.set(cacheKey, events, 10800);
    res.json(events);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── Istanbul big acts ─────────────────────────
// GET /api/concerts/istanbul
router.get('/istanbul', async (req, res) => {
  if (!TM_KEY()) return res.json([]);

  const cacheKey = `istanbul:${new Date().toISOString().slice(0, 10)}`;
  const cached   = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const now       = new Date();
  const twoMonths = new Date(now);
  twoMonths.setMonth(twoMonths.getMonth() + 2);

  try {
    const { data } = await axios.get(`${TM_BASE}/events.json`, {
      params: {
        apikey:             TM_KEY(),
        countryCode:        'TR',
        city:               'Istanbul',
        classificationName: 'Music',
        size:               50,
        sort:               'date,asc',
        startDateTime:      fmt(now),
        endDateTime:        fmt(twoMonths),
      },
    });

    const seen   = new Set();
    const events = (data._embedded?.events || [])
      .filter(isMusic)
      .filter(ev => {
        const key = ev.name.toLowerCase().split(/[^a-zçğışöüa-z0-9]/)[0].trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(mapEvent);

    cache.set(cacheKey, events, 10800);
    res.json(events);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── Search concerts ──────────────────────────
// GET /api/concerts/search?artist=Radiohead&country=TR&size=10
router.get('/search', async (req, res) => {
  const { artist, country = 'TR', size = 10 } = req.query;
  if (!artist) return res.status(400).json({ error: 'artist param required' });
  if (!TM_KEY()) return res.status(503).json({ error: 'Ticketmaster not configured' });

  const cacheKey = `search:${artist}:${country}:${size}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${TM_BASE}/events.json`, {
      params: {
        apikey:             TM_KEY(),
        keyword:            artist,
        countryCode:        country,
        size:               Number(size),
        sort:               'date,asc',
        classificationName: 'Music',
      },
    });

    const events = (data._embedded?.events || [])
      .filter(isMusic)
      .map(mapEvent);

    cache.set(cacheKey, events);
    res.json(events);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Ticketmaster error', detail: err.message });
  }
});

// ── Recommendations ──────────────────────────
// GET /api/concerts/recommendations?artists=Radiohead,Portishead,Björk
router.get('/recommendations', async (req, res) => {
  if (!TM_KEY()) return res.json([]);

  const { artists, country = 'TR' } = req.query;
  if (!artists) return res.json([]);

  const names = artists.split(',').map(a => a.trim()).filter(Boolean).slice(0, 8);
  if (names.length === 0) return res.json([]);

  const cacheKey = `recs:${names.join(',').toLowerCase()}:${country}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const results = await Promise.allSettled(
      names.map(name =>
        axios.get(`${TM_BASE}/events.json`, {
          params: {
            apikey:             TM_KEY(),
            keyword:            name,
            countryCode:        country,
            size:               3,
            sort:               'date,asc',
            classificationName: 'Music',
          },
        }).then(r => ({
          artist: name,
          events: (r.data._embedded?.events || [])
            .filter(isMusic)
            .map(mapEvent),
        }))
      )
    );

    const recommendations = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(r => r.events.length > 0);

    cache.set(cacheKey, recommendations);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
