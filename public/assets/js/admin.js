// admin.js (SESSION-BASED AUTH + COMPATIBLE WITH OLD /api/admin/clubs SHAPES)
'use strict';

import {
  API_BASE,
  esc,
  byId,
  fetchText,
  fetchJSON,
  normalizeWebsiteUrl,
  adminAuthHeaders,
  setAdminSessionToken,
  clearAdminStorage,
  isAdminSessionValid,
  updateAdminSessionTimestamp,
  sha256Browser
} from './shared.js';

/* ============================================================================
   STATUS BANNER
   ============================================================================ */
function showAdminBanner(message, tone) {
  const panel = byId('adminPanel');
  if (!panel) return;

  const existing = byId('adminStatus');
  if (existing && existing.parentNode) existing.remove();

  let color;
  if (tone === 'success') color = 'border-emerald-300 bg-emerald-50 text-emerald-900';
  else if (tone === 'warn') color = 'border-amber-300 bg-amber-50 text-amber-900';
  else if (tone === 'error') color = 'border-red-300 bg-red-50 text-red-900';
  else color = 'border-neutral-300 bg-neutral-50 text-neutral-900';

  const banner = document.createElement('div');
  banner.id = 'adminStatus';
  banner.className =
    'mb-4 rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-3 ' +
    color;

  banner.innerHTML =
    '<span>' + esc(message) + '</span>' +
    '<button class="text-xs font-semibold underline">Dismiss</button>';

  const top = panel.querySelector('.flex.flex-wrap') || panel.firstChild;
  panel.insertBefore(banner, top);

  banner.querySelector('button')?.addEventListener('click', () => banner.remove());

  setTimeout(() => {
    if (banner.parentNode) banner.remove();
  }, 30000);
}

/* ============================================================================
   LOGOUT
   ============================================================================ */
function logoutAdmin() {
  clearAdminStorage();

  const loginSection = byId('adminLogin');
  const panel = byId('adminPanel');
  const logoutBtn = byId('logoutBtn');

  panel?.classList.add('hidden');
  loginSection?.classList.remove('hidden');
  logoutBtn?.classList.add('hidden');
}

/* ============================================================================
   RENDER TABLE ROWS
   ============================================================================ */
function rowHTML(c) {
  const desc = c.description || '';
  const short = desc.slice(0, 120) + (desc.length > 120 ? '…' : '');
  const website = c.website_url ? normalizeWebsiteUrl(c.website_url) : '';

  return `
<tr class="border-b" data-id="${esc(c.id)}">
  <td class="px-3 py-2">
    <div class="font-semibold">${esc(c.name || '')}</div>
    <div class="text-neutral-600 text-xs">${esc((c.fields || []).join(' • '))}</div>
  </td>
  <td class="px-3 py-2">${esc(c.president_contact || '')}</td>
  <td class="px-3 py-2">
    ${website
      ? `<a class="text-brand underline" href="${esc(website)}" target="_blank" rel="noopener">Open ↗</a>`
      : ''}
  </td>
  <td class="px-3 py-2">${esc((c.meeting_days || []).join(', '))}</td>
  <td class="px-3 py-2">${esc(c.meeting_room || '')}</td>
  <td class="px-3 py-2">${esc(c.status || '')}</td>
  <td class="px-3 py-2 text-sm text-neutral-800">${esc(short)}</td>
  <td class="px-3 py-2">
    <div class="flex flex-wrap gap-2">
      ${c.status !== 'approved'
        ? `<button data-action="approve"
                   class="px-3 py-1 rounded-lg border-2 border-emerald-600 text-emerald-600 font-bold">
             Approve
           </button>`
        : ''}
      <button data-action="edit"
              class="px-3 py-1 rounded-lg border-2 border-brand text-brand font-bold">
        Edit
      </button>
      <button data-action="delete"
              class="px-3 py-1 rounded-lg border-2 border-red-500 text-red-500 font-bold">
        Delete
      </button>
    </div>
  </td>
</tr>`;
}

/* ============================================================================
   LOAD CLUBS
   ============================================================================ */
async function loadClubs(status) {
  updateAdminSessionTimestamp();

  const listEl = byId('adminTableBody');
  if (!listEl) return;

  listEl.innerHTML =
    '<tr><td class="p-4 text-neutral-500" colspan="8">Loading…</td></tr>';

  try {
    // Keep ?status for compatibility with older backends, but also filter client-side.
    const url =
      API_BASE +
      '/api/admin/clubs' +
      (status ? '?status=' + encodeURIComponent(status) : '');

    const data = await fetchJSON(url, {
      headers: adminAuthHeaders()
    });

    // Support both { clubs: [...] } and bare array responses.
    let clubs = data.clubs || data || [];

    if (!Array.isArray(clubs)) clubs = [];

    if (status === 'approved') {
      clubs = clubs.filter((c) => c.status === 'approved');
    } else if (status === 'pending') {
      clubs = clubs.filter((c) => c.status !== 'approved');
    }

    if (!clubs.length) {
      listEl.innerHTML =
        '<tr><td class="p-4 text-neutral-500" colspan="8">No clubs found.</td></tr>';
      return;
    }

    listEl.innerHTML = clubs.map(rowHTML).join('');
    listEl.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', onAction);
    });
  } catch (e) {
    console.error(e);
    const msg = String(e && e.message) || '';
    if (msg.includes('401') || msg.includes('403')) {
      logoutAdmin();
      showAdminBanner('Admin session expired. Please log in again.', 'error');
    } else {
      listEl.innerHTML =
        '<tr><td class="p-4 text-red-600" colspan="8">Failed to load.</td></tr>';
    }
  }
}

