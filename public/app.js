/* ------------------ Shared utilities + page initializers ------------------ */
// If hosted under /club-directory (Cloudflare Worker path), prefix API calls.
const PREFIX = location.pathname.startsWith('/club-directory') ? '/club-directory' : '';
const API_BASE = PREFIX || location.origin.replace(/\/$/, "");
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

/** fetch text helper */
async function fetchText(url, opts = {}) {
  const r = await fetch(url, { headers: { "Content-Type": "application/json", ...(opts.headers||{}) }, ...opts });
  const t = await r.text();
  return { ok: r.ok, status: r.status, text: t };
}

/** normalize urls for website links */
function normalizeWebsiteUrl(url) {
  if (!url) return "";
  const u = String(url).trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('//')) return 'https:' + u;
  if (u.includes(".") || u.startsWith("www.")) return "https://" + u.replace(/^\/+/, "");
  return u;
}

/* ------------------------------ Pastel palettes ------------------------------ */
const FIELD_PALETTE = {
  "STEM": ["bg-sky-50","border-sky-200","text-sky-700"],
  "Humanities": ["bg-amber-50","border-amber-200","text-amber-700"],
  "Arts / Culture": ["bg-fuchsia-50","border-fuchsia-200","text-fuchsia-700"],
  "Social Impact / Service": ["bg-orange-50","border-orange-200","text-orange-700"],
  "Sports & Wellness": ["bg-emerald-50","border-emerald-200","text-emerald-700"],
  "Faith / Identity / Other": ["bg-slate-50","border-slate-200","text-slate-700"],
  // legacy back-compat
  "Arts": ["bg-fuchsia-50","border-fuchsia-200","text-fuchsia-700"],
  "Community Service": ["bg-orange-50","border-orange-200","text-orange-700"],
  "Sports": ["bg-emerald-50","border-emerald-200","text-emerald-700"],
  "Other": ["bg-slate-50","border-slate-200","text-slate-700"]
};
const CAT_PALETTE = {
  "competition": ["bg-indigo-50","border-indigo-200","text-indigo-700"],
  "activity":    ["bg-teal-50","border-teal-200","text-teal-700"],
  "community":   ["bg-orange-50","border-orange-200","text-orange-700"],
  "research":    ["bg-cyan-50","border-cyan-200","text-cyan-700"],
  "advocacy":    ["bg-rose-50","border-rose-200","text-rose-700"],
  "outreach":    ["bg-violet-50","border-violet-200","text-violet-700"]
};
const SUB_PALETTE = {
  "Biology":                 ["bg-emerald-50","border-emerald-200","text-emerald-700"],
  "Chemistry":               ["bg-lime-50","border-lime-200","text-lime-700"],
  "Physics / Engineering":   ["bg-orange-50","border-orange-200","text-orange-700"],
  "Computer Science / Tech": ["bg-purple-50","border-purple-200","text-purple-700"],
  "Math / Data":             ["bg-sky-50","border-sky-200","text-sky-700"],
  "Medicine & Health":       ["bg-pink-50","border-pink-200","text-pink-700"]
};
const CATEGORY_KEY_TO_DISPLAY = {
  competition: "Competition-based",
  activity: "Activity-based",
  community: "Community Service–based",
  research: "Research / Academic",
  advocacy: "Awareness / Advocacy",
  outreach: "Outreach / Teaching"
};
const CATEGORY_DISPLAY_TO_KEY = Object.fromEntries(
  Object.entries(CATEGORY_KEY_TO_DISPLAY).map(([k,v])=>[v,k])
);
const FIELD_SYNONYMS = {
  "STEM": ["STEM"],
  "Humanities": ["Humanities"],
  "Arts / Culture": ["Arts / Culture","Arts"],
  "Social Impact / Service": ["Social Impact / Service","Community Service"],
  "Sports & Wellness": ["Sports & Wellness","Sports"],
  "Faith / Identity / Other": ["Faith / Identity / Other","Faith / Identity","Other"]
};

const cls = (...xs) => xs.filter(Boolean).join(" ");
function pastelBadge(text, palette){
  const [bg,border,fg] = palette || ["bg-neutral-50","border-neutral-300","text-neutral-700"];
  return `<span class="${cls("px-2 py-0.5 rounded-full text-xs border", bg, border, fg)}">${text}</span>`;
}
const chip  = (text) => `<span class="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs">${text}</span>`;

