'use strict';
const express   = require('express');
const axios     = require('axios');
const NodeCache = require('node-cache');
const router    = express.Router();

// 1-hour cache for Ticketmaster results
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';
const TM_KEY  = () => process.env.TICKETMASTER_API_KEY;

// ── Featured concerts (homepage) ─────────────
// GET /api/concerts/featured?country=TR
router.get('/featured', async (req, res) => {
  if (!TM_KEY()) return res.json([]);

  const { country = 'TR' } = req.query;

  const now = new Date();
  const twoMonths = new Date(now);
  twoMonths.setMonth(twoMonths.getMonth() + 2);

  const fmt = d => d.toISOString().slice(0, 19) + 'Z';

  // Cache key includes date so it refreshes daily
  const dayKey    = now.toISOString().slice(0, 10);
  const cacheKey  = `featured:${country}:${dayKey}`;
  const cached    = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${TM_BASE}/events.json`, {
      params: {
        apikey:             TM_KEY(),
        countryCode:        country,
        classificationName: 'Music',
        size:               50,
        sort:               'date,asc',
        startDateTime:      fmt(now),
        endDateTime:        fmt(twoMonths),
      },
    });

    const seen   = new Set();
    const events = (data._embedded?.events || [])
      .filter(ev => {
        // deduplicate by artist name so same act doesn't repeat
        const key = ev.name.toLowerCase().split(/[^a-zçğışöü]/)[0].trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(ev => ({
        id:       ev.id,
        name:     ev.name,
        date:     ev.dates?.start?.localDate,
        venue:    ev._embedded?.venues?.[0]?.name,
        city:     ev._embedded?.venues?.[0]?.city?.name,
        url:      ev.url,
        image:    ev.images?.find(i => i.ratio === '16_9' && i.width >= 1024)?.url
               || ev.images?.find(i => i.ratio === '16_9')?.url
               || ev.images?.[0]?.url,
        priceMin: ev.priceRanges?.[0]?.min,
      }));

    cache.set(cacheKey, events, 10800); // 3-hour cache
    res.json(events);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Ticketmaster error', detail: err.message });
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

    const events = (data._embedded?.events || []).map(ev => ({
      id:    ev.id,
      name:  ev.name,
      date:  ev.dates?.start?.localDate,
      time:  ev.dates?.start?.localTime,
      venue: ev._embedded?.venues?.[0]?.name,
      city:  ev._embedded?.venues?.[0]?.city?.name,
      url:   ev.url,
      image: ev.images?.find(i => i.ratio === '16_9')?.url || ev.images?.[0]?.url,
    }));

    cache.set(cacheKey, events);
    res.json(events);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Ticketmaster error', detail: err.message });
  }
});

// ── Recommendations ──────────────────────────
// GET /api/concerts/recommendations?artists=Radiohead,Portishead,Björk
// Frontend sends artist names from Spotify PKCE tokens; backend queries Ticketmaster.
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
          events: (r.data._embedded?.events || []).map(ev => ({
            id:    ev.id,
            name:  ev.name,
            date:  ev.dates?.start?.localDate,
            venue: ev._embedded?.venues?.[0]?.name,
            city:  ev._embedded?.venues?.[0]?.city?.name,
            url:   ev.url,
            image: ev.images?.find(i => i.ratio === '16_9')?.url || ev.images?.[0]?.url,
          })),
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
