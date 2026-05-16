// presidents.js (cleaned for session-based admin + current shared.js)
'use strict';

import {
  API_BASE,
  esc,
  fetchText,
  fetchJSON,
  normalizeWebsiteUrl,
  byId,
  countWords,
  MAX_DESC_WORDS,
  FIELD_PALETTE,
  CAT_PALETTE,
  SUB_PALETTE,
  isAdminSessionValid,
  adminAuthHeaders,
  updateAdminSessionTimestamp,
  cls
} from './shared.js';

/* ============================================================================
   LOCAL HELPERS (not provided by shared.js)
   ============================================================================ */

/** Simple query param helper */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search || '');
  return params.get(name) || '';
}

/** Client-side text cleaning + length limiting */
const FIELD_LIMITS = {
  club_name: 80,
  president_contact: 120,
  meeting_room: 40,
  meeting_time_range: 80,
  prerequisites: 300,
  description: 2000
};

function cleanClientText(value, maxLen) {
  let s = (value == null ? '' : String(value)).trim();
  // collapse internal whitespace
  s = s.replace(/\s+/g, ' ');
  if (maxLen && maxLen > 0) s = s.slice(0, maxLen);
  return s;
}

/** Tiny profanity guard (server should still validate) */
const BAD_WORDS = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'slut',
  'whore',
  'dick',
  'cunt'
];

function containsProfanity(text) {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  return BAD_WORDS.some((w) => lower.includes(w));
}

/* ============================================================================
   FORM INITIALIZATION
   ============================================================================ */

