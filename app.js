// ── DATA ──
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
      { user: 'can.o',    img: 'https://i.pravatar.cc/32?img=20', score: '10', text: '"Hayatımın konseri. Thom Yorke sahneye çıktığında ağladım, itiraf ediyorum."' },
      { user: 'selin.k',  img: 'https://i.pravatar.cc/32?img=3',  score: '8.5', text: '"Ses sistemi biraz sorunluydu ama setlist mükemmeldi. Creep\'i çalmadılar, bence doğru karar."' },
      { user: 'ali.b',    img: 'https://i.pravatar.cc/32?img=8',  score: '9',   text: '"Karma, Pyramid Song, Everything in Its Right Place... Efsane."' },
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
      { name: 'zeynep.a', img: 'https://i.pravatar.cc/44?img=7'  },
    ],
    wanting: [
      { name: 'ali.b',    img: 'https://i.pravatar.cc/44?img=8'  },
      { name: 'naz.k',    img: 'https://i.pravatar.cc/44?img=44' },
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
      { name: 'selin.k',  img: 'https://i.pravatar.cc/44?img=3'  },
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

// ── USER PROFILES ──
const USERS = {
  'can.o': {
    username: 'can.o',
    bio: 'Konser bağımlısı. Rock ve elektronik.',
    avatar: 'https://i.pravatar.cc/80?img=20',
    cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=60',
    following: 84, followers: 210,
    concerts: 63, avgRating: 8.7, wishlist: 9,
    attended: [
      { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '10' },
      { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '8.5' },
      { img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=70', score: '9.3' },
    ]
  },
  'selin.k': {
    username: 'selin.k',
    bio: 'İndierock & dream pop. Her konserde ön sıra.',
    avatar: 'https://i.pravatar.cc/80?img=3',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=60',
    following: 102, followers: 178,
    concerts: 41, avgRating: 9.1, wishlist: 7,
    attended: [
      { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '9.2' },
      { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.5' },
    ]
  },
  'ali.b': {
    username: 'ali.b',
    bio: 'Müzik fotoğrafçısı. Sahnede ya da pit\'te.',
    avatar: 'https://i.pravatar.cc/80?img=8',
    cover: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=800&q=60',
    following: 55, followers: 320,
    concerts: 88, avgRating: 7.9, wishlist: 14,
    attended: [
      { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '9' },
      { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '9.2' },
      { img: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=70', score: '7.5' },
      { img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=70', score: '8.1' },
    ]
  },
  'deniz.y': {
    username: 'deniz.y',
    bio: 'Art pop ve ambient. Björk tanrıçam.',
    avatar: 'https://i.pravatar.cc/80?img=16',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=60',
    following: 67, followers: 89,
    concerts: 22, avgRating: 9.3, wishlist: 5,
    attended: [
      { img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=70', score: '9.5' },
    ]
  },
  'emre.t': {
    username: 'emre.t',
    bio: 'Jazz ve fusion. Sahne ışıklarına bayılıyorum.',
    avatar: 'https://i.pravatar.cc/80?img=25',
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=60',
    following: 38, followers: 51,
    concerts: 17, avgRating: 8.2, wishlist: 11,
    attended: [
      { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.9' },
      { img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=70', score: '9.1' },
    ]
  },
  'naz.k': {
    username: 'naz.k',
    bio: 'Trip-hop ve elektronik. Portishead ilk aşkım.',
    avatar: 'https://i.pravatar.cc/80?img=44',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=60',
    following: 44, followers: 72,
    concerts: 29, avgRating: 8.6, wishlist: 6,
    attended: [
      { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.9' },
      { img: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=70', score: '8.8' },
    ]
  },
  'mert.d': {
    username: 'mert.d',
    bio: 'Electronic & trip-hop. Massive Attack her yerde.',
    avatar: 'https://i.pravatar.cc/80?img=12',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=60',
    following: 91, followers: 143,
    concerts: 35, avgRating: 8.4, wishlist: 12,
    attended: [
      { img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=70', score: '8.1' },
    ]
  },
  'zeynep.a': {
    username: 'zeynep.a',
    bio: 'Alternative & shoegaze. Konser = terapi.',
    avatar: 'https://i.pravatar.cc/80?img=7',
    cover: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=800&q=60',
    following: 73, followers: 98,
    concerts: 38, avgRating: 8.0, wishlist: 8,
    attended: [
      { img: 'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=70', score: '7.5' },
      { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=70', score: '8.9' },
    ]
  },
  'burak.s': {
    username: 'burak.s',
    bio: 'Rock arşivci. Setlist koleksiyoncusu.',
    avatar: 'https://i.pravatar.cc/80?img=33',
    cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=60',
    following: 29, followers: 44,
    concerts: 52, avgRating: 7.8, wishlist: 3,
    attended: [
      { img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70', score: '8.5' },
      { img: 'https://images.unsplash.com/photo-1540039155733-5bb30b4bd1cd?w=200&q=70', score: '9.0' },
    ]
  },
};

// ── STATE ──
let currentStatus = null;
let currentRating = null;
let currentEvent = null;
let fcRating = null;
let currentDetailId = null;

// ── MY CONCERT HISTORY (localStorage) ──
const HISTORY_KEY = 'reprise_history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── COVER IMAGES (pool for user-added concerts) ──
const COVER_POOL = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=60',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=60',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=60',
  'https://images.unsplash.com/photo-1501386761578-eaa54b7c5b25?w=200&q=60',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=60',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=60',
  'https://images.unsplash.com/photo-1540039155733-5bb30b4bd1cd?w=200&q=60',
];

function getCoverImg(concert) {
  let hash = 0;
  const str = concert.artist || String(concert.id);
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return COVER_POOL[Math.abs(hash) % COVER_POOL.length];
}

// ── DATE HELPERS ──
function parseDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T12:00:00');
}

function formatMonth(dateStr) {
  if (!dateStr) return '—';
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const d = parseDate(dateStr);
  return d ? months[d.getMonth()] : '—';
}

function formatDay(dateStr) {
  if (!dateStr) return '—';
  const d = parseDate(dateStr);
  return d ? d.getDate() : '—';
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── PROFILE STATS ──
function refreshProfileStats() {
  const history = loadHistory();
  const count = history.length;
  const rated = history.filter(c => c.rating);
  const avg = rated.length
    ? (rated.reduce((s, c) => s + Number(c.rating), 0) / rated.length).toFixed(1)
    : '—';
  const el = id => document.getElementById(id);
  if (el('stat-concerts')) el('stat-concerts').textContent = count;
  if (el('stat-avg')) el('stat-avg').textContent = avg;
}

// ── RENDER ATTENDED GRID ──
function renderMyAttended() {
  const history = loadHistory();
  const grid = document.getElementById('my-attended-grid');
  const empty = document.getElementById('my-attended-empty');
  if (!grid) return;

  if (history.length === 0) {
    grid.innerHTML = '';
    if (empty) { empty.style.display = 'flex'; }
    return;
  }
  if (empty) { empty.style.display = 'none'; }

  const sorted = [...history].sort((a, b) => {
    const da = a.date ? new Date(a.date) : new Date(0);
    const db = b.date ? new Date(b.date) : new Date(0);
    return db - da;
  });

  grid.innerHTML = sorted.map(c => `
    <div class="cg-item my-concert-item" data-id="${c.id}">
      <div class="cg-img" style="background-image:url('${getCoverImg(c)}')"></div>
      ${c.rating ? `<span class="cg-score">${c.rating}</span>` : ''}
      <div class="cg-artist-label">${escapeHtml(c.artist)}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.my-concert-item').forEach(item => {
    item.addEventListener('click', () => openMyConcertDetail(Number(item.dataset.id)));
  });
}

// ── RENDER TIMELINE ──
function renderTimeline() {
  const container = document.getElementById('tab-timeline');
  if (!container) return;

  const history = loadHistory();

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p class="empty-title">Kronoloji boş</p>
        <p class="empty-sub">Konserlerini ekle, burada görünsün</p>
      </div>`;
    return;
  }

  const sorted = [...history].sort((a, b) => {
    const da = a.date ? new Date(a.date) : new Date(0);
    const db = b.date ? new Date(b.date) : new Date(0);
    return db - da;
  });

  const byYear = {};
  sorted.forEach(c => {
    const d = c.date ? parseDate(c.date) : null;
    const year = d ? d.getFullYear() : 'Tarihsiz';
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(c);
  });

  const years = Object.keys(byYear).sort((a, b) => {
    if (a === 'Tarihsiz') return 1;
    if (b === 'Tarihsiz') return -1;
    return Number(b) - Number(a);
  });

  container.innerHTML = years.map(year => `
    <div class="tl-year-group">
      <div class="tl-year-label">${year}</div>
      ${byYear[year].map(c => `
        <div class="tl-item" data-id="${c.id}">
          <div class="tl-date-col">
            <span class="tl-month">${formatMonth(c.date)}</span>
            <span class="tl-day">${formatDay(c.date)}</span>
          </div>
          <div class="tl-line-wrap"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-body">
            <p class="tl-artist">${escapeHtml(c.artist)}</p>
            ${[c.venue, c.city].filter(Boolean).length ? `<p class="tl-venue-city">${escapeHtml([c.venue, c.city].filter(Boolean).join(' · '))}</p>` : ''}
            ${c.rating ? `<span class="tl-score">${c.rating}</span>` : ''}
            ${c.notes ? `<p class="tl-notes">"${escapeHtml(c.notes)}"</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  container.querySelectorAll('.tl-item').forEach(item => {
    item.addEventListener('click', () => openMyConcertDetail(Number(item.dataset.id)));
  });
}

// ── ESCAPE HTML ──
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── MY CONCERT DETAIL ──
function openMyConcertDetail(id) {
  const history = loadHistory();
  const c = history.find(h => h.id === id);
  if (!c) return;
  currentDetailId = id;

  document.getElementById('mdo-artist').textContent = c.artist;
  document.getElementById('mdo-venue').textContent = [c.venue, c.city].filter(Boolean).join(' · ') || '';
  document.getElementById('mdo-date').textContent = formatFullDate(c.date);

  const scoreWrap = document.getElementById('mdo-score-wrap');
  scoreWrap.innerHTML = c.rating
    ? `<span class="mdo-score-pill">${c.rating}/10</span>`
    : '';

  const notesEl = document.getElementById('mdo-notes');
  notesEl.textContent = c.notes ? `"${c.notes}"` : '';
  notesEl.style.display = c.notes ? 'block' : 'none';

  document.getElementById('mdo-delete').onclick = () => deleteConcert(id);

  document.getElementById('my-detail-overlay').classList.add('open');
}

function closeMyConcertDetail() {
  document.getElementById('my-detail-overlay').classList.remove('open');
  currentDetailId = null;
}

function deleteConcert(id) {
  const history = loadHistory().filter(c => c.id !== id);
  saveHistory(history);
  closeMyConcertDetail();
  refreshProfileStats();
  renderMyAttended();
  renderTimeline();
  showToast('Konser silindi');
}

// ── ADD CONCERT FORM ──
function openAddConcert() {
  fcRating = null;
  const fields = ['fc-artist','fc-venue','fc-city','fc-notes'];
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const dateEl = document.getElementById('fc-date');
  if (dateEl) dateEl.value = '';
  const charEl = document.getElementById('fc-char-count');
  if (charEl) charEl.textContent = '0/280';
  const noteEl = document.getElementById('fc-rating-note');
  if (noteEl) noteEl.textContent = 'Puanlamak için dokunun';
  initFCRating();
  document.getElementById('add-concert-overlay').classList.add('open');
}

function closeAddConcert() {
  document.getElementById('add-concert-overlay').classList.remove('open');
}

function initFCRating() {
  const scale = document.getElementById('fc-rating-scale');
  if (!scale) return;
  scale.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rating-num';
    btn.textContent = i;
    btn.addEventListener('click', () => selectFCRating(i, btn));
    scale.appendChild(btn);
  }
}

function selectFCRating(num, btnEl) {
  fcRating = num;
  document.querySelectorAll('#fc-rating-scale .rating-num').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');
  const labels = {1:'Berbat',2:'Çok kötü',3:'Kötü',4:'Vasat',5:'Orta',6:'İyi sayılır',7:'İyi',8:'Çok iyi',9:'Harika',10:'Mükemmel!'};
  const noteEl = document.getElementById('fc-rating-note');
  if (noteEl) noteEl.textContent = `${num}/10 — ${labels[num]}`;
}

function saveNewConcert(e) {
  e.preventDefault();
  const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const artist = get('fc-artist');
  const date   = get('fc-date');
  if (!artist || !date) return;

  const concert = {
    id: Date.now(),
    artist,
    venue: get('fc-venue'),
    city:  get('fc-city'),
    date,
    rating: fcRating,
    notes:  get('fc-notes'),
    addedAt: new Date().toISOString(),
  };

  const history = loadHistory();
  history.push(concert);
  saveHistory(history);

  closeAddConcert();
  refreshProfileStats();
  renderMyAttended();
  renderTimeline();
  showToast(`"${artist}" eklendi!`);
}

function handleSheetBackdrop(event, overlayId) {
  if (event.target.id === overlayId) {
    if (overlayId === 'add-concert-overlay') closeAddConcert();
    if (overlayId === 'my-detail-overlay') closeMyConcertDetail();
  }
}

// ── SHARE PROFILE ──
async function shareProfile() {
  const history = loadHistory();
  const count = history.length;
  const rated = history.filter(c => c.rating);
  const avg = rated.length
    ? (rated.reduce((s, c) => s + Number(c.rating), 0) / rated.length).toFixed(1)
    : null;

  const text = (count > 0 ? count + " konser gördüm" + (avg ? ", ortalamam " + avg + "/10" : "") + ". " : "") + "Reprise'da konser geçmişimi takip ediyorum!";

  const shareData = {
    title: 'Reprise — Konser Geçmişim',
    text,
    url: 'https://volkanmuyan.github.io/reprise/',
  };

  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) {}
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text} ${shareData.url}`)
      .then(() => showToast('Kopyalandı!'));
  } else {
    showToast('reprise — volkanmuyan.github.io/reprise');
  }
}

// ── TOAST ──
function showToast(msg) {
  const existing = document.getElementById('reprise-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'reprise-toast';
  toast.className = 'toast';
  toast.textContent = msg;
  document.querySelector('.app-shell').appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ── NAVIGATION ──
function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');

  const map = { 'screen-home': 0, 'screen-search': 1, 'screen-activity': 2, 'screen-profile': 3 };
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  if (map[screenId] !== undefined) {
    document.querySelectorAll('.nav-item')[map[screenId]]?.classList.add('active');
  }

  const fab = document.getElementById('add-concert-fab');
  if (fab) fab.classList.toggle('visible', screenId === 'screen-profile');

  if (screenId === 'screen-profile') {
    refreshProfileStats();
    renderMyAttended();
    renderTimeline();
  }
}

// ── CHIP FILTER ──
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── TABS (activity screen) ──
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const tabs = this.closest('.tab-bar').querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── WANT TO GO TOGGLE (cards) ──
function toggleWant(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '✓ Listede' : '+ Listeme Ekle';
}

// ── OPEN EVENT ──
function openEvent(eventId) {
  const ev = EVENTS[eventId];
  if (!ev) return;
  currentEvent = eventId;
  currentStatus = null;
  currentRating = null;

  document.getElementById('eo-cover').style.backgroundImage = `url('${ev.cover}')`;
  document.getElementById('eo-title').textContent = ev.title;
  document.getElementById('eo-venue').textContent = ev.venue;
  document.getElementById('eo-date').textContent = ev.date;
  document.getElementById('eo-score').textContent = ev.score;

  ['sb-attended','sb-want','sb-notgoing'].forEach(id => {
    document.getElementById(id).className = 'status-btn';
  });

  const scale = document.getElementById('rating-scale');
  scale.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'rating-num';
    btn.textContent = i;
    btn.onclick = () => selectRating(i, btn);
    scale.appendChild(btn);
  }
  document.getElementById('rating-note').textContent = 'Dokunarak puan ver';
  document.getElementById('review-box').style.display = 'none';
  document.getElementById('metrics-section').style.display = 'none';

  document.querySelectorAll('.metric-dots').forEach(container => {
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'metric-dot';
      dot.addEventListener('click', () => selectMetric(container, i));
      container.appendChild(dot);
    }
  });

  const attGrid = document.getElementById('attendees-grid');
  attGrid.innerHTML = '';
  document.getElementById('att-count').textContent = `(${ev.attendees.length})`;
  ev.attendees.forEach(p => {
    const div = document.createElement('div');
    div.className = 'att-person';
    div.innerHTML = `<img src="${p.img}" alt=""><span>${p.name}</span>`;
    div.addEventListener('click', () => openProfile(p.name));
    attGrid.appendChild(div);
  });

  const wantGrid = document.getElementById('want-grid');
  wantGrid.innerHTML = '';
  document.getElementById('want-count').textContent = `(${ev.wanting.length})`;
  ev.wanting.forEach(p => {
    const div = document.createElement('div');
    div.className = 'att-person';
    div.innerHTML = `<img src="${p.img}" alt=""><span>${p.name}</span>`;
    div.addEventListener('click', () => openProfile(p.name));
    wantGrid.appendChild(div);
  });

  const revSec = document.getElementById('reviews-section');
  if (ev.reviews.length > 0) {
    revSec.innerHTML = `<h3 class="er-header section-mini-title">Yorumlar <span class="att-count">(${ev.reviews.length})</span></h3>`;
    ev.reviews.forEach(r => {
      const item = document.createElement('div');
      item.className = 'er-item';
      item.innerHTML = `
        <div class="er-top">
          <img src="${r.img}" alt="">
          <span class="er-user">${r.user}</span>
          <span class="er-score">${r.score}</span>
        </div>
        <p class="er-text">${r.text}</p>
      `;
      revSec.appendChild(item);
    });
  } else {
    revSec.innerHTML = '';
  }

  document.getElementById('event-overlay').classList.add('open');
  document.getElementById('event-overlay').scrollTop = 0;
}

function closeEvent() {
  document.getElementById('event-overlay').classList.remove('open');
}

// ── ATTENDEE PROFILE ──
function openProfile(username) {
  const u = USERS[username];
  if (!u) return;

  document.getElementById('po-cover').style.backgroundImage = `url('${u.cover}')`;
  document.getElementById('po-avatar').src = u.avatar;
  document.getElementById('po-name').textContent = u.username;
  document.getElementById('po-bio').textContent = u.bio;
  document.getElementById('po-follow').innerHTML = `<strong>${u.following}</strong> takip &nbsp; <strong>${u.followers}</strong> takipçi`;
  document.getElementById('po-concerts').textContent = u.concerts;
  document.getElementById('po-avg').textContent = u.avgRating;
  document.getElementById('po-want').textContent = u.wishlist;

  const grid = document.getElementById('po-grid');
  grid.innerHTML = '';
  u.attended.forEach(c => {
    const item = document.createElement('div');
    item.className = 'cg-item';
    item.innerHTML = `<div class="cg-img" style="background-image:url('${c.img}')"></div><span class="cg-score">${c.score}</span>`;
    grid.appendChild(item);
  });

  document.getElementById('profile-overlay').classList.add('open');
  document.getElementById('profile-overlay').scrollTop = 0;
}

function closeProfile() {
  document.getElementById('profile-overlay').classList.remove('open');
}

// ── STATUS ──
function setStatus(status) {
  currentStatus = status;
  ['sb-attended','sb-want','sb-notgoing'].forEach(id => {
    document.getElementById(id).className = 'status-btn';
  });

  const map = { attended: 'sb-attended', want: 'sb-want', notgoing: 'sb-notgoing' };
  const classMap = { attended: 'active-attended', want: 'active-want', notgoing: 'active-notgoing' };
  document.getElementById(map[status]).classList.add(classMap[status]);

  const ratingSection = document.getElementById('rating-section');
  const reviewBox = document.getElementById('review-box');
  const metricsSection = document.getElementById('metrics-section');

  if (status === 'attended') {
    ratingSection.style.display = 'block';
    reviewBox.style.display = 'block';
    metricsSection.style.display = 'block';
  } else if (status === 'want') {
    ratingSection.style.display = 'none';
    reviewBox.style.display = 'none';
    metricsSection.style.display = 'none';
  } else {
    ratingSection.style.display = 'block';
    reviewBox.style.display = 'none';
    metricsSection.style.display = 'none';
  }
}

// ── METRIC DOTS ──
function selectMetric(container, value) {
  const dots = container.querySelectorAll('.metric-dot');
  dots.forEach((d, i) => d.classList.toggle('filled', i < value));
}

// ── RATING ──
function selectRating(num, btnEl) {
  currentRating = num;
  document.querySelectorAll('.rating-num').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');
  const labels = {1:'Berbat',2:'Çok kötü',3:'Kötü',4:'Vasat',5:'Orta',6:'İyi sayılır',7:'İyi',8:'Çok iyi',9:'Harika',10:'Mükemmel!'};
  document.getElementById('rating-note').textContent = `${num}/10 — ${labels[num]}`;
}

// ── REVIEW CHAR COUNT ──
document.querySelectorAll('.review-textarea').forEach(ta => {
  ta.addEventListener('input', function() {
    const count = this.value.length;
    this.closest('.review-box').querySelector('.review-char').textContent = `${count}/280`;
  });
});

document.getElementById('fc-notes').addEventListener('input', function() {
  const charEl = document.getElementById('fc-char-count');
  if (charEl) charEl.textContent = `${this.value.length}/280`;
});

// ── REVIEW SUBMIT ──
document.querySelectorAll('.review-submit').forEach(btn => {
  btn.addEventListener('click', function() {
    const ta = this.closest('.review-box').querySelector('.review-textarea');
    if (ta.value.trim()) {
      ta.value = '';
      this.closest('.review-box').querySelector('.review-char').textContent = '0/280';
      this.textContent = 'Paylaşıldı!';
      this.style.background = '#4ECDC4';
      setTimeout(() => { this.textContent = 'Paylaş'; this.style.background = ''; }, 2000);
    }
  });
});

// ── PROFILE TABS ──
function switchProfileTab(btn, tabId) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById(tabId);
  if (content) content.classList.add('active');

  if (tabId === 'tab-attended') renderMyAttended();
  if (tabId === 'tab-timeline') renderTimeline();
}

// ── SWIPE TO CLOSE OVERLAYS ──
let touchStartY = 0;

const overlay = document.getElementById('event-overlay');
overlay.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
overlay.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dy > 80 && overlay.scrollTop === 0) closeEvent();
}, { passive: true });

const profileOverlay = document.getElementById('profile-overlay');
profileOverlay.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
profileOverlay.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dy > 80 && profileOverlay.scrollTop === 0) closeProfile();
}, { passive: true });

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  refreshProfileStats();
  renderMyAttended();
  renderTimeline();
});
