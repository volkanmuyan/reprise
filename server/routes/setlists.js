'use strict';
const express   = require('express');
const axios     = require('axios');
const NodeCache = require('node-cache');
const router    = express.Router();

const cache  = new NodeCache({ stdTTL: 86400, checkperiod: 3600 }); // 24h — setlists don't change
const SF_KEY = () => process.env.SETLIST_FM_API_KEY;
const SF_BASE = 'https://api.setlist.fm/rest/1.0';

const sfHeaders = () => ({
  'x-api-key': SF_KEY(),
  'Accept':    'application/json',
});

// Parse setlist.fm date "dd-MM-yyyy" → "yyyy-MM-dd"
function parseDate(d) {
  if (!d) return '';
  const [day, mon, yr] = d.split('-');
  return `${yr}-${mon}-${day}`;
}

function mapSetlist(s) {
  const songs = (s.sets?.set || [])
    .flatMap(set => set.song || [])
    .map(song => song.name)
    .filter(Boolean);

  return {
    id:       s.id,
    artist:   s.artist?.name || '',
    venue:    s.venue?.name  || '',
    city:     s.venue?.city?.name || '',
    country:  s.venue?.city?.country?.code || '',
    date:     parseDate(s.eventDate),
    songs,
    url:      s.url || '',
  };
}

// ── Search setlists ────────────────────────────────────────────────────────────
// GET /api/setlists/search?artist=Radiohead&city=Istanbul&year=2019
router.get('/search', async (req, res) => {
  if (!SF_KEY()) return res.status(503).json({ error: 'Setlist.fm not configured' });

  const { artist, city, year } = req.query;
  if (!artist) return res.status(400).json({ error: 'artist param required' });

  const cacheKey = `search:${artist}:${city || ''}:${year || ''}`.toLowerCase();
  const cached   = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const params = { artistName: artist, p: 1 };
    if (city)  params.cityName = city;
    if (year)  params.year     = year;

    const { data } = await axios.get(`${SF_BASE}/search/setlists`, {
      params,
      headers: sfHeaders(),
    });

    const results = (data.setlist || []).slice(0, 12).map(mapSetlist);
    cache.set(cacheKey, results);
    res.json(results);
  } catch (err) {
    const status = err.response?.status || 500;
    if (status === 404) return res.json([]);
    res.status(status).json({ error: err.message });
  }
});

// ── Recent setlists for an artist ─────────────────────────────────────────────
// GET /api/setlists/artist?name=Radiohead&country=TR
router.get('/artist', async (req, res) => {
  if (!SF_KEY()) return res.status(503).json({ error: 'Setlist.fm not configured' });

  const { name, country } = req.query;
  if (!name) return res.status(400).json({ error: 'name param required' });

  const cacheKey = `artist:${name}:${country || ''}`.toLowerCase();
  const cached   = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    // First resolve artist to mbid via search
    const { data: aData } = await axios.get(`${SF_BASE}/search/artists`, {
      params: { artistName: name, p: 1, sort: 'relevance' },
      headers: sfHeaders(),
    });

    const artist = aData.artist?.[0];
    if (!artist) return res.json([]);

    const params = { p: 1 };
    if (country) params.countryCode = country;

    const { data } = await axios.get(`${SF_BASE}/artist/${artist.mbid}/setlists`, {
      params,
      headers: sfHeaders(),
    });

    const results = (data.setlist || []).slice(0, 10).map(mapSetlist);
    cache.set(cacheKey, results, 3600); // 1h for artist page
    res.json(results);
  } catch (err) {
    const status = err.response?.status || 500;
    if (status === 404) return res.json([]);
    res.status(status).json({ error: err.message });
  }
});

module.exports = router;
