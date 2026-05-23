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
  const HISTORY_KEY      = 'reprise_history';
  const COMMUNITY_KEY    = 'reprise_communities';

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

    // ── Spotify: connection status ──
    async spotifyStatus() {
      try {
        const res = await fetch(DataService.apiBase + '/spotify/status');
        return await res.json(); // { connected: bool }
      } catch { return { connected: false }; }
    },

    // ── Spotify: initiate OAuth ──
    spotifyConnect() {
      window.location.href = DataService.apiBase + '/spotify/auth';
    },

    // ── Spotify: top + followed artists ──
    async spotifyArtists() {
      try {
        const [topRes, followedRes] = await Promise.all([
          fetch(DataService.apiBase + '/spotify/top-artists'),
          fetch(DataService.apiBase + '/spotify/followed-artists'),
        ]);
        const top     = topRes.ok     ? await topRes.json()     : [];
        const followed = followedRes.ok ? await followedRes.json() : [];
        return { top, followed };
      } catch { return { top: [], followed: [] }; }
    },

    // ── Concert recommendations (proxied via backend) ──
    async getRecommendations() {
      try {
        const res = await fetch(DataService.apiBase + '/concerts/recommendations');
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
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
