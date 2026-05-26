/* =====================================================
   QURBANI FOR ALLAH — script.js
   Author: Tahsin Jawad
   ===================================================== */

'use strict';

// ===== APP STATE =====
let appState = {
  expense: {
    animal: 0, butcher: 0, transport: 0, extra: 0,
    shares: 1, contributors: []
  },
  recipients: [],
  activities: []
};

// ===== LOCALSTORAGE =====
const STORAGE_KEY = 'qurbani_for_allah_v1';

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      appState = { ...appState, ...parsed };
    }
  } catch (e) {
    console.warn('State load failed:', e);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initLoadingScreen();
  initNavigation();
  initTheme();
  initCountdown();
  initExpenseForm();
  initDistributionForm();
  initMasail();
  refreshAllUI();
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
  const screen = document.getElementById('loadingScreen');
  setTimeout(() => {
    screen.classList.add('gone');
    document.body.style.overflow = '';
  }, 2800);
  document.body.style.overflow = 'hidden';
}

// ===== NAVIGATION =====
let currentSection = 'dashboard';

function initNavigation() {
  // Desktop nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.dataset.section;
      navigateTo(sec);
      // Close mobile nav if open
      document.getElementById('mobileNav').classList.remove('open');
    });
  });

  // Mobile nav links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });

  // Hamburger
  document.getElementById('navHamburger').addEventListener('click', () => {
    const mn = document.getElementById('mobileNav');
    mn.style.display = mn.style.display === 'flex' ? 'none' : 'flex';
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    nb.style.background = window.scrollY > 60
      ? 'rgba(8,15,11,0.95)'
      : 'rgba(8,15,11,0.75)';
  });
}

function navigateTo(section) {
  currentSection = section;

  // Hide hero
  const hero = document.getElementById('heroSection');
  if (section !== 'hero') {
    hero.style.display = 'none';
  }

  // Toggle sections
  document.querySelectorAll('.app-section').forEach(s => {
    s.classList.toggle('hidden', s.id !== section);
  });

  // Update nav active state
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === section);
  });

  // Scroll to top of section
  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Refresh relevant UI
  if (section === 'dashboard') refreshDashboard();
  if (section === 'summary')   refreshSummary();
}

// Global helper for hero buttons
window.scrollToSection = function(section) {
  navigateTo(section);
};

// ===== THEME =====
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('qurbani_theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(current);
    localStorage.setItem('qurbani_theme', current);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== EID COUNTDOWN =====
function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  // Eid ul-Adha 2026: May 28, 2026 — Bangladesh Standard Time (UTC+6)
  // In UTC that is May 27, 2026 18:00 UTC
  const target = new Date('2026-05-28T00:00:00+06:00');
  const now    = new Date();
  const diff   = target - now;

  if (diff <= 0) {
    document.getElementById('cdDays').textContent  = '0';
    document.getElementById('cdHours').textContent = '0';
    document.getElementById('cdMins').textContent  = '0';
    document.getElementById('cdSecs').textContent  = '0';
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  document.getElementById('cdDays').textContent  = days;
  document.getElementById('cdHours').textContent = hours;
  document.getElementById('cdMins').textContent  = mins;
  document.getElementById('cdSecs').textContent  = secs;
}

// ===== BANGLA NUMBER CONVERTER =====
function n {
  const digits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(n).split('').map(d => digits[+d] ?? d).join('');
}

function formatTaka(n) {
  if (n === 0) return '৳ 0';
  return '৳ ' + Math.round(n).toLocaleString('en-IN');
}

// ===== EXPENSE FORM =====
let selectedShares = 1;
let liveExpense = { animal: 0, butcher: 0, transport: 0, extra: 0 };

function initExpenseForm() {
  // Share buttons
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedShares = parseInt(btn.dataset.val);
      document.querySelectorAll('.share-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildContributorInputs(selectedShares);
      recalcLive();
    });
  });

  // Set default active
  document.querySelector('.share-btn[data-val="1"]').classList.add('active');
  buildContributorInputs(1);

  // Number inputs live update
  ['animalCost','butcherCost','transportCost','extraCost'].forEach(id => {
    document.getElementById(id).addEventListener('input', recalcLive);
  });

  // Save
  document.getElementById('saveExpenseBtn').addEventListener('click', saveExpense);
  document.getElementById('clearExpenseBtn').addEventListener('click', clearExpenseForm);
}

