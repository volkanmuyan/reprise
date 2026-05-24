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
// GET /api/concerts/featured?country=TR&size=12
router.get('/featured', async (req, res) => {
  if (!TM_KEY()) return res.json([]);

  const { country = 'TR', size = 12 } = req.query;
  const cacheKey = `featured:${country}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${TM_BASE}/events.json`, {
      params: {
        apikey:             TM_KEY(),
        countryCode:        country,
        classificationName: 'Music',
        size:               Number(size),
        sort:               'relevance,desc',
      },
    });

    const events = (data._embedded?.events || []).map(ev => ({
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
      currency: ev.priceRanges?.[0]?.currency || 'TRY',
    }));

    cache.set(cacheKey, events);
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
