// ── STATE ── (data lives in data-service.js → window.DataService)
let currentStatus = null;
let currentRating = null;
let currentEvent = null;
let fcRating = null;
let currentDetailId = null;
let currentCommunityId = null;

// ── ALIASES ── (convenience shortcuts to DataService)
const loadHistory  = ()  => DataService.getHistory();
const saveHistory  = (h) => DataService.saveHistory(h);
const getCoverImg  = (c) => DataService.getCoverImg(c);

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

// ── COMMUNITIES ──────────────────────────────────────────────────────────────

function renderCommunities(filter) {
  const grid = document.getElementById('community-grid');
  if (!grid) return;

  const all = DataService.getAllCommunities();
  const filtered = !filter || filter === 'all'
    ? all
    : all.filter(c => c.city === filter || c.genre === filter);

  grid.innerHTML = filtered.map(c => {
    const joined = DataService.isMember(c.id);
    return `
      <div class="community-card" onclick="openCommunity('${c.id}')">
        <div class="community-card-img" style="background-image:url('${c.cover}')"></div>
        <div class="community-card-overlay">
          <span class="community-genre-badge">${c.genre}</span>
        </div>
        <div class="community-card-body">
          <h4 class="community-card-name">${c.name}</h4>
          <p class="community-card-meta">${c.city} · ${c.memberCount} üye</p>
          <button class="community-card-join ${joined ? 'joined' : ''}"
            onclick="event.stopPropagation(); handleCardJoin(this, '${c.id}')">
            ${joined ? '✓ Üyesin' : '+ Katıl'}
          </button>
        </div>
      </div>`;
  }).join('');
}

function handleCardJoin(btn, id) {
  const joined = DataService.toggleMembership(id);
  btn.classList.toggle('joined', joined);
  btn.textContent = joined ? '✓ Üyesin' : '+ Katıl';
  refreshProfileCommunities();
  showToast(joined ? 'Sahneye katıldın!' : 'Sahneden ayrıldın');
}

function openCommunity(id) {
  const c = DataService.getCommunity(id);
  if (!c) return;
  currentCommunityId = id;

  document.getElementById('co-cover').style.backgroundImage = `url('${c.cover}')`;
  document.getElementById('co-name').textContent = c.name;
  document.getElementById('co-genre-city').textContent = `${c.city} · ${c.genre}`;
  document.getElementById('co-description').textContent = c.description;
  document.getElementById('co-member-count').textContent = c.memberCount + ' üye';

  updateCommunityJoinBtn();

  // Upcoming events
  const evGrid = document.getElementById('co-events-grid');
  evGrid.innerHTML = '';
  (c.upcomingEvents || []).forEach(evId => {
    const ev = DataService.getEvent(evId);
    if (!ev) return;
    const card = document.createElement('div');
    card.className = 'event-card';
    card.onclick = () => openEvent(evId);
    card.innerHTML = `
      <div class="event-card-img" style="background-image:url('${ev.cover}')"></div>
      <div class="event-card-body">
        <p class="card-venue">${ev.venue}</p>
        <h4 class="card-name">${ev.title}</h4>
        <p class="card-date">${ev.date}</p>
        <div class="card-footer">
          <span class="card-rating">${ev.score}</span>
        </div>
      </div>`;
    evGrid.appendChild(card);
  });

  // Recent activity
  const feed = document.getElementById('co-activity-feed');
  feed.innerHTML = (c.recentActivity || []).map(a => `
    <div class="activity-item">
      <img class="av" src="${a.img}" alt="">
      <div class="activity-info">
        <p><strong>${a.user}</strong> <span class="activity-label attended">${a.action}</span></p>
        <p class="activity-event">${a.event}</p>
        <div class="mini-stars"><span class="activity-time">${a.time}</span></div>
      </div>
    </div>`).join('');

  document.getElementById('community-overlay').classList.add('open');
  document.getElementById('community-overlay').scrollTop = 0;
}

function closeCommunity() {
  document.getElementById('community-overlay').classList.remove('open');
  currentCommunityId = null;
}

function updateCommunityJoinBtn() {
  if (!currentCommunityId) return;
  const btn = document.getElementById('co-join-btn');
  const joined = DataService.isMember(currentCommunityId);
  btn.textContent = joined ? '✓ Üyesin' : '+ Sahneye Katıl';
  btn.className = 'community-join-btn' + (joined ? ' joined' : '');
}

function toggleCurrentCommunity() {
  if (!currentCommunityId) return;
  const joined = DataService.toggleMembership(currentCommunityId);
  updateCommunityJoinBtn();
  renderCommunities();
  refreshProfileCommunities();
  showToast(joined ? 'Sahneye katıldın!' : 'Sahneden ayrıldın');
}

