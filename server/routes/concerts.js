'use strict';
const express   = require('express');
const axios     = require('axios');
const NodeCache = require('node-cache');
const router    = express.Router();

// 1-hour cache for Ticketmaster results
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';
const TM_KEY  = () => process.env.TICKETMASTER_API_KEY;

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
// GET /api/concerts/recommendations
// Merges Spotify top+followed artists with Ticketmaster TR events.
// Requires Spotify to be connected (calls internal /api/spotify routes).
router.get('/recommendations', async (req, res) => {
  if (!TM_KEY()) return res.json([]); // backend not configured yet

  try {
    // Fetch Spotify artists from within the server (loopback call)
    const baseUrl   = `http://localhost:${process.env.PORT || 3001}`;
    const [topRes, followedRes] = await Promise.allSettled([
      axios.get(`${baseUrl}/api/spotify/top-artists`),
      axios.get(`${baseUrl}/api/spotify/followed-artists`),
    ]);

    const allArtists = [
      ...(topRes.status     === 'fulfilled' ? topRes.value.data     : []),
      ...(followedRes.status === 'fulfilled' ? followedRes.value.data : []),
    ];

    if (allArtists.length === 0) return res.json([]);

    // Deduplicate
    const unique = [...new Map(allArtists.map(a => [a.name.toLowerCase(), a])).values()];

    // Query Ticketmaster for each artist (top 5 to limit API usage)
    const top5 = unique.slice(0, 5);
    const results = await Promise.allSettled(
      top5.map(artist =>
        axios.get(`${TM_BASE}/events.json`, {
          params: {
            apikey:             TM_KEY(),
            keyword:            artist.name,
            countryCode:        'TR',
            size:               3,
            sort:               'date,asc',
            classificationName: 'Music',
          },
        }).then(r => ({
          artist: artist.name,
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

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
