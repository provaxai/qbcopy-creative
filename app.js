/* ── Prova X – Shared Application Logic ── */

// ── AUTH ────────────────────────────────────────
const Auth = {
  key: 'pvx_user',
  login(userData) {
    localStorage.setItem(this.key, JSON.stringify(userData));
  },
  logout() {
    localStorage.removeItem(this.key);
    window.location.href = 'index.html';
  },
  getUser() {
    const s = localStorage.getItem(this.key);
    return s ? JSON.parse(s) : null;
  },
  isLoggedIn() {
    return !!this.getUser();
  },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html?next=' + encodeURIComponent(window.location.href);
    }
  },
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = 'dashboard.html';
    }
  }
};

// ── SIDEBAR ─────────────────────────────────────
function renderSidebar(activePage) {
  const user = Auth.getUser();
  if (!user) return;

  const isPro = user.plan === 'pro' || user.plan === 'diamond';

  const tools = [
    { id: 'dashboard',  icon: '🏠', label: 'Dashboard',              href: 'dashboard.html' },
    { id: 'cursos',     icon: '📚', label: 'Cursos',                  href: 'cursos-app.html' },
    { id: 'edital',    icon: '📋', label: 'Edital Verticalizado',     href: 'edital.html',         pro: false },
    { id: 'resumo',     icon: '📝', label: 'Resumo Inteligente',       href: 'resumo.html',        pro: false },
    { id: 'chat',       icon: '💬', label: 'Chat IA',                 href: 'chat.html',           pro: false },
    { id: 'pdf',        icon: '📄', label: 'PDF IA',                  href: 'pdf-ia.html',         pro: false },
    { id: 'flashcards', icon: '🃏', label: 'Flashcards',              href: 'flashcards.html',     pro: false },
    { id: 'esquema',    icon: '🗺️', label: 'Esquema IA',              href: 'esquema.html',        pro: false },
    { id: 'legis',      icon: '⚖️', label: 'Legis',                  href: 'legis.html',          pro: false },
    { id: 'discursiva', icon: '✍️', label: 'Treinador de Discursiva', href: 'discursiva.html',     pro: false },
    { id: 'oral',       icon: '🎤', label: 'Prova Oral',              href: 'prova-oral.html',     pro: false },
  ];

  const avatarLetter = (user.name || user.email || 'U')[0].toUpperCase();
  const planLabel = user.plan === 'diamond' ? '⭐ Diamond' : user.plan === 'pro' ? '🥇 Gold Pro' : '🆓 Gratuito';

  const linksHtml = tools.map(t => `
    <a href="${t.href}" class="sidebar-link ${activePage === t.id ? 'active' : ''}">
      <span class="icon">${t.icon}</span>
      ${t.label}
      ${t.pro && !isPro ? '<span class="badge-pro">PRO</span>' : ''}
    </a>
  `).join('');

  const html = `
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">⚡</div>
      Prova X
    </div>
    <div class="sidebar-user">
      <div class="sidebar-avatar">${avatarLetter}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${user.name || user.email}</div>
        <div class="sidebar-user-plan">${planLabel}</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Menu</div>
      ${linksHtml}
    </nav>
    ${!isPro ? `
    <div class="sidebar-upgrade">
      <p><strong>Desbloqueie tudo!</strong><br>Acesse todas as ferramentas IA sem limites.</p>
      <a href="upgrade.html" class="btn btn-accent btn-sm btn-full">Ver Planos →</a>
    </div>
    ` : ''}
    <div class="sidebar-footer">
      <button class="sidebar-logout" onclick="Auth.logout()">
        🚪 Sair da conta
      </button>
    </div>
  `;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = html;

  // topbar user info
  const topUser = document.getElementById('topbar-user');
  if (topUser) topUser.textContent = user.name || user.email;
}

// ── MOBILE SIDEBAR TOGGLE ───────────────────────
function initSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

// ── COUNTDOWN ───────────────────────────────────
function initCountdown(targetDate) {
  function update() {
    const diff = targetDate - Date.now();
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2,'0');
    const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setEl('cd-d', pad(d)); setEl('cd-h', pad(h)); setEl('cd-m', pad(m)); setEl('cd-s', pad(s));
  }
  update();
  setInterval(update, 1000);
}

// ── FAQ ACCORDION ───────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const body = item.querySelector('.faq-a');
      const isOpen = q.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-q').forEach(x => {
        x.classList.remove('open');
        x.parentElement.querySelector('.faq-a').classList.remove('open');
      });
      if (!isOpen) {
        q.classList.add('open');
        body.classList.add('open');
      }
    });
  });
}

// ── PUB NAV ACTIVE ──────────────────────────────
function setNavActive() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.pub-nav .nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.style.color = 'var(--text)';
  });
}