function reloadActiveTab() {
  const active = document.querySelector('[data-tab].active');
  const status = active ? active.getAttribute('data-tab') : 'pending';
  loadClubs(status);
}

/* ============================================================================
   APPROVE / DELETE / EDIT
   ============================================================================ */
async function onAction(e) {
  const btn = e.currentTarget;
  const row = btn.closest('tr');
  if (!row) return;

  const id = row.getAttribute('data-id');
  const action = btn.getAttribute('data-action');

  updateAdminSessionTimestamp();

  if (action === 'delete') {
    if (!confirm('Are you sure you want to delete this club and all associated information?\nThis action CANNOT be undone.')) return;

    const res = await fetchText(API_BASE + '/api/clubs/' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: adminAuthHeaders()
    });

    if (!res.ok) {
      alert('Delete failed.');
      return;
    }

    reloadActiveTab();
  } else if (action === 'approve') {
    const res = await fetchText(
      API_BASE + '/api/clubs/' + encodeURIComponent(id) + '/approve',
      {
        method: 'POST',
        headers: adminAuthHeaders()
      }
    );

    if (!res.ok) {
      alert('Approve failed.');
      return;
    }
    reloadActiveTab();
  } else if (action === 'edit') {
    window.location.href = './presidents.html?edit=' + encodeURIComponent(id);
  }
}

/* ============================================================================
   TABS / BUTTON STATES
   ============================================================================ */
let tabBtns = null;

function toggleBulkButtonsForStatus(status) {
  const pendingBtn = byId('deleteAllPending');
  const approvedBtn = byId('deleteAllApproved');
  if (!pendingBtn || !approvedBtn) return;

  if (status === 'approved') {
    pendingBtn.classList.add('hidden');
    approvedBtn.classList.remove('hidden');
  } else {
    pendingBtn.classList.remove('hidden');
    approvedBtn.classList.add('hidden');
  }
}

function updateTabStyles(activeBtn) {
  if (!tabBtns) return;
  tabBtns.forEach((b) => {
    b.classList.remove('active', 'border-brand', 'text-brand');
    b.classList.add('border-neutral-400', 'text-neutral-600');
  });
  activeBtn.classList.add('active', 'border-brand', 'text-brand');
  activeBtn.classList.remove('border-neutral-400', 'text-neutral-600');
}

/* ============================================================================
   SUCCESS BANNER AFTER EDIT
   ============================================================================ */
function maybeShowEditSuccessBanner() {
  let flag = null;
  try {
    flag = localStorage.getItem('ADMIN_EDIT_SUCCESS');
    localStorage.removeItem('ADMIN_EDIT_SUCCESS');
  } catch {
    flag = null;
  }

  if (flag === 'approved') {
    showAdminBanner('Club information has been updated and is now live.', 'success');
  } else if (flag === 'pending') {
    showAdminBanner(
      'Pending request updated. Approve it in the admin panel to publish.',
      'warn'
    );
  }
}

/* ============================================================================
   BULK DELETE HELPERS
   ============================================================================ */
async function deleteAllPendingRequests() {
  if (!confirm('Are you sure you want to delete ALL pending club requests?')) return;
  if (!confirm('This will permanently delete every pending club request.\nThis action CANNOT be undone.\nDo you want to proceed?')) return;

  updateAdminSessionTimestamp();

  try {
    const data = await fetchJSON(API_BASE + '/api/admin/clubs', {
      headers: adminAuthHeaders()
    });

    const all = data.clubs || data || [];
    const pending = (Array.isArray(all) ? all : []).filter(
      (c) => c.status !== 'approved'
    );

    if (!pending.length) {
      showAdminBanner('No pending requests exist.', 'info');
      return;
    }

    let fails = 0;
    for (const c of pending) {
      const res = await fetchText(API_BASE + '/api/clubs/' + encodeURIComponent(c.id), {
        method: 'DELETE',
        headers: adminAuthHeaders()
      });
      if (!res.ok) fails++;
    }

    if (fails === 0) showAdminBanner('All pending requests deleted.', 'success');
    else if (fails < pending.length)
      showAdminBanner('Some pending requests could not be deleted.', 'error');
    else showAdminBanner('Delete failed.', 'error');

    reloadActiveTab();
  } catch (e) {
    console.error(e);
    const msg = String(e && e.message) || '';
    if (msg.includes('401') || msg.includes('403')) {
      logoutAdmin();
      showAdminBanner('Admin session expired. Please log in again.', 'error');
    } else {
      showAdminBanner('Failed to load pending list. Please try refreshing the page. \nIf the issue continues, log out and log in again.', 'error');
    }
  }
}

