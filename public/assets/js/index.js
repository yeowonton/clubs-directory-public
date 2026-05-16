// index.js (SECURITY-PATCHED, DROP-IN REPLACEMENT)
'use strict';

import {
  API_BASE,
  esc,
  fetchText,
  normalizeWebsiteUrl,
  contactHref,
  cls,
  byId,
  FIELD_PALETTE,
  CAT_PALETTE,
  SUB_PALETTE,
  pastelBadge,
  chip
} from './shared.js';

/* ============================================================================
   INDEX PAGE INITIALIZATION
   ============================================================================ */

export function initIndex() {
  const clubList = byId('clubList');
  const resultsCount = byId('resultsCount');

  const search = byId('search');
  const subject = byId('subject');
  const category = byId('category');
  const subfield = byId('subfield');
  const subfieldWrap = byId('subfieldWrap');

  const dayBoxes = [...document.querySelectorAll('input[name="meeting_days"]')];

  /* --------------------------------------------------------------------------
     STEM Subfields
     -------------------------------------------------------------------------- */
  const SUBFIELDS_BY_FIELD = {
    STEM: [
      'Biology',
      'Chemistry',
      'Physics / Engineering',
      'Computer Science / Tech',
      'Math / Data',
      'Medicine & Health'
    ]
  };

  /* --------------------------------------------------------------------------
     Category display map
     -------------------------------------------------------------------------- */
  const CATEGORY_KEY_TO_DISPLAY = {
    competition: 'Competition-based',
    activity: 'Activity-based',
    community: 'Community Service–based',
    research: 'Research / Academic',
    advocacy: 'Awareness / Advocacy',
    outreach: 'Outreach / Teaching'
  };

  const CATEGORY_DISPLAY_TO_KEY = Object.fromEntries(
    Object.entries(CATEGORY_KEY_TO_DISPLAY).map(([k, v]) => [v, k])
  );

  /* ============================================================================
     FILTER UI
     ============================================================================ */

  function populateSubfields() {
    if (!subfield) return;
    const opts = SUBFIELDS_BY_FIELD['STEM'] || [];
    let html = '<option value="">All Subfields</option>';
    for (const s of opts) html += `<option>${esc(s)}</option>`;
    subfield.innerHTML = html;
  }

  function toggleSubfields() {
    const isSTEM = subject.value === 'STEM';
    subfieldWrap.classList.toggle('hidden', !isSTEM);
    if (!isSTEM) subfield.value = '';
  }

  /* Register filter listeners */
  subject?.addEventListener('change', render);
  subject?.addEventListener('change', toggleSubfields);
  category?.addEventListener('change', render);
  subfield?.addEventListener('change', render);
  search?.addEventListener('input', render);
  dayBoxes.forEach((box) => box.addEventListener('change', render));

  populateSubfields();
  toggleSubfields();

  /* ============================================================================
     LOAD APPROVED CLUBS (public only)
     ============================================================================ */

  function load() {
    fetchText(`${API_BASE}/api/clubs`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load clubs.');

        let data;
        try {
          data = JSON.parse(res.text);
        } catch {
          data = res.text;
        }

        const clubs = Array.isArray(data) ? data : data.clubs || [];

        // Only load *approved* clubs on public index
        window.__clubs = clubs.filter(
          (c) => c && c.status === 'approved'
        );

        render();
      })
      .catch(() => {
        clubList.innerHTML =
          `<p class="text-red-600">Failed to load clubs.</p>`;
      });
  }

  /* ============================================================================
     CARD GENERATOR
     ============================================================================ */

  function cardHTML(c) {
    if (!c || typeof c !== 'object') return '';

    const safeName = esc(c.name || 'Unnamed Club');

    /* --- Website link --- */
    const safeURL = normalizeWebsiteUrl(c.website_url);
    const siteHTML = safeURL
      ? `<a class="text-brand underline text-sm font-semibold"
            href="${esc(safeURL)}"
            target="_blank"
            rel="noopener noreferrer">Website ↗</a>`
      : '';

    /* --- Focus fields --- */
    const focusFields = c.fields?.length ? c.fields : (c.subject ? [c.subject] : []);
    const focusRow = focusFields
      .map((f) => pastelBadge(f, FIELD_PALETTE[f]))
      .join(' ');

    /* --- Category badges --- */
    const catRow = (c.categories || [])
      .map((key) =>
        pastelBadge(
          CATEGORY_KEY_TO_DISPLAY[key] || key,
          CAT_PALETTE[key]
        )
      )
      .join(' ');

    /* --- Subfield badges --- */
    const subs = c.subfields || c.subfield || [];
    const subRow = subs.map((s) => pastelBadge(s, SUB_PALETTE[s])).join(' ');

    /* --- Meeting Schedule --- */
    const scheduleChips = [];

    (c.meeting_days || []).forEach((d) => scheduleChips.push(chip(d)));
    if (c.meeting_frequency) scheduleChips.push(chip(c.meeting_frequency));

    let mt = '';
    if (c.meeting_time_type === 'lunch') mt = 'Lunch';
    if (c.meeting_time_type === 'after_school') {
      mt = `After School${
        c.meeting_time_range ? ` (${esc(c.meeting_time_range)})` : ''
      }`;
    }
    if (mt) scheduleChips.push(chip(mt));

    /* --- Contact --- */
    let contactHTML = '';
    if (c.president_contact) {
      const href = contactHref(c.president_contact);
      const mail = /^mailto:/i.test(href);

      contactHTML = `
        <div class="space-y-1">
          <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Contact</span>
          <div>
            <a class="underline text-brand"
               href="${esc(href)}"${mail ? '' : ' target="_blank" rel="noopener"'}>${esc(
        c.president_contact
      )}${mail ? '' : ' ↗'}</a>
          </div>
        </div>`;
    }

    /* --- Requirements / perks --- */
    const reqChips = [];
    if (c.volunteer_hours) reqChips.push(pastelBadge('Volunteer Hours', CAT_PALETTE.activity));
    if (c.open_to_all) reqChips.push(pastelBadge('Open to all', CAT_PALETTE.activity));
    if (c.prereq_required) reqChips.push(pastelBadge('Prerequisite', CAT_PALETTE.advocacy));

    const prereqHTML =
      c.prereq_required && c.prerequisites
        ? `<div class="text-xs text-neutral-600 leading-relaxed"><b>Details:</b> ${esc(
            c.prerequisites
          )}</div>`
        : '';

    /* --- Description --- */
    const fullDesc = c.description || 'No description yet.';
    const shortDesc =
      fullDesc.length > 280 ? fullDesc.slice(0, 280) + '…' : fullDesc;

    return `
<article class="bg-white border border-neutral-300 rounded-2xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
  <div class="bg-gradient-to-r from-brand/20 to-transparent h-2"></div>
  <div class="p-4 space-y-4">

    <div class="flex items-start justify-between gap-3">
      <h3 class="text-black font-black text-xl sm:text-2xl leading-snug">${safeName}</h3>
      ${siteHTML}
    </div>

    ${focusRow ? `
      <div>
        <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Focus</span>
        <div class="flex flex-wrap gap-2 mt-1">${focusRow}</div>
      </div>` : ''}

    ${catRow ? `
      <div>
        <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Categories</span>
        <div class="flex flex-wrap gap-2 mt-1">${catRow}</div>
      </div>` : ''}

    ${subRow ? `
      <div>
        <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Subfields</span>
        <div class="flex flex-wrap gap-2 mt-1">${subRow}</div>
      </div>` : ''}

    ${scheduleChips.length ? `
      <div>
        <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Schedule</span>
        <div class="flex flex-wrap gap-2 mt-1">${scheduleChips.join(' ')}</div>
      </div>` : ''}

    ${c.meeting_room ? `
      <div>
        <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Location</span>
        <div class="flex flex-wrap gap-2 mt-1">${chip(c.meeting_room)}</div>
      </div>` : ''}

    ${contactHTML}

    ${(reqChips.length || prereqHTML) ? `
      <div>
        <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Eligibility & Perks</span>
        <div class="flex flex-wrap gap-2 mt-1">${reqChips.join(' ')}</div>
        ${prereqHTML}
      </div>` : ''}

    <div>
      <span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">Description</span>
      <p class="text-neutral-800 leading-relaxed whitespace-pre-line"
         data-desc-full="${encodeURIComponent(fullDesc)}">
        ${esc(shortDesc)}
        ${fullDesc.length > 280 ? ` <button class="ml-1 underline text-brand text-xs" data-more>More</button>` : ''}
      </p>
    </div>

  </div>
</article>`;
  }

  /* ============================================================================
     FILTERING
     ============================================================================ */

  function getSelectedDays() {
    const set = {};
    dayBoxes.forEach((box) => {
      if (box.checked) set[box.value] = true;
    });
    return set;
  }

  function render() {
    if (!window.__clubs) return;

    const q = (search?.value || '').trim().toLowerCase();
    const selectedField = subject?.value || '';
    const selectedSubfield = subfield?.value || '';
    const selectedCatDisplay = category?.value || '';
    const selectedCatKey = CATEGORY_DISPLAY_TO_KEY[selectedCatDisplay] || '';
    const daySet = getSelectedDays();

    const filtered = window.__clubs.filter((c) => {
      if (!c || typeof c !== 'object') return false;

      const subs = c.subfields || c.subfield || [];
      const fields = c.fields || (c.subject ? [c.subject] : []);

      /* TEXT SEARCH */
      const hay = [
        c.name || '',
        c.description || '',
        fields.join(' '),
        subs.join(' '),
        (c.categories || []).join(' '),
        c.prerequisites || '',
        c.meeting_room || ''
      ]
        .join(' ')
        .toLowerCase();

      if (q && !hay.includes(q)) return false;

      if (selectedField && !fields.includes(selectedField)) return false;

      if (selectedSubfield && !subs.includes(selectedSubfield)) return false;

      if (selectedCatKey && !(c.categories || []).includes(selectedCatKey))
        return false;

      if (Object.keys(daySet).length) {
        const clubDays = c.meeting_days || [];
        const overlap = clubDays.some((d) => daySet[d]);
        if (!overlap) return false;
      }

      return true;
    });

    /* UPDATE UI */
    resultsCount.textContent =
      filtered.length + (filtered.length === 1 ? ' result' : ' results');

    clubList.innerHTML =
      filtered.length
        ? filtered.map(cardHTML).join('')
        : `<p class="text-neutral-600">No clubs match your filters.</p>`;
  }

  /* ============================================================================
     MORE / LESS BUTTON HANDLERS
     ============================================================================ */

  document.addEventListener('click', (e) => {
    const tgt = e.target;
    if (!tgt) return;

    const p = tgt.closest('p[data-desc-full]');
    if (!p) return;

    const full = decodeURIComponent(p.dataset.descFull);

    if (tgt.matches('[data-more]')) {
      p.innerHTML =
        esc(full) +
        ` <button class="ml-1 underline text-brand text-xs" data-less>Less</button>`;
    } else if (tgt.matches('[data-less]')) {
      const short = full.length > 280 ? full.slice(0, 280) + '…' : full;
      p.innerHTML =
        esc(short) +
        (full.length > 280
          ? ` <button class="ml-1 underline text-brand text-xs" data-more>More</button>`
          : '');
    }
  });

  /* ============================================================================
     INITIAL LOAD
     ============================================================================ */
  load();
}

initIndex();
