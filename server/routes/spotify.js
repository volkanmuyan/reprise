'use strict';
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

const CLIENT_ID     = () => process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = () => process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI  = () => process.env.SPOTIFY_REDIRECT_URI;

// In-memory token store — replace with encrypted session / Redis in production
// Key: userId (hardcoded 'me' for single-user MVP)
const tokens = {};

function basicAuth() {
  return Buffer.from(`${CLIENT_ID()}:${CLIENT_SECRET()}`).toString('base64');
}

// ── Step 1: redirect → Spotify OAuth ─────────
// GET /api/spotify/auth
router.get('/auth', (req, res) => {
  if (!CLIENT_ID()) return res.status(503).json({ error: 'Spotify not configured' });

  const scopes = [
    'user-top-read',
    'user-follow-read',
  ].join(' ');

  const params = new URLSearchParams({
    client_id:     CLIENT_ID(),
    response_type: 'code',
    redirect_uri:  REDIRECT_URI(),
    scope:         scopes,
    state:         'reprise',
  });

  res.redirect('https://accounts.spotify.com/authorize?' + params);
});

// ── Step 2: OAuth callback ────────────────────
// GET /api/spotify/callback
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.status(400).json({ error });

  try {
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: REDIRECT_URI(),
      }),
      { headers: { Authorization: `Basic ${basicAuth()}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    tokens['me'] = {
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      expires_at:    Date.now() + data.expires_in * 1000,
    };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(frontendUrl + '?spotify=connected');
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed', detail: err.message });
  }
});

// ── Token refresh helper ──────────────────────
async function getAccessToken() {
  const t = tokens['me'];
  if (!t) throw Object.assign(new Error('Not authenticated'), { status: 401 });

  if (Date.now() > t.expires_at - 60_000) {
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'refresh_token', refresh_token: t.refresh_token }),
      { headers: { Authorization: `Basic ${basicAuth()}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    t.access_token = data.access_token;
    t.expires_at   = Date.now() + data.expires_in * 1000;
  }

  return t.access_token;
}

function authHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

// ── Connection status ────────────────────────
// GET /api/spotify/status
router.get('/status', (_req, res) => {
  res.json({ connected: !!tokens['me'] });
});

// ── Top artists ──────────────────────────────
// GET /api/spotify/top-artists
router.get('/top-artists', async (_req, res) => {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term',
      authHeader(token)
    );
    res.json(data.items.map(a => ({ id: a.id, name: a.name, genres: a.genres })));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Followed artists ─────────────────────────
// GET /api/spotify/followed-artists
router.get('/followed-artists', async (_req, res) => {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/following?type=artist&limit=50',
      authHeader(token)
    );
    res.json(data.artists.items.map(a => ({ id: a.id, name: a.name, genres: a.genres })));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
