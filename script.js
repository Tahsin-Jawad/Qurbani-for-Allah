// =============================================
//   Qurbani for Allah — script.js
//   All app logic + localStorage persistence
// =============================================

// ─── STATE & STORAGE ─────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem('qurbani_state');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return { expenses: [], contributors: [], shares: 1, recipients: [] };
}

let state = loadState();

function save() {
  try {
    localStorage.setItem('qurbani_state', JSON.stringify(state));
  } catch (e) {
    toast('⚠️ Could not save — storage may be full');
  }
}

// ─── TOAST NOTIFICATION ──────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── NAVIGATION ──────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const idx = ['dashboard', 'expense', 'distribution', 'masail'].indexOf(id);
  document.querySelectorAll('.nav-btn')[idx].classList.add('active');

  if (id === 'dashboard')    renderDashboard();
  if (id === 'expense')      renderExpensePage();
  if (id === 'distribution') renderRecipients('All');
}

// ─── CONTRIBUTORS ─────────────────────────────────────────
function addContributor() {
  const inp = document.getElementById('exp-contrib-name');
  const name = inp.value.trim();
  if (!name) return;
  state.contributors.push(name);
  inp.value = '';
  renderContributorTags();
}

function removeContributor(i) {
  state.contributors.splice(i, 1);
  renderContributorTags();
}

function renderContributorTags() {
  const el = document.getElementById('contributor-tags');
  if (!el) return;
  el.innerHTML = state.contributors.map((c, i) =>
    `<div class="tag">${c}<span class="tag-remove" onclick="removeContributor(${i})">×</span></div>`
  ).join('');
}

// ─── EXPENSES ─────────────────────────────────────────────
function saveExpense() {
  const animal    = parseFloat(document.getElementById('exp-animal').value)    || 0;
  const butcher   = parseFloat(document.getElementById('exp-butcher').value)   || 0;
  const transport = parseFloat(document.getElementById('exp-transport').value) || 0;
  const other     = parseFloat(document.getElementById('exp-other').value)     || 0;
  const desc      = document.getElementById('exp-desc').value.trim();
  const shares    = parseInt(document.getElementById('exp-shares').value)      || 1;
  const type      = document.getElementById('exp-type').value;

  if (!animal) { toast('⚠️ Please enter animal cost'); return; }

  const total     = animal + butcher + transport + other;
  const perPerson = total / shares;

  // Replace any previous entry (single Qurbani model)
  state.expenses = [{
    animal, butcher, transport, other,
    desc, total, perPerson, shares, type,
    contributors: [...state.contributors],
    date: new Date().toLocaleDateString()
  }];
  state.shares = shares;

  save();
  renderCostSummary(state.expenses[0]);
  renderExpenseHistory();
  toast('✅ Expense saved!');
}

function renderCostSummary(d) {
  const el = document.getElementById('cost-summary');
  if (!el) return;
  el.innerHTML = `
    <div class="breakdown-row">
      <span class="breakdown-label">🐄 ${d.type}</span>
      <span>৳${d.animal.toLocaleString()}</span>
    </div>
    <div class="breakdown-row">
      <span class="breakdown-label">🔪 Butcher</span>
      <span>৳${(d.butcher || 0).toLocaleString()}</span>
    </div>
    <div class="breakdown-row">
      <span class="breakdown-label">🚛 Transport</span>
      <span>৳${(d.transport || 0).toLocaleString()}</span>
    </div>
    <div class="breakdown-row">
      <span class="breakdown-label">📦 Other</span>
      <span>৳${(d.other || 0).toLocaleString()}</span>
    </div>
    <div class="breakdown-row">
      <span>Total</span>
      <span>৳${d.total.toLocaleString()}</span>
    </div>
    <div style="margin-top:1rem; padding:1rem; background:var(--gold-dim); border:1px solid var(--gold-border); border-radius:8px; text-align:center;">
      <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em;">
        Per Person (${d.shares} shareholders)
      </div>
      <div style="font-family:'Cinzel',serif; font-size:1.8rem; color:var(--gold); margin-top:4px;">
        ৳${Math.round(d.perPerson).toLocaleString()}
      </div>
    </div>
  `;
}

function renderExpenseHistory() {
  const el  = document.getElementById('expense-list');
  const btn = document.getElementById('clear-expenses-btn');
  if (!el) return;

  if (!state.expenses.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div>No expenses saved yet</div>';
    if (btn) btn.style.display = 'none';
    return;
  }

  if (btn) btn.style.display = 'block';

  el.innerHTML = state.expenses.map(e => `
    <div class="expense-item">
      <div>
        <div class="expense-name">${e.type} — ${e.date}</div>
        <div class="expense-type">${e.shares} shareholders${e.desc ? ' · ' + e.desc : ''}</div>
        ${e.contributors && e.contributors.length
          ? `<div class="expense-type" style="margin-top:3px;">👥 ${e.contributors.join(', ')}</div>`
          : ''}
      </div>
      <div style="text-align:right;">
        <div class="expense-amount">৳${e.total.toLocaleString()}</div>
        <div class="expense-type">৳${Math.round(e.perPerson).toLocaleString()}/person</div>
      </div>
    </div>
  `).join('');
}