async function deleteAllApprovedClubs() {
  if (!confirm('Are you sure you want to delete ALL approved clubs?')) return;
  if (!confirm('This will permanently delete every approved club in the directory.\nThis action cannot be undone.\nDo you want to proceed?')) return;

  updateAdminSessionTimestamp();

  // Extra verification
  const code = window.prompt('Re-enter admin code to proceed:');
  if (!code) {
    showAdminBanner('Bulk delete cancelled.', 'warn');
    return;
  }

  try {
    const hash = await sha256Browser(code);
    await fetchJSON(API_BASE + '/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(hash ? { code_hash: hash } : { code })
    });
  } catch {
    showAdminBanner('Admin code incorrect. Action aborted.', 'error');
    return;
  }

  try {
    const data = await fetchJSON(API_BASE + '/api/admin/clubs', {
      headers: adminAuthHeaders()
    });

    const all = data.clubs || data || [];
    const approved = (Array.isArray(all) ? all : []).filter(
      (c) => c.status === 'approved'
    );

    if (!approved.length) {
      showAdminBanner('No approved clubs exist.', 'info');
      return;
    }

    let fails = 0;
    for (const c of approved) {
      const res = await fetchText(API_BASE + '/api/clubs/' + encodeURIComponent(c.id), {
        method: 'DELETE',
        headers: adminAuthHeaders()
      });
      if (!res.ok) fails++;
    }

    if (fails === 0) showAdminBanner('All approved clubs deleted.', 'success');
    else if (fails < approved.length)
      showAdminBanner('Some clubs could not be deleted.', 'error');
    else showAdminBanner('Delete failed.', 'error');

    reloadActiveTab();
  } catch (e) {
    console.error(e);
    const msg = String(e && e.message) || '';
    if (msg.includes('401') || msg.includes('403')) {
      logoutAdmin();
      showAdminBanner('Admin session expired. Please log in again.', 'error');
    } else {
      showAdminBanner('Failed to load approved list. Please try refreshing the page. \nIf the issue continues, log out and log in again.', 'error');
    }
  }
}

/* ============================================================================
   AUTO-AUTH
   ============================================================================ */
function autoAuth(loginSection, panel, logoutBtn) {
  if (!isAdminSessionValid()) {
    logoutAdmin();
    return;
  }

  loginSection?.classList.add('hidden');
  panel?.classList.remove('hidden');
  logoutBtn?.classList.remove('hidden');

  const pendingBtn = document.querySelector('[data-tab="pending"]');
  if (pendingBtn) updateTabStyles(pendingBtn);

  toggleBulkButtonsForStatus('pending');
  loadClubs('pending');
  maybeShowEditSuccessBanner();
}

/* ============================================================================
   INIT
   ============================================================================ */
export function initAdmin() {
  const loginSection = byId('adminLogin');
  const panel = byId('adminPanel');
  const logoutBtn = byId('logoutBtn');
  const loginForm = loginSection?.querySelector('form') || null;

  /* TABS */
  tabBtns = document.querySelectorAll('[data-tab]');
  tabBtns.forEach((btn) => {
    btn.classList.add(
      'border-neutral-400',
      'text-neutral-600',
      'rounded-2xl',
      'font-bold',
      'transition'
    );
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-tab');
      updateTabStyles(btn);
      toggleBulkButtonsForStatus(status);
      loadClubs(status);
    });
  });

  /* LOGIN */
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const code = fd.get('code') || '';

      try {
        const hash = await sha256Browser(code);
        const body = hash
          ? JSON.stringify({ code_hash: hash })
          : JSON.stringify({ code });

        const res = await fetchJSON(API_BASE + '/api/admin/login', {
          method: 'POST',
          body
        });

        // Server should return { session: "..." }
        setAdminSessionToken(res.session);

        loginSection.classList.add('hidden');
        panel.classList.remove('hidden');
        logoutBtn?.classList.remove('hidden');

        const pendingBtn = document.querySelector('[data-tab="pending"]');
        if (pendingBtn) updateTabStyles(pendingBtn);

        toggleBulkButtonsForStatus('pending');
        loadClubs('pending');
      } catch (err) {
        console.error(err);
        alert('Invalid admin code.');
      }
    });
  }

  /* AUTO AUTH */
  autoAuth(loginSection, panel, logoutBtn);

  /* LOGOUT */
  logoutBtn?.addEventListener('click', logoutAdmin);

  /* BULK DELETE PENDING */
  byId('deleteAllPending')?.addEventListener('click', (e) => {
    e.preventDefault();
    deleteAllPendingRequests();
  });

  /* BULK DELETE APPROVED */
  byId('deleteAllApproved')?.addEventListener('click', (e) => {
    e.preventDefault();
    deleteAllApprovedClubs();
  });
}

/* auto-init */
initAdmin();