/* --------------------------------- INDEX PAGE --------------------------------- */
export function initIndex() {
  const clubList = document.getElementById("clubList");
  const resultsCount = document.getElementById("resultsCount");

  const search   = document.getElementById("search");
  const subject  = document.getElementById("subject");   // Field / Focus
  const category = document.getElementById("category");  // Category dropdown
  const subfield = document.getElementById("subfield");
  const subfieldWrap = document.getElementById("subfieldWrap");

  // STEM subfields (mirror presidents form)
  const subfieldsBySubject = {
    "STEM": [
      "Biology",
      "Chemistry",
      "Physics / Engineering",
      "Computer Science / Tech",
      "Math / Data",
      "Medicine & Health"
    ]
  };

  function showStemSubfieldsIfNeeded() {
    const isStem = (subject?.value === 'STEM');
    subfieldWrap?.classList.toggle('hidden', !isStem);
    if (!isStem && subfield) subfield.value = '';
  }
  function populateSubfields() {
    if (!subfield) return;
    const opts = subfieldsBySubject["STEM"] || [];
    subfield.innerHTML = `<option value="">All Subfields</option>` + opts.map(x=>`<option>${x}</option>`).join("");
  }

  subject?.addEventListener("change", ()=>{ showStemSubfieldsIfNeeded(); render(); });
  subfield?.addEventListener("change", render);
  category?.addEventListener("change", render);
  search?.addEventListener("input", render);

  populateSubfields();
  showStemSubfieldsIfNeeded();

  const dayBoxes = [...document.querySelectorAll('input[name="days"]')];
  dayBoxes.forEach(x => x.addEventListener('change', render));
  const getSet = (nodes) => new Set(nodes.filter(x=>x.checked).map(x=>x.value));

  async function load() {
    try{
      const { ok, text } = await fetchText(`${API_BASE}/api/clubs`);
      if (!ok) throw new Error(text);
      const data = JSON.parse(text);
      window.__clubs = data.clubs || [];
      render();
    }catch(e){
      if (clubList) clubList.innerHTML = `<p class="text-red-600">Failed to load clubs.</p>`;
      console.error(e);
    }
  }

  function fieldMatchesSelected(selectedField, clubFieldsRaw, legacySubject) {
    if (!selectedField) return true;
    const synonyms = new Set(FIELD_SYNONYMS[selectedField] || [selectedField]);
    const clubFields = (Array.isArray(clubFieldsRaw) && clubFieldsRaw.length > 0)
      ? clubFieldsRaw
      : (legacySubject ? [legacySubject] : []);
    return clubFields.some(f => synonyms.has(f));
  }

  function cardContact(c) {
    if (!c.contact_email) return '';
    const mail = esc(c.contact_email.trim());
    return `<a class="text-brand underline text-sm font-semibold" href="mailto:${mail}">Email</a>`;
  }

  function render() {
    if (!window.__clubs) return;

    const q  = (search?.value || '').trim().toLowerCase();
    const s  = subject?.value || "";  // display field label
    const sf = subfield?.value || ""; // subfield label
    const fDays = getSet(dayBoxes);

    const catDisplay = category?.value || "";
    const catKey = CATEGORY_DISPLAY_TO_KEY[catDisplay] || "";

    const filtered = (window.__clubs||[]).filter(c => {
      const catKeys = (c.categories || []);
      const catLabels = catKeys.map(k => CATEGORY_KEY_TO_DISPLAY[k] || k);

      const txt = [
        c.name, c.description,
        ...(c.fields||[]), c.subject || '',
        ...(c.subfield||[]),
        ...catKeys, ...catLabels,
        c.prerequisites || '', c.meeting_room || '',
        c.contact_email || ''
      ].join(' ').toLowerCase();

      const matchesQ = !q || txt.includes(q);
      const matchesField = fieldMatchesSelected(s, c.fields, c.subject);
      const matchesSf = !sf || (c.subfield||[]).includes(sf);
      const matchesDays = fDays.size===0 || (c.meeting_days||[]).some(d => fDays.has(d));
      const matchesCat = !catKey || (c.categories||[]).includes(catKey);

      return matchesQ && matchesField && matchesSf && matchesDays && matchesCat;
    });

    if (resultsCount) resultsCount.textContent = `${filtered.length} result${filtered.length===1?'':'s'}`;
    if (clubList) clubList.innerHTML = filtered.map(cardHTML).join("") || `<p class="text-neutral-600">No clubs match your filters yet.</p>`;
  }

  const label = (text) => `<span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">${text}</span>`;

  function meetingTimeText(c){
    if (c.meeting_time_type === 'lunch') return 'Lunch';
    if (c.meeting_time_type === 'after_school') {
      return c.meeting_time_range ? `After school (${c.meeting_time_range})` : 'After school';
    }
    return '';
  }

  function cardHTML(c){
    const websiteHref = normalizeWebsiteUrl(c.website_url);
    const websiteTag = websiteHref
      ? `<a class="text-brand underline text-sm font-semibold" href="${websiteHref}" target="_blank" rel="noopener noreferrer">Website ↗</a>`
      : '';

    const contactTag = cardContact(c);
    const rightLinks = [websiteTag, contactTag].filter(Boolean).join(' • ');

    const nameHTML = `<h3 class="text-black font-black text-xl sm:text-2xl leading-snug tracking-tight">${esc(c.name)}</h3>`;

    const focusVals = (Array.isArray(c.fields) && c.fields.length) ? c.fields : (c.subject ? [c.subject] : []);
    const focusRow = focusVals.map(v => pastelBadge(v, FIELD_PALETTE[v])).join(" ");

    const catVals = (c.categories||[]).map(k => [k, CATEGORY_KEY_TO_DISPLAY[k] || k]);
    const catRow  = catVals.map(([k, labelText]) => pastelBadge(labelText, CAT_PALETTE[k])).join(" ");

    const subRow   = (c.subfield||[]).map(v => pastelBadge(v, SUB_PALETTE[v])).join(" ");

    const scheduleRow = [
      ...(c.meeting_days||[]).map(chip),
      c.meeting_frequency ? chip(c.meeting_frequency) : '',
      meetingTimeText(c) ? chip(meetingTimeText(c)) : ''
    ].filter(Boolean).join(" ");

    const locationRow = c.meeting_room ? `<div class="space-y-1">${label('Location')}<div class="flex flex-wrap gap-2">${chip(c.meeting_room)}</div></div>` : '';

    const reqChips = [
      c.volunteer_hours ? pastelBadge('Volunteer Hours', ["bg-emerald-50","border-emerald-200","text-emerald-700"]) : '',
      c.open_to_all ? pastelBadge('Open to all', ["bg-emerald-50","border-emerald-200","text-emerald-700"]) : '',
      c.prereq_required ? pastelBadge('Prerequisite', ["bg-amber-50","border-amber-200","text-amber-700"]) : ''
    ].filter(Boolean).join(" ");

    const prereqDetail = (c.prereq_required && c.prerequisites)
      ? `<div class="text-xs text-neutral-600 leading-relaxed"><span class="font-semibold">Details:</span> ${esc(c.prerequisites)}</div>`
      : '';

    const fullDesc = c.description || 'No description yet.';
    const shortDesc = fullDesc.length > 280 ? fullDesc.slice(0, 280) + '…' : fullDesc;

    return `
<article class="bg-white border border-neutral-300 rounded-2xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
  <div class="bg-gradient-to-r from-brand/20 to-transparent h-2"></div>
  <div class="p-4">
    <div class="flex items-start justify-between gap-3">
      ${nameHTML}
      <div class="flex items-center gap-2">${rightLinks}</div>
    </div>
    <div class="mt-3 space-y-3 text-sm">
      ${focusRow ? `<div class="space-y-1">${label('Focus')}<div class="flex flex-wrap gap-2">${focusRow}</div></div>` : ''}
      ${catRow   ? `<div class="space-y-1">${label('Categories')}<div class="flex flex-wrap gap-2">${catRow}</div></div>` : ''}
      ${(c.subfield||[]).length ? `<div class="space-y-1">${label('Subfields')}<div class="flex flex-wrap gap-2">${subRow}</div></div>` : ''}
      ${scheduleRow ? `<div class="space-y-1">${label('Schedule')}<div class="flex flex-wrap gap-2">${scheduleRow}</div></div>` : ''}
      ${locationRow}
      ${(reqChips || prereqDetail) ? `<div class="space-y-1">${label('Eligibility & Perks')}<div class="flex flex-wrap gap-2 items-center">${reqChips}</div>${prereqDetail}</div>` : ''}
      <div class="space-y-1">${label('Description')}
        <p class="text-neutral-800 leading-relaxed" data-desc-full="${encodeURIComponent(fullDesc)}">
          ${shortDesc}
          ${fullDesc.length>280 ? `<button class="ml-1 underline text-brand text-xs" data-more>More</button>` : ''}
        </p>
      </div>
    </div>
  </div>
</article>
`;
  }

  // delegate More/Less toggles
  document.addEventListener('click', (e)=>{
    const more = e.target.closest('button[data-more]');
    if (more) {
      e.preventDefault();
      const p = more.closest('p');
      const full = decodeURIComponent(p.getAttribute('data-desc-full') || '');
      p.innerHTML = `${full} <button class="ml-1 underline text-brand text-xs" data-less>Less</button>`;
      return;
    }
    const less = e.target.closest('button[data-less]');
    if (less) {
      e.preventDefault();
      const p = less.closest('p');
      const full = decodeURIComponent(p.getAttribute('data-desc-full') || '');
      const short = full.length > 280 ? full.slice(0,280)+'…' : full;
      p.innerHTML = `${short} ${full.length>280 ? `<button class="ml-1 underline text-brand text-xs" data-more>More</button>` : ''}`;
    }
  });

  load();
}