export function initPresidents() {
  const form = byId('presForm');
  if (!form) return;

  const statusEl = byId('status');
  const desc = byId('desc');
  const wordCount = byId('wordCount');
  const mtRange = byId('mt_range');
  const prereqRequired = byId('prereq_required');
  const prereqWrap = byId('prereq_text_wrap');
  const stemWrap = byId('stemSubfieldsWrap');

  const editId = getQueryParam('edit');
  const isEditMode = !!editId;
  const isAdminEdit = isEditMode && isAdminSessionValid();
  let originalStatus = null;

  /* --------------------------------------------------------------------------
     ERROR UI HELPER
     -------------------------------------------------------------------------- */

  function setError(key, show) {
    const el = form.querySelector(`[data-error="${key}"]`);
    if (el) el.classList.toggle('hidden', !show);
  }

  /* --------------------------------------------------------------------------
     MEETING TIME TYPE
     -------------------------------------------------------------------------- */

  form.addEventListener('input', (e) => {
    if (e.target.name === 'meeting_time_type') {
      const type =
        form.querySelector('input[name="meeting_time_type"]:checked')?.value || '';
      mtRange.classList.toggle('hidden', type !== 'after_school');
    }
  });

  /* --------------------------------------------------------------------------
     PREREQ VISIBILITY
     -------------------------------------------------------------------------- */

  function syncPrereq() {
    const on = prereqRequired.checked;
    prereqWrap.classList.toggle('hidden', !on);

    if (!on) {
      const i = prereqWrap.querySelector('input[name="prerequisites"]');
      if (i) i.value = '';
    }
  }

  prereqRequired.addEventListener('change', syncPrereq);
  syncPrereq();

  /* --------------------------------------------------------------------------
     STEM SUBFIELDS VISIBILITY
     -------------------------------------------------------------------------- */

  function syncStem() {
    const fields = [...form.querySelectorAll('input[name="fields"]:checked')].map(
      (n) => n.value
    );
    const hasSTEM = fields.includes('STEM');
    stemWrap.classList.toggle('hidden', !hasSTEM);

    if (!hasSTEM) {
      form
        .querySelectorAll('input[name="subfields"]')
        .forEach((n) => (n.checked = false));
    }
  }

  form
    .querySelectorAll('input[name="fields"]')
    .forEach((box) => box.addEventListener('change', syncStem));
  syncStem();

  /* --------------------------------------------------------------------------
     WORD COUNT
     -------------------------------------------------------------------------- */

  function updateWords() {
    const w = countWords(desc.value);
    wordCount.innerHTML = `<span class="font-semibold">${w}</span> / ${MAX_DESC_WORDS} words`;
    wordCount.classList.toggle('text-red-600', w > MAX_DESC_WORDS);
    setError('description', w > MAX_DESC_WORDS);
  }

  desc.addEventListener('input', updateWords);
  updateWords();

  /* --------------------------------------------------------------------------
     CHIP PALETTES (uses shared palettes)
     -------------------------------------------------------------------------- */

  const paletteGroups = [
    ['fields', FIELD_PALETTE],
    ['categories', CAT_PALETTE],
    ['subfields', SUB_PALETTE]
  ];

  function applyPalettes() {
    paletteGroups.forEach(([name, palMap]) => {
      const labels = document.querySelectorAll(`[data-palette="${name}"]`);

      labels.forEach((lbl) => {
        const input = lbl.querySelector('input[type="checkbox"]');
        if (!input) return;

        // Reset base styles
        lbl.className = cls(
          'border',
          'cursor-pointer',
          'rounded',
          'px-2',
          'py-1',
          'flex',
          'items-center',
          'gap-2',
          'text-sm'
        );

        const pal = palMap[input.value];

        if (input.checked && pal) {
          lbl.classList.add(pal[0], pal[1], pal[2]);
        } else {
          lbl.classList.add('bg-white', 'border-neutral-300', 'text-neutral-800');
        }
      });
    });
  }

  form.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      applyPalettes();
    }
  });
  applyPalettes();

  /* --------------------------------------------------------------------------
     EDIT MODE BANNER
     -------------------------------------------------------------------------- */

  function ensureEditBannerContainer() {
    let b = byId('editBanner');
    if (b) return b;

    b = document.createElement('div');
    b.id = 'editBanner';
    b.className = 'mb-4 rounded-xl border px-4 py-3 text-sm';
    form.parentNode.insertBefore(b, form);
    return b;
  }

  function updateEditBanner(status) {
    if (!isEditMode) return;
    const b = ensureEditBannerContainer();
    const base = 'mb-4 rounded-xl border px-4 py-3 text-sm ';

    if (isAdminEdit) {
      if (status === 'approved') {
        b.className = base + 'border-emerald-300 bg-emerald-50 text-emerald-900';
        b.innerHTML =
          'Editing an <b>approved</b> club as admin. Submitting will update the live directory immediately.';
      } else {
        b.className = base + 'border-amber-300 bg-amber-50 text-amber-900';
        b.innerHTML =
          'Editing a <b>pending</b> request. After submission, you must <b>approve it</b> from the admin panel.';
      }
    } else {
      b.className = base + 'border-amber-300 bg-amber-50 text-amber-900';
      b.innerHTML =
        'You are editing an existing club. Your changes will be submitted as a <b>new request</b> requiring admin approval.';
    }
  }

  /* --------------------------------------------------------------------------
     CHECKBOX HELPERS
     -------------------------------------------------------------------------- */

  function checkMany(name, values) {
    const set = new Set(values || []);
    form.querySelectorAll(`input[name="${name}"]`).forEach((n) => {
      n.checked = set.has(n.value);
    });
  }

  /* --------------------------------------------------------------------------
     PREFILL FORM FROM EXISTING CLUB
     -------------------------------------------------------------------------- */

  function fillForm(club) {
    const setVal = (sel, v) => {
      const el = form.querySelector(sel);
      if (el) el.value = v || '';
    };

    setVal('input[name="club_name"]', club.name);
    setVal('input[name="president_contact"]', club.president_contact);
    setVal('input[name="website_url"]', club.website_url);
    setVal('input[name="meeting_room"]', club.meeting_room);

    checkMany('fields', club.fields || []);
    checkMany('categories', club.categories || []);
    checkMany('subfields', club.subfields || club.subfield || []);
    checkMany('meeting_days', club.meeting_days || []);

    const freq = form.querySelector('select[name="meeting_frequency"]');
    if (freq) freq.value = club.meeting_frequency || '';

    const type = club.meeting_time_type || '';
    const radios = form.querySelectorAll('input[name="meeting_time_type"]');
    radios.forEach((r) => (r.checked = r.value === type));

    mtRange.classList.toggle('hidden', type !== 'after_school');
    mtRange.value = club.meeting_time_range || '';

    const setBooleanRadio = (name, val) => {
      const t = form.querySelector(`input[name="${name}"][value="true"]`);
      const f = form.querySelector(`input[name="${name}"][value="false"]`);
      if (val && t) t.checked = true;
      if (!val && f) f.checked = true;
    };

    setBooleanRadio('volunteer_hours', club.volunteer_hours);

    const openToAll = form.querySelector('input[name="open_to_all"]');
    if (openToAll) openToAll.checked = !!club.open_to_all;

    prereqRequired.checked = !!club.prereq_required;
    syncPrereq();
    setVal('input[name="prerequisites"]', club.prerequisites);

    desc.value = club.description || '';
    updateWords();
    syncStem();
    applyPalettes();
  }

  /* --------------------------------------------------------------------------
     LOAD EXISTING CLUB (EDIT MODE) — with pending fallback
     -------------------------------------------------------------------------- */

  async function loadExistingClub(id) {
    if (!id) return;

    const headers = isAdminEdit ? adminAuthHeaders() : {};

    try {
      // First try the public/standard route (with admin headers if admin)
      const res = await fetchText(
        `${API_BASE}/api/clubs/${encodeURIComponent(id)}`,
        {
          method: 'GET',
          headers
        }
      );

      if (res.ok) {
        let data;
        try {
          data = JSON.parse(res.text);
        } catch {
          data = res.text;
        }
        const club = data.club || data;
        if (!club || typeof club !== 'object') {
          statusEl.textContent = 'Club not found.';
          return;
        }

        originalStatus = club.status || null;
        fillForm(club);
        updateEditBanner(originalStatus);
        return;
      }

      // If admin editing and that failed, fall back to /api/admin/clubs
      if (isAdminEdit) {
        const data = await fetchJSON(`${API_BASE}/api/admin/clubs`, {
          headers: adminAuthHeaders()
        });
        const clubs = data.clubs || data || [];
        const club = clubs.find((c) => String(c.id) === String(id));

        if (!club) {
          statusEl.textContent = 'Failed to load club.';
          return;
        }

        originalStatus = club.status || null;
        fillForm(club);
        updateEditBanner(originalStatus);
        return;
      }

      statusEl.textContent = 'Failed to load club.';
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Network error.';
    }
  }

  /* --------------------------------------------------------------------------
     EDIT MODE INITIALIZATION
     -------------------------------------------------------------------------- */

  if (isEditMode) {
    ensureEditBannerContainer();

    if (isAdminEdit) {
      const pw = form.querySelector('input[name="president_submit_password"]');
      if (pw) {
        pw.disabled = true;
        const wrap = pw.closest('.president-password-wrap');
        if (wrap) wrap.classList.add('hidden');
      }
    }

    loadExistingClub(editId);
  }

  /* --------------------------------------------------------------------------
     FORM SUBMISSION
     -------------------------------------------------------------------------- */

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Safe no-op for non-admin; refresh TTL for admins
    updateAdminSessionTimestamp();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50');
    }

    statusEl.textContent = isEditMode ? 'Saving…' : 'Submitting…';

    const fd = new FormData(form);

    const meetingDays = [
      ...form.querySelectorAll('input[name="meeting_days"]:checked')
    ].map((n) => n.value);

    const timeType =
      form.querySelector('input[name="meeting_time_type"]:checked')?.value || '';

    const freq =
      form.querySelector('select[name="meeting_frequency"]')?.value || '';

    const afterRange = cleanClientText(
      fd.get('meeting_time_range') || '',
      FIELD_LIMITS.meeting_time_range
    );

    const room = cleanClientText(
      fd.get('meeting_room') || '',
      FIELD_LIMITS.meeting_room
    );

    const words = countWords(desc.value);

    const hasError =
      !freq ||
      !timeType ||
      meetingDays.length === 0 ||
      (timeType === 'after_school' && !afterRange) ||
      !room ||
      words > MAX_DESC_WORDS;

    setError('meeting_frequency', !freq);
    setError('meeting_time_type', !timeType);
    setError('meeting_days', meetingDays.length === 0);
    setError('meeting_time_range', timeType === 'after_school' && !afterRange);
    setError('meeting_room', !room);

    if (hasError) {
      statusEl.textContent = 'Please complete the required fields.';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50');
      }
      return;
    }

    /* --------------------------- Profanity check --------------------------- */

    const combinedText = [
      fd.get('club_name'),
      fd.get('president_contact'),
      fd.get('prerequisites'),
      desc.value
    ]
      .join(' ')
      .toLowerCase();

    if (containsProfanity(combinedText)) {
      statusEl.textContent = 'Submission contains inappropriate language.';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50');
      }
      return;
    }

    /* ------------------------ Multi-checkbox helpers ------------------------ */

    const extractMulti = (name) =>
      [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(
        (n) => n.value
      );

    const fieldsArr = extractMulti('fields');
    const catsArr = extractMulti('categories');
    const subsArr = extractMulti('subfields');

    /* =========================================================================
       ADMIN EDIT MODE (PATCH)
       ========================================================================= */

    if (isEditMode && isAdminEdit && editId) {
      const payload = {
        name: cleanClientText(fd.get('club_name'), FIELD_LIMITS.club_name),
        president_contact: cleanClientText(
          fd.get('president_contact'),
          FIELD_LIMITS.president_contact
        ),
        website_url: normalizeWebsiteUrl(fd.get('website_url')),
        fields: fieldsArr,
        categories: catsArr,
        subfields: subsArr,
        meeting_days: meetingDays,
        meeting_frequency: freq,
        meeting_time_type: timeType,
        meeting_time_range: afterRange,
        meeting_room: room,
        volunteer_hours:
          form.querySelector('input[name="volunteer_hours"]:checked')?.value ===
          'true',
        open_to_all: !!fd.get('open_to_all'),
        prereq_required: !!fd.get('prereq_required'),
        prerequisites: cleanClientText(
          fd.get('prerequisites'),
          FIELD_LIMITS.prerequisites
        ),
        description: cleanClientText(desc.value, FIELD_LIMITS.description)
      };

      fetchText(`${API_BASE}/api/clubs/${encodeURIComponent(editId)}`, {
        method: 'PATCH',
        headers: adminAuthHeaders(),
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) {
            statusEl.textContent = 'Update failed (admin session expired?).';
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.classList.remove('opacity-50');
            }
            return;
          }

          try {
            localStorage.setItem(
              'ADMIN_EDIT_SUCCESS',
              originalStatus === 'approved' ? 'approved' : 'pending'
            );
          } catch {
            // ignore
          }

          statusEl.textContent = 'Saved! Redirecting…';
          setTimeout(() => {
            window.location.href = './admin.html';
          }, 500);
        })
        .catch(() => {
          statusEl.textContent = 'Network error.';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50');
          }
        });

      return;
    }

    /* =========================================================================
       PRESIDENT SUBMISSION (POST)
       ========================================================================= */

    const payload = {
      club_name: cleanClientText(fd.get('club_name'), FIELD_LIMITS.club_name),
      president_submit_password: fd.get('president_submit_password'),
      president_contact: cleanClientText(
        fd.get('president_contact'),
        FIELD_LIMITS.president_contact
      ),
      website_url: normalizeWebsiteUrl(fd.get('website_url')),
      fields: fieldsArr,
      categories: catsArr,
      subfields: subsArr,
      meeting_days: meetingDays,
      meeting_frequency: freq,
      meeting_time_type: timeType,
      meeting_time_range: afterRange,
      meeting_room: room,
      volunteer_hours:
        form.querySelector('input[name="volunteer_hours"]:checked')?.value ===
        'true',
      open_to_all: !!fd.get('open_to_all'),
      prereq_required: !!fd.get('prereq_required'),
      prerequisites: cleanClientText(
        fd.get('prerequisites'),
        FIELD_LIMITS.prerequisites
      ),
      description: cleanClientText(desc.value, FIELD_LIMITS.description)
    };

    fetchText(`${API_BASE}/api/presidents/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          let message = 'Submission failed.';
          try {
            const data = JSON.parse(res.text);
            if (data.reason === 'bad_president_password') {
              message = 'Incorrect President Submission Password.';
            }
            if (data.error === 'rate_limited') {
              message = 'Too many attempts. Try again later.';
            }
            if (data.error === 'desc_too_long') {
              message = 'Description too long.';
            }
          } catch {
            // ignore parse errors
          }

          statusEl.textContent = message;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50');
          }
          return;
        }

        statusEl.textContent = isEditMode
          ? 'Submitted! Edits pending approval.'
          : 'Submitted! Your request is pending approval.';

        form.reset();
        mtRange.classList.add('hidden');
        prereqWrap.classList.add('hidden');
        stemWrap.classList.add('hidden');
        wordCount.innerHTML = `<span class="font-semibold">0</span> / ${MAX_DESC_WORDS} words`;

        applyPalettes();
        syncPrereq();
        syncStem();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50');
        }
      })
      .catch(() => {
        statusEl.textContent = 'Network error.';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50');
        }
      });
  });
}

// Auto-init
initPresidents();