function buildContributorInputs(count) {
  const list = document.getElementById('contributorsList');
  list.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'contributor-input-wrap';
    wrap.innerHTML = `
      <div class="contributor-num">${i + 1}</div>
      <input class="contributor-field" type="text"
        placeholder="Shareholder ${i + 1} name..."
        data-idx="${i}"
        value="${appState.expense.contributors[i] || ''}" />
    `;
    list.appendChild(wrap);
  }
}

function recalcLive() {
  liveExpense.animal    = parseFloat(document.getElementById('animalCost').value)    || 0;
  liveExpense.butcher   = parseFloat(document.getElementById('butcherCost').value)   || 0;
  liveExpense.transport = parseFloat(document.getElementById('transportCost').value) || 0;
  liveExpense.extra     = parseFloat(document.getElementById('extraCost').value)     || 0;

  const total  = liveExpense.animal + liveExpense.butcher + liveExpense.transport + liveExpense.extra;
  const perPer = selectedShares > 0 ? total / selectedShares : 0;

  document.getElementById('lt_animal').textContent    = formatTaka(liveExpense.animal);
  document.getElementById('lt_butcher').textContent   = formatTaka(liveExpense.butcher);
  document.getElementById('lt_transport').textContent = formatTaka(liveExpense.transport);
  document.getElementById('lt_extra').textContent     = formatTaka(liveExpense.extra);
  document.getElementById('lt_total').textContent     = formatTaka(total);
  document.getElementById('lt_per').textContent       = formatTaka(perPer);
}

function saveExpense() {
  const a = parseFloat(document.getElementById('animalCost').value)    || 0;
  const b = parseFloat(document.getElementById('butcherCost').value)   || 0;
  const t = parseFloat(document.getElementById('transportCost').value) || 0;
  const e = parseFloat(document.getElementById('extraCost').value)     || 0;
  const total = a + b + t + e;

  if (total === 0) {
    showToast('Please add at least one expense!', 'error', 'fas fa-exclamation-circle');
    return;
  }

  // Collect contributor names
  const names = [];
  document.querySelectorAll('.contributor-field').forEach(inp => names.push(inp.value.trim()));

  appState.expense = {
    animal: a, butcher: b, transport: t, extra: e,
    shares: selectedShares, contributors: names,
    savedAt: new Date().toLocaleString('en-GB')
  };

  addActivity('fas fa-coins', `Total ৳${Math.round(total)} expense saved`);
  saveState();
  refreshAllUI();
  showToast('Expense saved successfully!', 'success', 'fas fa-check-circle');
}

function clearExpenseForm() {
  ['animalCost','butcherCost','transportCost','extraCost'].forEach(id => {
    document.getElementById(id).value = '';
  });
  selectedShares = 1;
  document.querySelectorAll('.share-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.share-btn[data-val="1"]').classList.add('active');
  buildContributorInputs(1);
  recalcLive();
}

function renderSavedExpense() {
  const el = document.getElementById('savedExpenseDisplay');
  const exp = appState.expense;
  const total = (exp.animal || 0) + (exp.butcher || 0) + (exp.transport || 0) + (exp.extra || 0);

  if (total === 0) {
    el.innerHTML = '<div class="empty-state"><i class="fas fa-file-invoice"></i><p>Nothing saved yet</p></div>';
    return;
  }

  const per = exp.shares ? total / exp.shares : 0;
  const rows = [
    ['Animal Cost', formatTaka(exp.animal || 0)],
    ['Butcher Fee', formatTaka(exp.butcher || 0)],
    ['Transport', formatTaka(exp.transport || 0)],
    ['Additional', formatTaka(exp.extra || 0)],
  ];

  el.innerHTML = rows.map(([l, v]) =>
    `<div class="sed-row"><span>${l}</span><span>${v}</span></div>`
  ).join('') +
    `<div class="sed-row bold"><span>Total</span><span>${formatTaka(total)}</span></div>
     <div class="sed-row bold"><span>Per Shareholder (${exp.shares || 1})</span><span>${formatTaka(per)}</span></div>`;
}

