'use strict';
const express = require('express');
const router  = express.Router();

// In-memory user directory.
// Persists within a warm Vercel instance; add Vercel KV for full persistence.
const directory = new Map();  // key: username.toLowerCase()

// POST /api/users/register
router.post('/register', (req, res) => {
  const { username, displayName, bio, avatar } = req.body || {};
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'username required' });
  }
  const key = username.toLowerCase().trim();
  if (!key) return res.status(400).json({ error: 'username required' });

  directory.set(key, {
    username:    username.trim(),
    displayName: String(displayName || username).trim(),
    bio:         String(bio || '').trim().slice(0, 200),
    avatar:      String(avatar || '').slice(0, 500),
    updatedAt:   Date.now(),
  });
  res.json({ ok: true });
});

// GET /api/users/search?q=
router.get('/search', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  if (!q) return res.json([]);

  const results = [];
  for (const [, user] of directory) {
    if (
      user.username.toLowerCase().includes(q) ||
      (user.displayName || '').toLowerCase().includes(q) ||
      (user.bio || '').toLowerCase().includes(q)
    ) {
      results.push({
        username:    user.username,
        displayName: user.displayName,
        bio:         user.bio,
        avatar:      user.avatar,
      });
      if (results.length >= 20) break;
    }
  }
  res.json(results);
});

module.exports = router;