function refreshProfileCommunities() {
  const memberships = DataService.getMemberships();
  const wrap  = document.getElementById('profile-communities-wrap');
  const strip = document.getElementById('profile-communities-strip');
  const statEl = document.getElementById('stat-communities');

  if (statEl) statEl.textContent = memberships.length;
  if (!wrap || !strip) return;

  if (memberships.length === 0) {
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';
  strip.innerHTML = memberships.map(id => {
    const c = DataService.getCommunity(id);
    if (!c) return '';
    return `
      <div class="profile-community-chip" onclick="openCommunity('${c.id}')">
        <div class="pcc-img" style="background-image:url('${c.cover}')"></div>
        <span class="pcc-name">${c.name}</span>
      </div>`;
  }).join('');
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

  const map = { 'screen-home': 0, 'screen-search': 1, 'screen-communities': 2, 'screen-activity': 3, 'screen-profile': 4 };
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
    refreshProfileCommunities();
  }
  if (screenId === 'screen-communities') {
    renderCommunities();
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
  const ev = DataService.getEvent(eventId);
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
  const u = DataService.getUser(username);
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

// ── COMMUNITY CHIP FILTER ──
document.getElementById('community-chips')?.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.getElementById('community-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    renderCommunities(this.dataset.filter);
  });
});

// ── SWIPE TO CLOSE: community overlay ──
const communityOverlay = document.getElementById('community-overlay');
communityOverlay.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
communityOverlay.addEventListener('touchend', e => {
  if (e.changedTouches[0].clientY - touchStartY > 80 && communityOverlay.scrollTop === 0) closeCommunity();
}, { passive: true });