// ===== DISTRIBUTION FORM =====
let selectedCategory = 'family';

function initDistributionForm() {
  // Category buttons
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.cat;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Add recipient
  document.getElementById('addRecipientBtn').addEventListener('click', addRecipient);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecipients(btn.dataset.filter);
    });
  });
}

function addRecipient() {
  const name  = document.getElementById('recipientName').value.trim();
  const share = parseFloat(document.getElementById('meatShare').value) || 0;
  const status = document.getElementById('initialStatus').value;
  const note  = document.getElementById('recipientNote').value.trim();

  if (!name) {
    showToast('Please enter a name!', 'error', 'fas fa-exclamation-circle');
    return;
  }

  const recipient = {
    id:       Date.now(),
    name,
    category: selectedCategory,
    share,
    status,
    note,
    addedAt:  new Date().toLocaleString('en-GB')
  };

  appState.recipients.push(recipient);
  addActivity('fas fa-drumstick-bite', `"${name}" added to the recipient list`);
  saveState();
  refreshAllUI();

  // Reset form
  document.getElementById('recipientName').value  = '';
  document.getElementById('meatShare').value      = '';
  document.getElementById('recipientNote').value  = '';
  document.getElementById('initialStatus').value  = 'pending';

  showToast('Recipient added!', 'success', 'fas fa-check-circle');
  renderRecipients('all');
}

const catLabels = {
  family: 'Family', relatives: 'Relatives',
  neighbours: 'Neighbours', needy: 'Needy'
};
const catIcons = {
  family: 'fas fa-home', relatives: 'fas fa-users',
  neighbours: 'fas fa-house-user', needy: 'fas fa-hand-holding-heart'
};
const statusLabels = { pending: '🔴 Pending', partial: '🟡 Partial', done: '🟢 Done' };
const statusClass  = { pending: 'status-pending', partial: 'status-partial', done: 'status-done' };

function renderRecipients(filter = 'all') {
  const list = document.getElementById('recipientsList');
  let items = appState.recipients;
  if (filter !== 'all') items = items.filter(r => r.category === filter);

  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty-state large-empty">
        <i class="fas fa-drumstick-bite"></i>
        <p>${filter === 'all' ? 'No recipients added yet' : 'No one in this category'}</p>
        <small>Use the form on the left to add recipients</small>
      </div>`;
    return;
  }

  list.innerHTML = items.map(r => `
    <div class="recipient-card" data-id="${r.id}">
      <div class="rc-cat-icon cat-${r.category}">
        <i class="${catIcons[r.category]}"></i>
      </div>
      <div class="rc-info">
        <div class="rc-name">${r.name}</div>
        <div class="rc-meta">
          <span>${catLabels[r.category]}</span>
          ${r.share ? `<span>• ${r.share} kg</span>` : ''}
          <span>• ${r.addedAt}</span>
        </div>
        ${r.note ? `<div class="rc-note">${r.note}</div>` : ''}
      </div>
      <div class="rc-status-wrap">
        <span class="status-badge ${statusClass[r.status]}">${statusLabels[r.status]}</span>
        <div class="rc-actions">
          <button class="rc-action-btn" onclick="cycleStatus(${r.id})" title="Change Status">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button class="rc-action-btn rc-del-btn" onclick="deleteRecipient(${r.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>`).join('');
}

window.cycleStatus = function(id) {
  const cycle = { pending: 'partial', partial: 'done', done: 'pending' };
  const r = appState.recipients.find(x => x.id === id);
  if (!r) return;
  r.status = cycle[r.status];
  addActivity('fas fa-sync-alt', `"${r.name}" status updated to "${statusLabels[r.status]}"`);
  saveState();
  refreshAllUI();
  renderRecipients(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
};

window.deleteRecipient = function(id) {
  const r = appState.recipients.find(x => x.id === id);
  if (!r) return;
  appState.recipients = appState.recipients.filter(x => x.id !== id);
  addActivity('fas fa-trash', `"${r.name}" removed from the list`);
  saveState();
  refreshAllUI();
  renderRecipients(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  showToast('Recipient removed', 'info', 'fas fa-info-circle');
};

// ===== MASAIL =====
function initMasail() {
  document.querySelectorAll('.masail-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.parentElement;
      const wasOpen = card.classList.contains('open');
      // Close all
      document.querySelectorAll('.masail-card').forEach(c => c.classList.remove('open'));
      // Open clicked if was not open
      if (!wasOpen) card.classList.add('open');
    });
  });

  // Search
  document.getElementById('masailSearch').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.masail-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
}

