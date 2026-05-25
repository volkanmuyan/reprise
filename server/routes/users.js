'use strict';
const express = require('express');
const router  = express.Router();

// ── Persistent storage via GitHub Gist ────────────────────────────────────
// Set GITHUB_TOKEN (gist scope) and GITHUB_GIST_ID in Vercel env vars.
// Falls back to in-memory when not configured (lost on cold start).
const GH_TOKEN   = process.env.GITHUB_TOKEN;
const GH_GIST_ID = process.env.GITHUB_GIST_ID;

const GH_HEADERS = {
  Authorization: `Bearer ${GH_TOKEN}`,
  Accept:        'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
};

// In-memory fallback + warm cache
const memStore   = new Map();  // username.lower → entry
let   _gistCache = null;       // last successfully read list
let   _cacheAt   = 0;
const CACHE_TTL  = 30_000;     // 30 s

async function readGist() {
  if (!GH_TOKEN || !GH_GIST_ID) return null;
  if (_gistCache && Date.now() - _cacheAt < CACHE_TTL) return _gistCache;
  try {
    const res  = await fetch(`https://api.github.com/gists/${GH_GIST_ID}`, { headers: GH_HEADERS });
    if (!res.ok) return _gistCache;
    const data = await res.json();
    const raw  = data.files?.['users.json']?.content;
    _gistCache = raw ? JSON.parse(raw) : [];
    _cacheAt   = Date.now();
    return _gistCache;
  } catch { return _gistCache; }
}

async function writeGist(users) {
  if (!GH_TOKEN || !GH_GIST_ID) return;
  try {
    await fetch(`https://api.github.com/gists/${GH_GIST_ID}`, {
      method:  'PATCH',
      headers: GH_HEADERS,
      body:    JSON.stringify({ files: { 'users.json': { content: JSON.stringify(users) } } }),
    });
    _gistCache = users;
    _cacheAt   = Date.now();
  } catch { /* non-fatal */ }
}

// ── POST /api/users/register ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, displayName, bio, avatar } = req.body || {};
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'username required' });
  }
  const key   = username.toLowerCase().trim();
  if (!key)   return res.status(400).json({ error: 'username required' });

  const entry = {
    username:    username.trim(),
    displayName: String(displayName || username).trim(),
    bio:         String(bio || '').trim().slice(0, 200),
    avatar:      String(avatar || '').slice(0, 500),
    updatedAt:   Date.now(),
  };

  memStore.set(key, entry);

  const base = await readGist() ?? [...memStore.values()];
  const idx  = base.findIndex(u => u.username.toLowerCase() === key);
  if (idx >= 0) base[idx] = entry; else base.push(entry);
  await writeGist(base);

  res.json({ ok: true });
});

// ── GET /api/users/search?q= ──────────────────────────────────────────────
router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  if (!q) return res.json([]);

  const list = await readGist() ?? [...memStore.values()];

  const results = list
    .filter(u =>
      (u.username    || '').toLowerCase().includes(q) ||
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.bio         || '').toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map(({ username, displayName, bio, avatar }) => ({ username, displayName, bio, avatar }));

  res.json(results);
});

module.exports = router;