// ── AUTH ──
function initAuth() {
  const user = DataService.getCurrentUser();
  if (!user) {
    document.getElementById('auth-overlay').style.display = 'flex';
  } else {
    document.getElementById('auth-overlay').style.display = 'none';
    renderProfileHero(user);
  }
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('auth-tab-login').classList.toggle('active', isLogin);
  document.getElementById('auth-tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('auth-login-form').style.display  = isLogin ? 'flex' : 'none';
  document.getElementById('auth-signup-form').style.display = isLogin ? 'none'  : 'flex';
  document.getElementById('login-error').textContent  = '';
  document.getElementById('signup-error').textContent = '';
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  try {
    const user = DataService.login(username, password);
    document.getElementById('auth-overlay').style.display = 'none';
    renderProfileHero(user);
    showToast('Hoş geldin, ' + (user.displayName || user.username) + '!');
  } catch (err) {
    errEl.textContent = err.message;
  }
}

function handleSignup(e) {
  e.preventDefault();
  const username    = document.getElementById('signup-username').value;
  const displayName = document.getElementById('signup-displayname').value;
  const bio         = document.getElementById('signup-bio').value;
  const password    = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  try {
    const user = DataService.signup({ username, displayName, bio, password });
    document.getElementById('auth-overlay').style.display = 'none';
    renderProfileHero(user);
    showToast('Hesap oluşturuldu, hoş geldin ' + (user.displayName || user.username) + '!');
  } catch (err) {
    errEl.textContent = err.message;
  }
}

function renderProfileHero(user) {
  const avatarEl = document.getElementById('profile-my-avatar');
  const nameEl   = document.getElementById('profile-my-name');
  const bioEl    = document.getElementById('profile-my-bio');
  if (avatarEl) avatarEl.src = user.avatar || ('https://i.pravatar.cc/80?u=' + encodeURIComponent(user.username));
  if (nameEl)   nameEl.textContent = user.displayName || user.username;
  if (bioEl)    bioEl.textContent  = user.bio || '';
}

function openSettings() {
  const user = DataService.getCurrentUser();
  if (!user) return;
  const el = id => document.getElementById(id);
  el('settings-avatar').src      = user.avatar || '';
  el('settings-username').textContent   = user.displayName || user.username;
  el('settings-bio-preview').textContent = user.bio || '@' + user.username;
  el('settings-sheet').style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settings-sheet').style.display = 'none';
}

function confirmLogout() {
  closeSettings();
  DataService.spotifyDisconnect();
  DataService.logout();
  refreshSpotifyUI();
  document.getElementById('personal-feed-content').innerHTML = '';
  document.getElementById('auth-overlay').style.display = 'flex';
  navigate('screen-home');
  document.getElementById('profile-my-name').textContent = '—';
  document.getElementById('profile-my-bio').textContent  = '';
  document.getElementById('profile-my-avatar').src = 'https://i.pravatar.cc/80?img=15';
}

// ── ACTIVITY TABS ──
function switchActivityTab(btn, panelId) {
  document.querySelectorAll('#screen-activity .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.activity-tab-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'block';
  if (panelId === 'activity-personal') loadPersonalFeed();
}

// ── SPOTIFY UI ──
function refreshSpotifyUI() {
  const connected = DataService.spotifyIsConnected();
  const disco = document.getElementById('spotify-disconnected');
  const conn  = document.getElementById('spotify-connected');
  if (disco) disco.style.display = connected ? 'none'  : 'flex';
  if (conn)  conn.style.display  = connected ? 'flex' : 'none';
}

async function connectSpotify() {
  try {
    await DataService.spotifyConnect();
  } catch (e) {
    showToast('Spotify bağlanamadı: ' + e.message);
  }
}

function disconnectSpotify() {
  DataService.spotifyDisconnect();
  refreshSpotifyUI();
  document.getElementById('personal-feed-content').innerHTML = '';
  showToast('Spotify bağlantısı kesildi');
}

// ── PERSONAL FEED (Sana Özel) ──
async function loadPersonalFeed() {
  const container = document.getElementById('personal-feed-content');
  if (!container) return;

  if (!DataService.spotifyIsConnected()) {
    container.innerHTML = `
      <div class="empty-state" style="padding-top:48px">
        <svg class="empty-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <p class="empty-title">Spotify Bağlı Değil</p>
        <p class="empty-sub">Öneri görmek için profil sayfasından Spotify'ı bağla</p>
      </div>`;
    return;
  }

  container.innerHTML = renderRecsSkeletons();

  try {
    const artists = await DataService.spotifyGetArtists();
    if (artists.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding-top:48px"><p class="empty-title">Sanatçı bulunamadı</p><p class="empty-sub">Spotify geçmişinde sanatçı yok</p></div>';
      return;
    }
    const recs = await DataService.getRecommendations(artists);
    renderRecommendations(container, recs, artists);
  } catch (e) {
    container.innerHTML = `<div class="empty-state" style="padding-top:48px"><p class="empty-title">Hata oluştu</p><p class="empty-sub">${e.message}</p></div>`;
  }
}

function renderRecsSkeletons() {
  return Array.from({ length: 3 }, () => `
    <div class="rec-skeleton">
      <div class="rec-skeleton-img"></div>
      <div class="rec-skeleton-body">
        <div class="rec-skeleton-line wide"></div>
        <div class="rec-skeleton-line short"></div>
        <div class="rec-skeleton-line mid"></div>
      </div>
    </div>`).join('');
}

function renderRecommendations(container, recs, artists) {
  if (!recs || recs.length === 0) {
    const names = artists.slice(0, 3).join(', ');
    container.innerHTML = `
      <div class="empty-state" style="padding-top:48px">
        <svg class="empty-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p class="empty-title">Türkiye'de yakın konser yok</p>
        <p class="empty-sub">${names} için TR'de bilet bulunamadı</p>
      </div>`;
    return;
  }

  const html = recs.map(({ artist, events }) => `
    <div class="rec-artist-group">
      <div class="rec-artist-header">
        <span class="rec-artist-name">${artist}</span>
        <span class="rec-event-count">${events.length} konser</span>
      </div>
      ${events.map(ev => `
        <a class="rec-event-card" href="${ev.url}" target="_blank" rel="noopener">
          ${ev.image ? `<div class="rec-event-img" style="background-image:url('${ev.image}')"></div>` : ''}
          <div class="rec-event-info">
            <span class="rec-event-name">${ev.name}</span>
            <span class="rec-event-meta">${ev.date || ''}${ev.venue ? ' · ' + ev.venue : ''}${ev.city ? ', ' + ev.city : ''}</span>
          </div>
          <svg class="rec-event-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>`).join('')}
    </div>`).join('');

  container.innerHTML = `<div class="rec-header-row"><span class="rec-header-title">Sana Özel Konserler</span><span class="rec-header-sub">Spotify'dan ${artists.length} sanatçıya göre</span></div>${html}`;
}

// ── SPOTIFY CALLBACK (PKCE) ──
async function initSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const code  = params.get('code');
  const state = params.get('state');
  if (!code || state !== 'reprise-pkce') return;

  // Clean URL immediately so reloads don't retrigger
  window.history.replaceState({}, '', window.location.pathname);

  showToast('Spotify bağlanıyor…');
  try {
    await DataService.spotifyHandleCallback(code);
    refreshSpotifyUI();
    navigate('screen-activity');
    setTimeout(() => {
      const personalTab = document.querySelector('#screen-activity .tab:last-child');
      if (personalTab) switchActivityTab(personalTab, 'activity-personal');
    }, 200);
    showToast('Spotify bağlandı!');
  } catch (e) {
    showToast('Bağlantı hatası: ' + e.message);
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  refreshProfileStats();
  renderMyAttended();
  renderTimeline();
  refreshProfileCommunities();
  refreshSpotifyUI();
  initSpotifyCallback();
});
