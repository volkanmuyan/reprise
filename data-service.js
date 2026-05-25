/* ──────────────────────────────────────────
   REPRISE  —  Data Service (frontend)
   Tüm statik veri + localStorage + API proxy
   buradan erişilir. Gerçek API'ye geçince
   sadece bu dosya değişir.
────────────────────────────────────────── */
(function (global) {
  'use strict';

  // ── STATIC: EVENTS ──────────────────────
  const EVENTS = {
    'radiohead': {
      title: 'Radiohead',
      venue: 'Volkswagen Arena',
      date: '22 Mart 2025 · İstanbul',
      cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      score: '8.9',
      attendees: [
        { name: 'can.o',    img: 'https://i.pravatar.cc/44?img=20' },
        { name: 'selin.k',  img: 'https://i.pravatar.cc/44?img=3'  },
        { name: 'ali.b',    img: 'https://i.pravatar.cc/44?img=8'  },
        { name: 'deniz.y',  img: 'https://i.pravatar.cc/44?img=16' },
        { name: 'emre.t',   img: 'https://i.pravatar.cc/44?img=25' },
        { name: 'naz.k',    img: 'https://i.pravatar.cc/44?img=44' },
      ],
      wanting: [
        { name: 'mert.d',   img: 'https://i.pravatar.cc/44?img=12' },
        { name: 'zeynep.a', img: 'https://i.pravatar.cc/44?img=7'  },
        { name: 'burak.s',  img: 'https://i.pravatar.cc/44?img=33' },
      ],
      reviews: [
        { user: 'can.o',   img: 'https://i.pravatar.cc/32?img=20', score: '10',  text: '"Hayatımın konseri. Thom Yorke sahneye çıktığında ağladım, itiraf ediyorum."' },
        { user: 'selin.k', img: 'https://i.pravatar.cc/32?img=3',  score: '8.5', text: '"Ses sistemi biraz sorunluydu ama setlist mükemmeldi. Creep\'i çalmadılar, bence doğru karar."' },
        { user: 'ali.b',   img: 'https://i.pravatar.cc/32?img=8',  score: '9',   text: '"Karma, Pyramid Song, Everything in Its Right Place... Efsane."' },
      ]
    },
    'arcade-fire': {
      title: 'Arcade Fire',
      venue: 'Zorlu PSM',
      date: '10 Mart 2025 · İstanbul',
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      score: '9.2',
      attendees: [
        { name: 'selin.k',  img: 'https://i.pravatar.cc/44?img=3'  },
        { name: 'volkan.m', img: 'https://i.pravatar.cc/44?img=15' },
        { name: 'ali.b',    img: 'https://i.pravatar.cc/44?img=8'  },
      ],
      wanting: [
        { name: 'deniz.y', img: 'https://i.pravatar.cc/44?img=16' },
      ],
      reviews: [
        { user: 'selin.k',  img: 'https://i.pravatar.cc/32?img=3',  score: '9.2', text: '"Bu yılın en iyi konseri. Sahnede tam bir enerji patlaması."' },
        { user: 'volkan.m', img: 'https://i.pravatar.cc/32?img=15', score: '9.2', text: '"İlk şarkıdan son şarkıya tek bir nefes. Harika bir gece."' },
      ]
    },
    'massive-attack': {
      title: 'Massive Attack',
      venue: 'Ankara Arena',
      date: '15 Nisan 2025 · Ankara',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      score: '8.1',
      attendees: [],
      wanting: [
        { name: 'mert.d',   img: 'https://i.pravatar.cc/44?img=12' },
        { name: 'zeynep.a', img: 'https://i.pravatar.cc/44?img=7'  },
      ],
      reviews: []
    },
    'portishead': {
      title: 'Portishead',
      venue: 'Bostancı Gösteri Merkezi',
      date: '3 Mayıs 2025 · İstanbul',
      cover: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=800&q=80',
      score: '8.8',
      attendees: [
        { name: 'zeynep.a', img: 'https://i.pravatar.cc/44?img=7' },
      ],
      wanting: [
        { name: 'ali.b', img: 'https://i.pravatar.cc/44?img=8'  },
        { name: 'naz.k', img: 'https://i.pravatar.cc/44?img=44' },
      ],
      reviews: [
        { user: 'zeynep.a', img: 'https://i.pravatar.cc/32?img=7', score: '7.5', text: '"Sesi biraz kısıktı ama Beth Gibbons\'ın sesi seni büyülüyor."' },
      ]
    },
    'bjork': {
      title: 'Björk',
      venue: 'IF Performance Hall',
      date: '28 Mart 2025 · İzmir',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      score: '9.5',
      attendees: [
        { name: 'volkan.m', img: 'https://i.pravatar.cc/44?img=15' },
        { name: 'deniz.y',  img: 'https://i.pravatar.cc/44?img=16' },
      ],
      wanting: [
        { name: 'selin.k', img: 'https://i.pravatar.cc/44?img=3' },
      ],
      reviews: [
        { user: 'volkan.m', img: 'https://i.pravatar.cc/32?img=15', score: '9.5', text: '"Sesi, ışığı, her şeyiyle başka bir dünyaya açılan bir kapıydı."' },
      ]
    },
    'bonobo': {
      title: 'Bonobo',
      venue: 'Küçükçiftlik Park',
      date: '4 Nisan 2025 · İstanbul',
      cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
      score: '9.1',
      attendees: [],
      wanting: [
        { name: 'volkan.m', img: 'https://i.pravatar.cc/44?img=15' },
        { name: 'mert.d',   img: 'https://i.pravatar.cc/44?img=12' },
        { name: 'can.o',    img: 'https://i.pravatar.cc/44?img=20' },
      ],
      reviews: []
    },
    'thom-yorke': {
      title: 'Thom Yorke',
      venue: 'Zorlu PSM',
      date: '11 Nisan 2025 · İstanbul',
      cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b4bd1cd?w=800&q=80',
      score: '—',
      attendees: [],
      wanting: [
        { name: 'volkan.m', img: 'https://i.pravatar.cc/44?img=15' },
        { name: 'ali.b',    img: 'https://i.pravatar.cc/44?img=8'  },
      ],
      reviews: []
    }
  };

  // ── STATIC: USERS ────────────────────────
  const USERS = {
    'can.o': {
      username: 'can.o', bio: 'Konser bağımlısı. Rock ve elektronik.',
      avatar: 'https://i.pravatar.cc/80?img=20',
      cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=60',
      following: 84, followers: 210, concerts: 63, avgRating: 8.7, wishlist: 9,
      attended: [
        { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '10' },
        { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '8.5' },
        { img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=70', score: '9.3' },
      ]
    },
    'selin.k': {
      username: 'selin.k', bio: 'İndierock & dream pop. Her konserde ön sıra.',
      avatar: 'https://i.pravatar.cc/80?img=3',
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=60',
      following: 102, followers: 178, concerts: 41, avgRating: 9.1, wishlist: 7,
      attended: [
        { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '9.2' },
        { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.5' },
      ]
    },
    'ali.b': {
      username: 'ali.b', bio: 'Müzik fotoğrafçısı. Sahnede ya da pit\'te.',
      avatar: 'https://i.pravatar.cc/80?img=8',
      cover: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=800&q=60',
      following: 55, followers: 320, concerts: 88, avgRating: 7.9, wishlist: 14,
      attended: [
        { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '9'   },
        { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '9.2' },
        { img: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=70', score: '7.5' },
        { img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=70', score: '8.1' },
      ]
    },
    'deniz.y': {
      username: 'deniz.y', bio: 'Art pop ve ambient. Björk tanrıçam.',
      avatar: 'https://i.pravatar.cc/80?img=16',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=60',
      following: 67, followers: 89, concerts: 22, avgRating: 9.3, wishlist: 5,
      attended: [
        { img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=70', score: '9.5' },
      ]
    },
    'emre.t': {
      username: 'emre.t', bio: 'Jazz ve fusion. Sahne ışıklarına bayılıyorum.',
      avatar: 'https://i.pravatar.cc/80?img=25',
      cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=60',
      following: 38, followers: 51, concerts: 17, avgRating: 8.2, wishlist: 11,
      attended: [
        { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.9' },
        { img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=70', score: '9.1' },
      ]
    },
    'naz.k': {
      username: 'naz.k', bio: 'Trip-hop ve elektronik. Portishead ilk aşkım.',
      avatar: 'https://i.pravatar.cc/80?img=44',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=60',
      following: 44, followers: 72, concerts: 29, avgRating: 8.6, wishlist: 6,
      attended: [
        { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.9' },
        { img: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=70', score: '8.8' },
      ]
    },
    'mert.d': {
      username: 'mert.d', bio: 'Electronic & trip-hop. Massive Attack her yerde.',
      avatar: 'https://i.pravatar.cc/80?img=12',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=60',
      following: 91, followers: 143, concerts: 35, avgRating: 8.4, wishlist: 12,
      attended: [
        { img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=70', score: '8.1' },
      ]
    },
    'zeynep.a': {
      username: 'zeynep.a', bio: 'Alternative & shoegaze. Konser = terapi.',
      avatar: 'https://i.pravatar.cc/80?img=7',
      cover: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=800&q=60',
      following: 73, followers: 98, concerts: 38, avgRating: 8.0, wishlist: 8,
      attended: [
        { img: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=70', score: '7.5' },
        { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '8.9' },
      ]
    },
    'burak.s': {
      username: 'burak.s', bio: 'Rock arşivci. Setlist koleksiyoncusu.',
      avatar: 'https://i.pravatar.cc/80?img=33',
      cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=60',
      following: 29, followers: 44, concerts: 52, avgRating: 7.8, wishlist: 3,
      attended: [
        { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.5' },
        { img: 'https://images.unsplash.com/photo-1540039155733-5bb30b4bd1cd?w=200&q=70', score: '9.0' },
      ]
    },
  };

  // ── STATIC: COMMUNITIES ─────────────────
  const COMMUNITIES = [
    {
      id: 'istanbul-indie',
      name: 'İstanbul Indie',
      description: 'İstanbul\'un indie rock ve dream pop sahnesi. Her hafta yeni keşifler, her ay yeni konserler.',
      city: 'İstanbul', genre: 'Indie Rock', memberCount: 342,
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      upcomingEvents: ['arcade-fire', 'radiohead'],
      recentActivity: [
        { user: 'selin.k', img: 'https://i.pravatar.cc/40?img=3',  action: 'katıldı',       event: 'Arcade Fire',  time: '2s önce' },
        { user: 'can.o',   img: 'https://i.pravatar.cc/40?img=20', action: 'puan verdi',    event: 'Radiohead',    time: '1g önce' },
      ],
    },
    {
      id: 'ankara-elektronik',
      name: 'Ankara Elektronik',
      description: 'Ankara\'nın elektronik müzik ve trip-hop topluluğu. Sahne, ses ve atmosfer.',
      city: 'Ankara', genre: 'Electronic', memberCount: 189,
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      upcomingEvents: ['massive-attack'],
      recentActivity: [
        { user: 'mert.d', img: 'https://i.pravatar.cc/40?img=12', action: 'gitmek istiyor', event: 'Massive Attack', time: '5s önce' },
      ],
    },
    {
      id: 'trip-hop-sahne',
      name: 'Trip-Hop Sahne',
      description: 'Portishead, Massive Attack, Björk... Karanlık ve derin müziğin sevenler için.',
      city: 'Türkiye', genre: 'Trip-Hop', memberCount: 521,
      cover: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=800&q=80',
      upcomingEvents: ['portishead', 'massive-attack'],
      recentActivity: [
        { user: 'naz.k',    img: 'https://i.pravatar.cc/40?img=44', action: 'katıldı',   event: 'Portishead', time: '1g önce' },
        { user: 'zeynep.a', img: 'https://i.pravatar.cc/40?img=7',  action: 'puan verdi', event: 'Portishead', time: '2g önce' },
      ],
    },
    {
      id: 'art-pop-kollektif',
      name: 'Art Pop Kollektif',
      description: 'Björk, FKA Twigs, Grimes... Sanatın müzikle buluştuğu yer.',
      city: 'İzmir', genre: 'Art Pop', memberCount: 278,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      upcomingEvents: ['bjork'],
      recentActivity: [
        { user: 'deniz.y', img: 'https://i.pravatar.cc/40?img=16', action: 'katıldı', event: 'Björk', time: '3g önce' },
      ],
    },
    {
      id: 'electronic-beats',
      name: 'Electronic Beats',
      description: 'Bonobo, Four Tet, Jon Hopkins... Elektronik müziğin melodik ve organik yüzü.',
      city: 'İstanbul', genre: 'Electronic', memberCount: 412,
      cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
      upcomingEvents: ['bonobo', 'thom-yorke'],
      recentActivity: [
        { user: 'volkan.m', img: 'https://i.pravatar.cc/40?img=15', action: 'gitmek istiyor', event: 'Bonobo', time: '4s önce' },
        { user: 'can.o',    img: 'https://i.pravatar.cc/40?img=20', action: 'gitmek istiyor', event: 'Bonobo', time: '6s önce' },
      ],
    },
    {
      id: 'alternatif-istanbul',
      name: 'Alternatif İstanbul',
      description: 'İstanbul\'un alternatif ve shoegaze sahnesini takip edenler için buluşma noktası.',
      city: 'İstanbul', genre: 'Alternative', memberCount: 634,
      cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b4bd1cd?w=800&q=80',
      upcomingEvents: ['thom-yorke', 'radiohead'],
      recentActivity: [
        { user: 'ali.b',   img: 'https://i.pravatar.cc/40?img=8',  action: 'fotoğraf ekledi', event: 'Radiohead',  time: '1g önce' },
        { user: 'burak.s', img: 'https://i.pravatar.cc/40?img=33', action: 'yorum yaptı',     event: 'Thom Yorke', time: '2g önce' },
      ],
    },
  ];

  // ── STORAGE ──────────────────────────────
  const HISTORY_KEY       = 'reprise_history';
  const COMMUNITY_KEY     = 'reprise_communities';
  const SPOTIFY_TOKEN_KEY = 'reprise_spotify';
  const USER_KEY          = 'reprise_user';
  const ACCOUNTS_KEY      = 'reprise_accounts';
  const POSTS_KEY         = 'reprise_posts';
  const FOLLOWING_KEY     = 'reprise_following';

  // GitHub Pages redirect URI for PKCE
  const SPOTIFY_PKCE_REDIRECT = 'https://volkanmuyan.github.io/reprise';

  // ── PKCE helpers (private) ──
  function _pkceVerifier() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  async function _pkceChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  // ── COVER POOL ───────────────────────────
  const COVER_POOL = [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=60',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=60',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=60',
    'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=60',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=60',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=60',
    'https://images.unsplash.com/photo-1540039155733-5bb30b4bd1cd?w=200&q=60',
  ];

  // ── PUBLIC API ───────────────────────────
  const DataService = {

    // Backend base URL
    apiBase: (global.REPRISE_API_BASE) || 'https://reprise-api.vercel.app/api',

    // ── Concert data ──
    getEvent(id)     { return EVENTS[id] || null; },
    getAllEvents()    { return EVENTS; },
    getEventIds()    { return Object.keys(EVENTS); },

    // ── User data ──
    getUser(username) { return USERS[username] || null; },

    // ── Community data ──
    getCommunity(id)    { return COMMUNITIES.find(c => c.id === id) || null; },
    getAllCommunities()  { return COMMUNITIES; },

    // ── Community memberships (localStorage) ──
    getMemberships() {
      try { return JSON.parse(localStorage.getItem(COMMUNITY_KEY) || '[]'); }
      catch { return []; }
    },
    saveMemberships(ids) {
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(ids));
    },
    isMember(id) {
      return DataService.getMemberships().includes(id);
    },
    toggleMembership(id) {
      const current = DataService.getMemberships();
      const joined  = current.includes(id);
      DataService.saveMemberships(
        joined ? current.filter(x => x !== id) : [...current, id]
      );
      return !joined; // returns new state
    },

    // ── Personal history (localStorage) ──
    getHistory() {
      try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
      catch { return []; }
    },
    saveHistory(history) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    },

    // ── Cover image helper ──
    getCoverImg(concert) {
      let hash = 0;
      const str = concert.artist || String(concert.id);
      for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
      return COVER_POOL[Math.abs(hash) % COVER_POOL.length];
    },

    // ══════════════════════════════════════
    // SPOTIFY — PKCE (no client secret needed)
    // Tokens stored in localStorage, API calls
    // made directly to Spotify from the browser.
    // ══════════════════════════════════════

    spotifyIsConnected() {
      try {
        const t = JSON.parse(localStorage.getItem(SPOTIFY_TOKEN_KEY) || 'null');
        return !!(t && t.access_token);
      } catch { return false; }
    },

    spotifyGetStoredTokens() {
      try { return JSON.parse(localStorage.getItem(SPOTIFY_TOKEN_KEY) || 'null'); }
      catch { return null; }
    },

    spotifySaveTokens(tokens) {
      localStorage.setItem(SPOTIFY_TOKEN_KEY, JSON.stringify(tokens));
    },

    spotifyDisconnect() {
      localStorage.removeItem(SPOTIFY_TOKEN_KEY);
      sessionStorage.removeItem('spotify_verifier');
    },

    // Step 1 — fetch client ID from backend, generate PKCE challenge, redirect
    async spotifyConnect() {
      const cfg = await fetch(DataService.apiBase + '/spotify/config')
        .then(r => r.json()).catch(() => null);
      if (!cfg || !cfg.clientId) throw new Error('Spotify yapılandırılmamış');

      const verifier  = _pkceVerifier();
      const challenge = await _pkceChallenge(verifier);
      sessionStorage.setItem('spotify_verifier', verifier);

      const params = new URLSearchParams({
        client_id:             cfg.clientId,
        response_type:         'code',
        redirect_uri:          SPOTIFY_PKCE_REDIRECT,
        scope:                 'user-top-read user-follow-read',
        code_challenge_method: 'S256',
        code_challenge:        challenge,
        state:                 'reprise-pkce',
      });
      window.location.href = 'https://accounts.spotify.com/authorize?' + params;
    },

    // Step 2 — called on page load when ?code= is in the URL
    async spotifyHandleCallback(code) {
      const verifier = sessionStorage.getItem('spotify_verifier');
      if (!verifier) throw new Error('Verifier bulunamadı');

      const cfg = await fetch(DataService.apiBase + '/spotify/config')
        .then(r => r.json()).catch(() => null);
      if (!cfg || !cfg.clientId) throw new Error('Config alınamadı');

      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id:     cfg.clientId,
          grant_type:    'authorization_code',
          code,
          redirect_uri:  SPOTIFY_PKCE_REDIRECT,
          code_verifier: verifier,
        }),
      });
      if (!res.ok) throw new Error('Token alınamadı: ' + res.status);

      const data = await res.json();
      DataService.spotifySaveTokens({
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
        expires_at:    Date.now() + data.expires_in * 1000,
      });
      sessionStorage.removeItem('spotify_verifier');
    },

    // Get a valid access token, refreshing if needed
    async spotifyAccessToken() {
      const t = DataService.spotifyGetStoredTokens();
      if (!t) throw new Error('Spotify bağlı değil');

      if (Date.now() > t.expires_at - 60_000) {
        const cfg = await fetch(DataService.apiBase + '/spotify/config')
          .then(r => r.json()).catch(() => null);
        if (!cfg || !cfg.clientId) throw new Error('Config alınamadı');

        const res = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id:     cfg.clientId,
            grant_type:    'refresh_token',
            refresh_token: t.refresh_token,
          }),
        });
        if (!res.ok) { DataService.spotifyDisconnect(); throw new Error('Refresh başarısız'); }
        const data = await res.json();
        t.access_token = data.access_token;
        t.expires_at   = Date.now() + data.expires_in * 1000;
        DataService.spotifySaveTokens(t);
      }
      return t.access_token;
    },

    // Fetch top + followed artists directly from Spotify
    async spotifyGetArtists() {
      const token = await DataService.spotifyAccessToken();
      const headers = { Authorization: 'Bearer ' + token };

      const [topRes, followedRes] = await Promise.allSettled([
        fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', { headers }),
        fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', { headers }),
      ]);

      const top = topRes.status === 'fulfilled' && topRes.value.ok
        ? (await topRes.value.json()).items || [] : [];
      const followed = followedRes.status === 'fulfilled' && followedRes.value.ok
        ? (await followedRes.value.json()).artists?.items || [] : [];

      const all = [...top, ...followed];
      const unique = [...new Map(all.map(a => [a.name.toLowerCase(), a.name])).values()];
      return unique; // string[]
    },

    // ── Concert recommendations via backend (Ticketmaster) ──
    async getRecommendations(artistNames) {
      if (!artistNames || artistNames.length === 0) return [];
      try {
        const params = new URLSearchParams({ artists: artistNames.slice(0, 8).join(',') });
        const res = await fetch(DataService.apiBase + '/concerts/recommendations?' + params);
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
    },

    // ══════════════════════════════════════
    // AUTH — client-side localStorage accounts
    // ══════════════════════════════════════

    getCurrentUser() {
      try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
      catch { return null; }
    },

    saveCurrentUser(user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    logout() {
      localStorage.removeItem(USER_KEY);
    },

    _getAccounts() {
      try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); }
      catch { return []; }
    },

    login(username, password) {
      const accounts = DataService._getAccounts();
      const account  = accounts.find(a => a.username.toLowerCase() === username.toLowerCase().trim());
      if (!account)               throw new Error('Kullanıcı bulunamadı');
      if (account.password !== password) throw new Error('Şifre hatalı');
      const user = { username: account.username, displayName: account.displayName, bio: account.bio, avatar: account.avatar };
      DataService.saveCurrentUser(user);
      DataService._syncUserToBackend(user);
      return user;
    },

    signup({ username, displayName, bio, password }) {
      username = (username || '').trim();
      displayName = (displayName || '').trim();
      bio = (bio || '').trim();
      if (!username)    throw new Error('Kullanıcı adı gerekli');
      if (!displayName) throw new Error('Adın gerekli');
      if (!password)    throw new Error('Şifre gerekli');
      if (/\s/.test(username)) throw new Error('Kullanıcı adında boşluk olamaz');
      if (username.length < 3) throw new Error('Kullanıcı adı en az 3 karakter olmalı');
      if (password.length < 4) throw new Error('Şifre en az 4 karakter olmalı');
      const accounts = DataService._getAccounts();
      if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase())) throw new Error('Bu kullanıcı adı alınmış');
      const avatar  = 'https://i.pravatar.cc/80?u=' + encodeURIComponent(username);
      const account = { username, displayName, bio, password, avatar };
      accounts.push(account);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      const user = { username, displayName, bio, avatar };
      DataService.saveCurrentUser(user);
      DataService._syncUserToBackend(user);
      return user;
    },

    updateCurrentUser(updates) {
      const user = DataService.getCurrentUser();
      if (!user) return null;
      const updated = { ...user, ...updates };
      DataService.saveCurrentUser(updated);
      // sync back into accounts store
      try {
        const accounts = DataService._getAccounts();
        const idx = accounts.findIndex(a => a.username === user.username);
        if (idx >= 0) {
          accounts[idx] = { ...accounts[idx], ...updates };
          localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        }
      } catch (e) {}
      return updated;
    },

    // ── Posts ──
    getPosts() {
      try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]'); }
      catch { return []; }
    },
    addPost({ imageData, caption }) {
      const posts = DataService.getPosts();
      const post  = { id: Date.now().toString(), imageData, caption: caption || '', date: new Date().toISOString() };
      posts.unshift(post);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return post;
    },
    deletePost(id) {
      const posts = DataService.getPosts().filter(p => p.id !== id);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    },

    // ── Featured concerts (homepage) ──
    async getFeaturedConcerts({ country = 'TR', size = 12 } = {}) {
      try {
        const params = new URLSearchParams({ country, size });
        const res = await fetch(DataService.apiBase + '/concerts/featured?' + params);
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
    },

    async getAnkaraConcerts() {
      try {
        const res = await fetch(DataService.apiBase + '/concerts/ankara');
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
    },

    async getIstanbulConcerts() {
      try {
        const res = await fetch(DataService.apiBase + '/concerts/istanbul');
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
    },

    // ── Setlist.fm search ──
    async searchSetlists({ artist, city = '', year = '' } = {}) {
      try {
        const params = new URLSearchParams({ artist });
        if (city) params.set('city', city);
        if (year) params.set('year', year);
        const res = await fetch(DataService.apiBase + '/setlists/search?' + params);
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
    },

    // ── Follow system (localStorage) ──
    getFollowing() {
      try { return JSON.parse(localStorage.getItem(FOLLOWING_KEY) || '[]'); }
      catch { return []; }
    },
    saveFollowing(list) {
      localStorage.setItem(FOLLOWING_KEY, JSON.stringify(list));
    },
    isFollowing(username) {
      return DataService.getFollowing().includes(username);
    },
    followUser(username) {
      const list = DataService.getFollowing();
      if (!list.includes(username)) {
        list.push(username);
        DataService.saveFollowing(list);
      }
    },
    unfollowUser(username) {
      DataService.saveFollowing(DataService.getFollowing().filter(u => u !== username));
    },
    toggleFollow(username) {
      const following = DataService.isFollowing(username);
      if (following) DataService.unfollowUser(username);
      else DataService.followUser(username);
      return !following;
    },

    // Search both real accounts and static mock users
    async searchUsers(query) {
      const q = (query || '').toLowerCase().trim();
      if (!q) return [];
      const currentUser     = DataService.getCurrentUser();
      const currentUsername = (currentUser?.username || '').toLowerCase();

      const fromAccounts = DataService._getAccounts()
        .filter(a => a.username.toLowerCase() !== currentUsername)
        .filter(a =>
          a.username.toLowerCase().includes(q) ||
          (a.displayName || '').toLowerCase().includes(q)
        )
        .map(a => ({
          username:    a.username,
          displayName: a.displayName || a.username,
          bio:         a.bio || '',
          avatar:      a.avatar || `https://i.pravatar.cc/80?u=${encodeURIComponent(a.username)}`,
        }));

      const localSet = new Set(fromAccounts.map(a => a.username.toLowerCase()));

      // Query backend for cross-device discovery
      let fromBackend = [];
      try {
        const res = await fetch(DataService.apiBase + '/users/search?q=' + encodeURIComponent(q));
        if (res.ok) {
          const data = await res.json();
          fromBackend = data
            .filter(u => u.username.toLowerCase() !== currentUsername)
            .filter(u => !localSet.has(u.username.toLowerCase()))
            .map(u => ({
              username:    u.username,
              displayName: u.displayName || u.username,
              bio:         u.bio || '',
              avatar:      u.avatar || `https://i.pravatar.cc/80?u=${encodeURIComponent(u.username)}`,
            }));
        }
      } catch { /* backend unavailable — graceful degrade */ }

      const combined = new Set();
      const results  = [];
      for (const u of [...fromAccounts, ...fromBackend]) {
        const key = u.username.toLowerCase();
        if (!combined.has(key)) { combined.add(key); results.push(u); }
      }

      // Also include matching static mock users not already in results
      for (const u of Object.values(USERS)) {
        if (results.length >= 20) break;
        const key = u.username.toLowerCase();
        if (key === currentUsername || combined.has(key)) continue;
        if (u.username.toLowerCase().includes(q) || (u.bio || '').toLowerCase().includes(q)) {
          combined.add(key);
          results.push({ username: u.username, displayName: u.username, bio: u.bio || '', avatar: u.avatar || '' });
        }
      }

      return results.slice(0, 20);
    },

    // Fire-and-forget: register/update a user's public profile in the backend directory
    _syncUserToBackend(user) {
      if (!user || !user.username) return;
      fetch(DataService.apiBase + '/users/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username:    user.username,
          displayName: user.displayName || user.username,
          bio:         user.bio || '',
          avatar:      user.avatar || '',
        }),
      }).catch(() => {});  // ignore network errors silently
    },

    // Returns all browseable users (static mocks + local accounts), excluding self
    getDefaultUsers() {
      const currentUser     = DataService.getCurrentUser();
      const currentUsername = (currentUser?.username || '').toLowerCase();
      const fromAccounts = DataService._getAccounts()
        .filter(a => a.username.toLowerCase() !== currentUsername)
        .map(a => ({
          username:    a.username,
          displayName: a.displayName || a.username,
          bio:         a.bio || '',
          avatar:      a.avatar || `https://i.pravatar.cc/80?u=${encodeURIComponent(a.username)}`,
        }));
      const realSet    = new Set(fromAccounts.map(a => a.username.toLowerCase()));
      const fromStatic = Object.values(USERS)
        .filter(u => u.username.toLowerCase() !== currentUsername)
        .filter(u => !realSet.has(u.username.toLowerCase()))
        .map(u => ({
          username:    u.username,
          displayName: u.username,
          bio:         u.bio || '',
          avatar:      u.avatar || '',
        }));
      return [...fromAccounts, ...fromStatic];
    },

    // ── Concert search (Ticketmaster via backend) ──
    async searchConcerts({ artist, country = 'TR', size = 10 } = {}) {
      try {
        const params = new URLSearchParams({ artist, country, size });
        const res = await fetch(DataService.apiBase + '/concerts/search?' + params);
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
    },
  };

  global.DataService = DataService;

})(window);