// ===== ACTIVITY LOG =====
function addActivity(icon, text) {
  appState.activities.unshift({
    icon, text,
    time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
  });
  if (appState.activities.length > 20) appState.activities = appState.activities.slice(0, 20);
}

// ===== REFRESH ALL UI =====
function refreshAllUI() {
  refreshHeroStats();
  refreshDashboard();
  renderSavedExpense();
  renderRecipients('all');
  updateStatusSummaryBar();
}

function refreshHeroStats() {
  const exp   = appState.expense;
  const total = (exp.animal || 0) + (exp.butcher || 0) + (exp.transport || 0) + (exp.extra || 0);
  const done  = appState.recipients.filter(r => r.status === 'done').length;
  const pct   = appState.recipients.length ? Math.round(done / appState.recipients.length * 100) : 0;

  animateValue('heroTotalExpense', total, v => formatTaka(v));
  document.getElementById('heroShareCount').textContent = exp.shares || 0;
  document.getElementById('heroDelivered').textContent  = pct  + '%';
}

function refreshDashboard() {
  const exp   = appState.expense;
  const total = (exp.animal || 0) + (exp.butcher || 0) + (exp.transport || 0) + (exp.extra || 0);
  const shares = exp.shares || 1;
  const per    = shares > 0 && total > 0 ? total / shares : 0;
  const done   = appState.recipients.filter(r => r.status === 'done').length;
  const pct    = appState.recipients.length ? Math.round(done / appState.recipients.length * 100) : 0;

  // KPI
  document.getElementById('kpiTotalExpense').textContent = formatTaka(total);
  document.getElementById('kpiShareCount').textContent   = exp.shares || 0 ;
  document.getElementById('kpiRecipients').textContent   = appState.recipients.length ;
  document.getElementById('kpiCompleted').textContent    = done ;

  // Per share
  document.getElementById('dashPerShare').textContent = formatTaka(per);

  // Contributor breakdown
  const breakdown = document.getElementById('dashShareBreakdown');
  if (exp.contributors && exp.contributors.some(c => c)) {
    breakdown.innerHTML = exp.contributors.map((name, i) => `
      <div class="share-breakdown-item">
        <span class="sbi-name">${name || `Shareholder ${i + 1}`}</span>
        <span class="sbi-amt">${formatTaka(per)}</span>
      </div>`).join('');
  } else {
    breakdown.innerHTML = '';
  }

  // Progress ring
  const offset = 364 - (364 * pct / 100);
  document.getElementById('ringFill').style.strokeDashoffset = offset;
  document.getElementById('ringPercent').textContent = pct  + '%';

  // Expense bars
  renderExpenseBars(exp, total);

  // Activity feed
  renderActivityFeed();

  updateStatusSummaryBar();
}

function renderExpenseBars(exp, total) {
  const container = document.getElementById('expenseBars');
  if (total === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-receipt"></i><p>No expenses added yet</p></div>';
    return;
  }

  const items = [
    ['Animal Cost', exp.animal || 0],
    ['Butcher Fee', exp.butcher || 0],
    ['Transport', exp.transport || 0],
    ['Additional', exp.extra || 0],
  ];

  container.innerHTML = items.map(([label, val]) => {
    const pct = total > 0 ? Math.round(val / total * 100) : 0;
    return `
      <div class="expense-bar-item">
        <div class="eb-label">
          <span>${label}</span>
          <span>${formatTaka(val)} (${pct}%)</span>
        </div>
        <div class="eb-track">
          <div class="eb-fill" style="width: ${pct}%"></div>
        </div>
      </div>`;
  }).join('');
}