/* ------------------------------ PRESIDENTS PAGE ------------------------------ */
export function initPresidents() {
  const form = document.getElementById('presForm');
  const status = document.getElementById('status');
  const mtRange = document.getElementById('mt_range');
  const desc = document.getElementById('desc');
  const wordCount = document.getElementById('wordCount');

  const prereqRequired = document.getElementById('prereq_required');
  const prereqWrap = document.getElementById('prereq_text_wrap');
  const stemWrap = document.getElementById('stemSubfieldsWrap');

  // Custom meeting frequency handler
  const mfSelect = document.getElementById('mf_select');
  const mfCustom = document.getElementById('mf_custom');

  function getCheckedValues(name){
    return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value);
    }
  function getRadio(name){
    const n = form.querySelector(`input[name="${name}"]:checked`);
    return n ? n.value : '';
  }
  function setError(key, show){
    const el = form.querySelector(`[data-error="${key}"]`);
    if (el) el.classList.toggle('hidden', !show);
  }

  form.addEventListener('input', (e)=>{
    if (e.target.name === 'meeting_time_type') {
      const v = getRadio('meeting_time_type');
      mtRange.classList.toggle('hidden', v !== 'after_school');
    }
    if (e.target === mfSelect) {
      const isCustom = mfSelect.value === 'custom';
      mfCustom.classList.toggle('hidden', !isCustom);
    }
  });

  function syncPrereq() {
    const on = !!prereqRequired?.checked;
    prereqWrap?.classList.toggle('hidden', !on);
    if (!on) {
      const input = prereqWrap?.querySelector('input[name="prerequisites"]');
      if (input) input.value = '';
    }
  }
  prereqRequired?.addEventListener('change', syncPrereq);
  syncPrereq();

  function syncStem() {
    const fieldsChecked = getCheckedValues('fields');
    const show = fieldsChecked.includes('STEM');
    stemWrap?.classList.toggle('hidden', !show);
    if (!show) form.querySelectorAll('input[name="subfields"]').forEach(cb=>cb.checked=false);
  }
  form.querySelectorAll('input[name="fields"]').forEach(cb=>cb.addEventListener('change', syncStem));
  syncStem();

  const updateWords = ()=>{
    const words = (desc?.value?.trim().match(/\S+/g) || []).length;
    if (wordCount) {
      wordCount.innerHTML = `<span class="font-semibold">${words}</span> / 200 words`;
      wordCount.classList.toggle('text-red-600', words > 200);
    }
    setError('description', words > 200);
  };
  desc?.addEventListener('input', updateWords);
  updateWords();

  // live pastel highlights (click previews)
  const FIELD_P = {
    "STEM":["bg-sky-50","border-sky-200","text-sky-700"],
    "Humanities":["bg-amber-50","border-amber-200","text-amber-700"],
    "Arts / Culture":["bg-fuchsia-50","border-fuchsia-200","text-fuchsia-700"],
    "Social Impact / Service":["bg-orange-50","border-orange-200","text-orange-700"],
    "Sports & Wellness":["bg-emerald-50","border-emerald-200","text-emerald-700"],
    "Faith / Identity / Other":["bg-slate-50","border-slate-200","text-slate-700"]
  };
  const CAT_P = {
    "competition":["bg-indigo-50","border-indigo-200","text-indigo-700"],
    "activity":["bg-teal-50","border-teal-200","text-teal-700"],
    "community":["bg-orange-50","border-orange-200","text-orange-700"],
    "research":["bg-cyan-50","border-cyan-200","text-cyan-700"],
    "advocacy":["bg-rose-50","border-rose-200","text-rose-700"],
    "outreach":["bg-violet-50","border-violet-200","text-violet-700"]
  };
  const SUB_P = SUB_PALETTE;
  const paletteMap = {
    "field:STEM":FIELD_P["STEM"],
    "field:Humanities":FIELD_P["Humanities"],
    "field:Arts / Culture":FIELD_P["Arts / Culture"],
    "field:Social Impact / Service":FIELD_P["Social Impact / Service"],
    "field:Sports & Wellness":FIELD_P["Sports & Wellness"],
    "field:Faith / Identity / Other":FIELD_P["Faith / Identity / Other"],
    "cat:competition":CAT_P["competition"],
    "cat:activity":CAT_P["activity"],
    "cat:community":CAT_P["community"],
    "cat:research":CAT_P["research"],
    "cat:advocacy":CAT_P["advocacy"],
    "cat:outreach":CAT_P["outreach"],
    "sub:Biology":SUB_P["Biology"],
    "sub:Chemistry":SUB_P["Chemistry"],
    "sub:Physics / Engineering":SUB_P["Physics / Engineering"],
    "sub:Computer Science / Tech":SUB_P["Computer Science / Tech"],
    "sub:Math / Data":SUB_P["Math / Data"],
    "sub:Medicine & Health":SUB_P["Medicine & Health"]
  };
  function applyPalette(labelEl, on) {
    const key = labelEl.getAttribute('data-palette');
    const pal = paletteMap[key];
    const base = ["border","cursor-pointer","rounded","px-2","py-1","flex","items-center","gap-2"];
    labelEl.className = base.join(" ");
    if (on && pal) labelEl.classList.add(pal[0], pal[1], pal[2]);
    else labelEl.classList.add("border-neutral-300");
  }
  function wirePalette(groupSelector) {
    document.querySelectorAll(`${groupSelector} [data-palette]`).forEach(lbl=>{
      const input = lbl.querySelector('input[type="checkbox"]');
      if (!input) return;
      const sync = ()=> applyPalette(lbl, input.checked);
      input.addEventListener('change', sync);
      sync();
    });
  }
  wirePalette('#fieldsGroup');
  wirePalette('#categoriesGroup');
  wirePalette('#subfieldsGroup');

  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = 'Submitting…';

    const freqSel = form.querySelector('select[name="meeting_frequency"]').value;
    const freqCustom = (document.getElementById('mf_custom')?.value || '').trim();
    const meeting_frequency = (freqSel === 'custom') ? freqCustom : freqSel;

    const timeType = (form.querySelector('input[name="meeting_time_type"]:checked')||{}).value || '';
    const days = [...form.querySelectorAll('input[name="meeting_days"]:checked')].map(x=>x.value);
    const afterRange = form.querySelector('input[name="meeting_time_range"]').value.trim();
    const words = (desc?.value?.trim().match(/\S+/g) || []).length;
    const meetingRoomVal = (form.querySelector('input[name="meeting_room"]')?.value || '').trim();

    const setErr = (k, s)=>{ const el = form.querySelector(`[data-error="${k}"]`); if (el) el.classList.toggle('hidden', !s); };
    setErr('meeting_frequency', !meeting_frequency);
    setErr('meeting_time_type', !timeType);
    setErr('meeting_days', days.length === 0);
    setErr('meeting_time_range', (timeType === 'after_school' && !afterRange));
    setErr('description', words > 200);
    setErr('meeting_room', !meetingRoomVal);

    const hasError = (!meeting_frequency || !timeType || days.length===0 || (timeType==='after_school' && !afterRange) || !meetingRoomVal || words>200);
    if (hasError) { status.textContent = 'Please complete the required fields.'; return; }

    const fd = new FormData(form);
    const volunteerRadio = form.querySelector('input[name="volunteer_hours"]:checked');
    const rawWebsite = fd.get('website_url') || '';
    const website_url = normalizeWebsiteUrl(rawWebsite);

    const contact_email = (fd.get('contact_email') || '').trim();

    const payload = {
      club_name: fd.get('club_name'),
      president_submit_password: fd.get('president_submit_password'),
      // president_code intentionally removed (no longer used)
      contact_email: contact_email || undefined,
      website_url,
      fields: [...form.querySelectorAll('input[name="fields"]:checked')].map(x=>x.value),
      categories: [...form.querySelectorAll('input[name="categories"]:checked')].map(x=>x.value),
      subfields: [...form.querySelectorAll('input[name="subfields"]:checked')].map(x=>x.value),
      meeting_days: days,
      meeting_frequency,
      meeting_time_type: timeType,
      meeting_time_range: afterRange,
      meeting_room: meetingRoomVal,
      volunteer_hours: volunteerRadio ? (volunteerRadio.value === 'true') : undefined,
      open_to_all: !!fd.get('open_to_all') || undefined,
      prereq_required: !!fd.get('prereq_required') || undefined,
      prerequisites: (fd.get('prereq_required') ? (fd.get('prerequisites') || '') : '' ),
      description: (desc?.value || '')
    };

    const dbgPayload = document.getElementById('debugPayload');
    if (dbgPayload) dbgPayload.textContent = JSON.stringify(payload, null, 2);

    try{
      const { ok, text } = await fetchText(`${API_BASE}/api/presidents/submit`, {
        method:'POST',
        body: JSON.stringify(payload)
      });

      const dbgResponse = document.getElementById('debugResponse');
      let shown; try { shown = JSON.stringify(JSON.parse(text), null, 2); } catch { shown = text; }
      if (dbgResponse) dbgResponse.textContent = shown;

      if (!ok) {
        try {
          const data = JSON.parse(text);
          if (data.reason === 'bad_president_password') {
            status.textContent = 'Error: President Submission Password is wrong. Ask your commissioner.';
          } else if (data.error === 'missing_required') {
            status.textContent = `Missing required: ${data.fields.join(', ')}`;
          } else if (data.error === 'desc_too_long') {
            status.textContent = `Description too long (${data.words} words).`;
          } else if (data.error === 'rate_limited') {
            status.textContent = `Too many attempts. Try again later.`;
          } else if (data.mysql_code) {
            status.textContent = `DB Error (${data.mysql_code}): ${data.mysql_message || 'see console'}`;
          } else {
            status.textContent = 'Failure to submit. See Debug panel for details.';
          }
        } catch {
          status.textContent = 'Failure to submit. See Debug panel for details.';
        }
        return;
      }

      status.textContent = 'Submitted! Your club is live.';
      form.reset();
      document.getElementById('mt_range').classList.add('hidden');
      document.getElementById('prereq_text_wrap')?.classList.add('hidden');
      document.getElementById('stemSubfieldsWrap')?.classList.add('hidden');
      document.getElementById('mf_custom')?.classList.add('hidden');
      const wc = document.getElementById('wordCount');
      if (wc) wc.innerHTML = '<span class="font-semibold">0</span> / 200 words';
      ['#fieldsGroup','#categoriesGroup','#subfieldsGroup'].forEach(w=> {
        document.querySelectorAll(`${w} [data-palette]`).forEach(lbl=>{
          lbl.className = "border cursor-pointer rounded px-2 py-1 flex items-center gap-2 border-neutral-300";
          const input = lbl.querySelector('input[type="checkbox"]'); if (input) input.checked = false;
        });
      });
    }catch(err){
      console.error(err);
      status.textContent = 'Failure to submit (network). See console.';
      const dbgResponse = document.getElementById('debugResponse');
      if (dbgResponse) dbgResponse.textContent = String(err);
    }
  });
}