function renderExpensePage() {
  renderContributorTags();
  renderExpenseHistory();

  // Restore summary if expense exists
  if (state.expenses.length) {
    renderCostSummary(state.expenses[0]);

    // Restore form fields from saved data
    const e = state.expenses[0];
    const fields = {
      'exp-type': e.type, 'exp-animal': e.animal,
      'exp-butcher': e.butcher, 'exp-transport': e.transport,
      'exp-other': e.other, 'exp-desc': e.desc,
      'exp-shares': e.shares
    };
    Object.entries(fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== 0) el.value = val;
    });
  }
}

function clearExpenses() {
  if (!confirm('Clear all expense data?')) return;
  state.expenses = [];
  state.contributors = [];
  save();
  renderExpenseHistory();
  renderContributorTags();
  const el = document.getElementById('cost-summary');
  if (el) el.innerHTML = '<div class="empty-state"><div class="empty-icon">🧮</div>Fill in expenses to see summary</div>';
  toast('🗑 Cleared');
}

// ─── RECIPIENTS ───────────────────────────────────────────
function addRecipient() {
  const name   = document.getElementById('rec-name').value.trim();
  const cat    = document.getElementById('rec-cat').value;
  const shares = parseInt(document.getElementById('rec-shares').value) || 1;
  const notes  = document.getElementById('rec-notes').value.trim();

  if (!name) { toast('⚠️ Enter recipient name'); return; }

  state.recipients.push({ id: Date.now(), name, cat, shares, notes, status: 'Pending' });
  document.getElementById('rec-name').value  = '';
  document.getElementById('rec-notes').value = '';

  save();
  renderRecipients(currentFilter);
  toast('✅ Recipient added!');
}

function updateStatus(id, val) {
  const r = state.recipients.find(r => r.id === id);
  if (r) { r.status = val; save(); }
}

function deleteRecipient(id) {
  state.recipients = state.recipients.filter(r => r.id !== id);
  save();
  renderRecipients(currentFilter);
  toast('🗑 Removed');
}

let currentFilter = 'All';

function filterRecipients(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderRecipients(cat);
}

function renderRecipients(cat) {
  const el   = document.getElementById('recipient-list');
  if (!el) return;

  const list = cat === 'All'
    ? state.recipients
    : state.recipients.filter(r => r.cat === cat);

  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🌿</div>No recipients in this category yet.</div>';
    return;
  }

  const catIcon = { Family: '👨‍👩‍👧', Relatives: '👥', Needy: '🤲', Neighbours: '🏠' };

  el.innerHTML = list.map(r => `
    <div class="recipient-card" id="rcard-${r.id}">
      <div class="recipient-info">
        <div class="recipient-name">${catIcon[r.cat] || '👤'} ${r.name}</div>
        <div class="recipient-meta">
          ${r.cat} · ${r.shares} share${r.shares > 1 ? 's' : ''}
          ${r.notes ? ' · ' + r.notes : ''}
        </div>
      </div>
      <div class="recipient-actions">
        <span class="status-badge ${
          r.status === 'Pending'   ? 'status-pending'   :
          r.status === 'Partial'   ? 'status-partial'   :
                                     'status-delivered'
        }">${r.status}</span>
        <select class="status-select"
          onchange="updateStatus(${r.id}, this.value); renderRecipients(currentFilter);">
          <option ${r.status === 'Pending'   ? 'selected' : ''}>Pending</option>
          <option ${r.status === 'Partial'   ? 'selected' : ''}>Partial</option>
          <option ${r.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
        <button class="btn btn-red"
          style="padding:5px 10px; font-size:0.75rem;"
          onclick="deleteRecipient(${r.id})">✕</button>
      </div>
    </div>
  `).join('');
}

// ─── DASHBOARD ────────────────────────────────────────────
function renderDashboard() {
  const exp       = state.expenses[0];
  const total     = exp ? exp.total : 0;
  const perP      = exp ? Math.round(exp.perPerson) : 0;
  const recips    = state.recipients.length;
  const pending   = state.recipients.filter(r => r.status === 'Pending').length;
  const partial   = state.recipients.filter(r => r.status === 'Partial').length;
  const delivered = state.recipients.filter(r => r.status === 'Delivered').length;

  document.getElementById('ds-total').textContent   = '৳' + total.toLocaleString();
  document.getElementById('ds-per').textContent     = '৳' + perP.toLocaleString();
  document.getElementById('ds-recip').textContent   = recips;
  document.getElementById('ds-pending').textContent = pending;

  // Expense breakdown
  const breakEl = document.getElementById('dash-breakdown');
  if (exp) {
    breakEl.innerHTML = `
      <div class="breakdown-row"><span class="breakdown-label">🐄 ${exp.type}</span><span>৳${exp.animal.toLocaleString()}</span></div>
      <div class="breakdown-row"><span class="breakdown-label">🔪 Butcher</span><span>৳${(exp.butcher||0).toLocaleString()}</span></div>
      <div class="breakdown-row"><span class="breakdown-label">🚛 Transport</span><span>৳${(exp.transport||0).toLocaleString()}</span></div>
      <div class="breakdown-row"><span class="breakdown-label">📦 Other</span><span>৳${(exp.other||0).toLocaleString()}</span></div>
      <div class="breakdown-row"><span>Total</span><span>৳${exp.total.toLocaleString()}</span></div>
    `;
  } else {
    breakEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div>No expenses yet</div>';
  }

  // Delivery progress
  const pct = recips > 0 ? Math.round((delivered / recips) * 100) : 0;
  document.getElementById('delivery-bar').style.width   = pct + '%';
  document.getElementById('delivery-pct').textContent   = pct + '% delivered';

  const delivEl = document.getElementById('dash-delivery');
  if (recips) {
    delivEl.innerHTML = `
      <div class="breakdown-row"><span class="breakdown-label" style="color:var(--red)">🔴 Pending</span><span>${pending}</span></div>
      <div class="breakdown-row"><span class="breakdown-label" style="color:#FFAA32">🟡 Partial</span><span>${partial}</span></div>
      <div class="breakdown-row"><span class="breakdown-label" style="color:var(--green)">🟢 Delivered</span><span>${delivered}</span></div>
      <div class="breakdown-row"><span>Total Recipients</span><span>${recips}</span></div>
    `;
  } else {
    delivEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div>No recipients yet</div>';
  }
}