function renderActivityFeed() {
  const feed = document.getElementById('activityFeed');
  if (!appState.activities.length) {
    feed.innerHTML = '<div class="empty-state"><i class="fas fa-bell-slash"></i><p>No activity yet</p></div>';
    return;
  }
  feed.innerHTML = appState.activities.slice(0, 8).map(a => `
    <div class="activity-item">
      <i class="${a.icon} ai-icon"></i>
      <div>
        <div class="ai-text">${a.text}</div>
        <div class="ai-time">${a.time}</div>
      </div>
    </div>`).join('');
}

function updateStatusSummaryBar() {
  const pending = appState.recipients.filter(r => r.status === 'pending').length;
  const partial = appState.recipients.filter(r => r.status === 'partial').length;
  const done    = appState.recipients.filter(r => r.status === 'done').length;
  const total   = appState.recipients.length;

  document.getElementById('ssbPending').textContent = pending;
  document.getElementById('ssbPartial').textContent = partial;
  document.getElementById('ssbDone').textContent    = done;
  document.getElementById('ssbTotal').textContent   = total;
}

// ===== SUMMARY =====
function refreshSummary() {
  const exp   = appState.expense;
  const total = (exp.animal || 0) + (exp.butcher || 0) + (exp.transport || 0) + (exp.extra || 0);
  const shares = exp.shares || 0;
  const per    = shares > 0 && total > 0 ? total / shares : 0;
  const done   = appState.recipients.filter(r => r.status === 'done').length;
  const pct    = appState.recipients.length ? Math.round(done / appState.recipients.length * 100) : 0;

  document.getElementById('sumDate').textContent      = exp.savedAt || '—';
  document.getElementById('sumTotalExp').textContent  = formatTaka(total);
  document.getElementById('sumPerShare').textContent  = formatTaka(per);
  document.getElementById('sumSharers').textContent   = shares ;
  document.getElementById('sumDelivery').textContent  = pct  + '%';

  // Breakdown
  const br = document.getElementById('sumBreakdown');
  br.innerHTML = [
    ['Animal Cost', exp.animal || 0],
    ['Butcher Fee', exp.butcher || 0],
    ['Transport', exp.transport || 0],
    ['Additional', exp.extra || 0],
    ['Total', total],
  ].map(([l, v]) => `<div class="sbr-row"><span>${l}</span><span>${formatTaka(v)}</span></div>`).join('');

  // Sharers
  const sl = document.getElementById('sumSharers_list');
  if (exp.contributors && exp.contributors.some(c => c)) {
    sl.innerHTML = exp.contributors.map((n, i) =>
      `<div class="sharer-chip">${n || `Shareholder ${i + 1}`}</div>`).join('');
  } else {
    sl.innerHTML = `<span style="color:var(--text-dim);font-family:'Noto Serif Bengali',serif;font-size:0.82rem;">No shareholder names saved</span>`;
  }

  // Distribution list
  const dl = document.getElementById('sumDistList');
  if (!appState.recipients.length) {
    dl.innerHTML = `<span style="color:var(--text-dim);font-family:'Noto Serif Bengali',serif;font-size:0.82rem;">No recipients added</span>`;
  } else {
    dl.innerHTML = appState.recipients.map(r => `
      <div class="sdr-row">
        <span>${r.name} <small style="color:var(--text-dim)">(${catLabels[r.category]})</small></span>
        <span class="status-badge ${statusClass[r.status]}">${statusLabels[r.status]}</span>
      </div>`).join('');
  }
}

// ===== EXPORT / PRINT / CLEAR =====
window.exportData = function() {
  const data = JSON.stringify(appState, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'qurbani-for-allah-backup.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported successfully!', 'success', 'fas fa-download');
};

window.printSummary = function() {
  window.print();
};

window.clearAllData = function() {
  if (!confirm('Are you sure you want to clear all data?')) return;
  appState = {
    expense: { animal:0, butcher:0, transport:0, extra:0, shares:1, contributors:[] },
    recipients: [],
    activities: []
  };
  saveState();
  refreshAllUI();
  clearExpenseForm();
  showToast('All data cleared', 'info', 'fas fa-trash');
};

// ===== ANIMATED VALUE =====
function animateValue(id, target, formatter, duration = 800) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = formatter(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== TOAST =====
function showToast(msg, type = 'info', icon = 'fas fa-info-circle') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="${icon}"></i><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ===== INTERSECTION OBSERVER (reveal on scroll) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.kpi-card, .dash-card, .masail-card').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