/* ---------------------------------- ADMIN PAGE ---------------------------------- */
async function sha256HexBrowser(s){
  if (!window.crypto?.subtle) return null;
  const buf = new TextEncoder().encode(String(s));
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

export function initAdmin() {
  const form = document.getElementById("adminLogin");
  const panel = document.getElementById("adminPanel");
  const table = document.getElementById("adminTableBody");

  async function fetchJSON(url, opts = {}) {
    const r = await fetch(url, { headers: { "Content-Type": "application/json", ...(opts.headers||{}) }, ...opts });
    const t = await r.text();
    if (!r.ok) throw new Error(t);
    return JSON.parse(t);
  }

  form?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const code = (new FormData(form)).get("code");
    try{
      const hash = await sha256HexBrowser(code);
      let body;
      if (hash) body = JSON.stringify({ code_hash: hash });
      else      body = JSON.stringify({ code });
      await fetchJSON(`${API_BASE}/api/admin/login`, { method:"POST", body });
      if (hash) {
        localStorage.setItem('ADMIN_HASH', hash);
        localStorage.removeItem('ADMIN_CODE');
      } else {
        localStorage.setItem('ADMIN_CODE', code);
      }
      form.classList.add("hidden");
      panel.classList.remove("hidden");
      load();
    }catch(e){ alert("Invalid code"); }
  });

  async function authHeaders(){
    const h = {};
    const hash = localStorage.getItem('ADMIN_HASH');
    if (hash) h['x-admin-hash'] = hash;
    else {
      const code = localStorage.getItem('ADMIN_CODE') || '';
      if (code) h['x-admin-code'] = code;
    }
    return h;
  }

  async function load(){
    const headers = await authHeaders();
    const { clubs } = await fetchJSON(`${API_BASE}/api/admin/clubs`, { headers });
    table.innerHTML = clubs.map(rowHTML).join("");
    table.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', onAction);
    });
  }

  function rowHTML(c){
    const desc = (c.description||'').slice(0,120) + ((c.description||'').length>120?'…':'');
    const meta = [
      ...(c.fields||[]),
      ...((c.categories||[]).map(k=>CATEGORY_KEY_TO_DISPLAY[k]||k))
    ].join(' • ');

    const websiteHref = normalizeWebsiteUrl(c.website_url);
    const website = websiteHref ? `<a class="text-brand underline" href="${websiteHref}" target="_blank" rel="noopener">Open ↗</a>` : '';

    const contact = c.contact_email ? `<a class="text-brand underline" href="mailto:${esc(c.contact_email)}">${esc(c.contact_email)}</a>` : '';

    return `
<tr class="border-b" data-id="${c.id}">
  <td class="px-3 py-2">
    <div class="font-semibold">${esc(c.name)}</div>
    <div class="text-neutral-600 text-xs">${meta}</div>
  </td>
  <td class="px-3 py-2">${contact}</td>
  <td class="px-3 py-2">${website || ''}</td>
  <td class="px-3 py-2">${(c.meeting_days||[]).join(", ")}</td>
  <td class="px-3 py-2">${c.meeting_room || ''}</td>
  <td class="px-3 py-2">${c.status||'approved'}</td>
  <td class="px-3 py-2">${esc(desc)}</td>
  <td class="px-3 py-2">
    <div class="flex flex-wrap gap-2">
      <button class="px-3 py-1 rounded-lg border-2 border-brand text-brand font-bold hover:text-brand700 hover:border-brand700" data-action="edit">Edit</button>
      <button class="px-3 py-1 rounded-lg border-2 border-brand text-brand font-bold hover:text-brand700 hover:border-brand700" data-action="delete">Delete</button>
    </div>
  </td>
</tr>
`;
  }

  async function onAction(e){
    const tr = e.target.closest('tr'); const id = tr.dataset.id;
    const action = e.target.dataset.action;
    const headers = await authHeaders();
    if (action==="delete"){
      if (confirm("Delete this club?")){
        await fetchText(`${API_BASE}/api/clubs/${id}`, {method:"DELETE", headers});
        tr.remove();
      }
    } else if (action==="edit"){
      const { ok, text } = await fetchText(`${API_BASE}/api/clubs/${id}`, { headers });
      if (!ok) return alert('Failed to fetch club');
      const current = JSON.parse(text);
      const newDesc = prompt("Edit description:", current.club.description||"");
      if (newDesc!==null){
        const r = await fetchText(`${API_BASE}/api/clubs/${id}`, {method:"PATCH", body:JSON.stringify({description:newDesc}), headers});
        if (!r.ok) return alert('Failed to update');
        tr.querySelectorAll("td")[6].textContent = (newDesc||'').slice(0,120) + ((newDesc||'').length>120?'…':'');
      }
    }
  }
}