// ─── MASAIL ───────────────────────────────────────────────
const masailData = [
  {
    icon: '⭐',
    title: 'কার উপর কুরবানি ওয়াজিব',
    body: `<p>প্রাপ্তবয়স্ক, মুসলিম ও সুস্থ মস্তিষ্কের ব্যক্তির উপর কুরবানি ওয়াজিব।</p>
           <p>১০ জিলহজ ফজর থেকে ১২ জিলহজ সূর্যাস্ত পর্যন্ত সময়ের মধ্যে নিসাব পরিমাণ সম্পদের মালিক হলে কুরবানি ওয়াজিব।</p>
           <p>নিসাব = প্রয়োজনের অতিরিক্ত সম্পদ (প্রায় ৫২.৫ তোলা রূপার সমমূল্য)।</p>`
  },
  {
    icon: '🐄',
    title: 'কোন পশু দিয়ে কুরবানি করা যাবে',
    body: `<p>গরু, ছাগল, ভেড়া, উট ও মহিষ দ্বারা কুরবানি জায়েজ।</p>
           <p>বন্য পশু দ্বারা কুরবানি হবে না।</p>`
  },
  {
    icon: '📏',
    title: 'পশুর বয়স শর্ত',
    body: `<p>উট: ৫ বছর</p>
           <p>গরু/মহিষ: ২ বছর</p>
           <p>ছাগল/ভেড়া: ১ বছর</p>
           <p>ভেড়া হৃষ্টপুষ্ট হলে ৬ মাস হলেও চলবে।</p>`
  },
  {
    icon: '🩺',
    title: 'দুর্বল পশুর হুকুম',
    body: `<p>খুব দুর্বল বা হাঁটতে না পারা পশু কুরবানি হবে না।</p>`
  },
  {
    icon: '🦷',
    title: 'দাঁতহীন পশু',
    body: `<p>ঘাস চিবিয়ে খেতে পারলে কুরবানি জায়েজ, না পারলে নয়।</p>`
  },
  {
    icon: '🐐',
    title: 'শিং / কান / লেজ সংক্রান্ত মাসআলা',
    body: `<p>অর্ধেক বা বেশি কাটা হলে কুরবানি হবে না।</p>
           <p>কম কাটা হলে জায়েজ।</p>`
  },
  {
    icon: '👥',
    title: 'ভাগ নিয়ম',
    body: `<p>গরু/উটে সর্বোচ্চ ৭ ভাগ।</p>
           <p>যেকোনো ভাগে অংশ নেওয়া যায়।</p>`
  },
  {
    icon: '🕌',
    title: 'অন্যান্য গুরুত্বপূর্ণ মাসআলা',
    body: `<p>আকীকা কুরবানিতে একত্রে করা যায়।</p>
           <p>কুরবানির কোনো অংশ বিক্রি করা যাবে না।</p>
           <p>মৃত ব্যক্তির পক্ষ থেকে কুরবানি জায়েজ।</p>`
  }
];

function initMasail() {
  const el = document.getElementById('masail-list');
  if (!el) return;
  el.innerHTML = masailData.map((m, i) => `
    <div class="masail-card">
      <div class="masail-header" id="mh-${i}" onclick="toggleMasail(${i})">
        <span>${m.icon} ${m.title}</span>
        <span class="masail-chevron">▾</span>
      </div>
      <div class="masail-body" id="mb-${i}">${m.body}</div>
    </div>
  `).join('');
}

function toggleMasail(i) {
  const header = document.getElementById('mh-' + i);
  const body   = document.getElementById('mb-' + i);
  const isOpen = body.classList.contains('open');
  header.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

// ─── INIT (runs on page load) ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMasail();
  renderDashboard();
  // Expense page only renders when navigated to
  // but restore tags in case user is on expense tab
  renderContributorTags();
});
