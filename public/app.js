/* Shared utilities + page initializers */
const API_BASE = location.origin.replace(/\/$/, "");
async function fetchText(url, opts = {}) {
  const r = await fetch(url, { headers: { "Content-Type": "application/json", ...(opts.headers||{}) }, ...opts });
  const t = await r.text();
  return { ok: r.ok, status: r.status, text: t };
}
function normalizeWebsiteUrl(url) {
  if (!url) return "";
  const u = String(url).trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (u.includes(".") || u.startsWith("www.")) return "https://" + u.replace(/^\/+/, "");
  return u;
}

/* ---------- Pastel palettes ---------- */
const FIELD_PALETTE = {
  "STEM":              ["bg-sky-50","border-sky-200","text-sky-700"],
  "Humanities":        ["bg-amber-50","border-amber-200","text-amber-700"],
  "Arts":              ["bg-fuchsia-50","border-fuchsia-200","text-fuchsia-700"],
  "Community Service": ["bg-orange-50","border-orange-200","text-orange-700"],
  "Sports":            ["bg-emerald-50","border-emerald-200","text-emerald-700"],
  "Other":             ["bg-slate-50","border-slate-200","text-slate-700"]
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
  "Biology":                   ["bg-emerald-50","border-emerald-200","text-emerald-700"],
  "Chemistry":                 ["bg-lime-50","border-lime-200","text-lime-700"],
  "Physics / Engineering":     ["bg-orange-50","border-orange-200","text-orange-700"],
  "Computer Science / Tech":   ["bg-purple-50","border-purple-200","text-purple-700"],
  "Math / Data":               ["bg-sky-50","border-sky-200","text-sky-700"],
  "Medicine & Health":         ["bg-pink-50","border-pink-200","text-pink-700"]
};

const cls = (...xs) => xs.filter(Boolean).join(" ");
function pastelBadge(text, palette){
  const [bg,border,fg] = palette || ["bg-neutral-50","border-neutral-300","text-neutral-700"];
  return `<span class="${cls("px-2 py-0.5 rounded-full text-xs border", bg, border, fg)}">${text}</span>`;
}
const chip  = (text) => `<span class="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs">${text}</span>`;

/* ---------- INDEX PAGE ---------- */
export function initIndex() {
  const clubList = document.getElementById("clubList");
  const resultsCount = document.getElementById("resultsCount");
  const search = document.getElementById("search");

  const subject = document.getElementById("subject");
  const subfield = document.getElementById("subfield");
  const subfieldWrap = document.getElementById("subfieldWrap");

  const subfieldsBySubject = {
    "STEM": ["Biology","Chemistry","Physics","Computer Science","Math","Engineering","Environmental Sci"]
  };

  function showStemSubfieldsIfNeeded() {
    const isStem = (subject?.value === 'STEM');
    subfieldWrap?.classList.toggle('hidden', !isStem);
    if (!isStem && subfield) subfield.value = '';
  }
  function populateSubfields() {
    if (!subfield) return;
    const opts = subfieldsBySubject["STEM"] || [];
    subfield.innerHTML = `<option value="">STEM Subfield (all)</option>` + opts.map(x=>`<option>${x}</option>`).join("");
  }

  subject?.addEventListener("change", ()=>{ showStemSubfieldsIfNeeded(); render(); });
  subfield?.addEventListener("change", render);
  populateSubfields();
  showStemSubfieldsIfNeeded();

  const dayBoxes = [...document.querySelectorAll('input[name="days"]')];
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

  function render() {
    if (!window.__clubs) return;
    const q = (search?.value || '').trim().toLowerCase();
    const s = subject?.value || "";
    const sf = subfield?.value || "";
    const fDays = getSet(dayBoxes);

    const filtered = (window.__clubs||[]).filter(c => {
      const txt = `${c.name} ${c.description} ${(c.fields||[]).join(" ")} ${(c.categories||[]).join(" ")} ${(c.subfield||[]).join(" ")} ${(c.prerequisites||'')}`.toLowerCase();
      const matchesQ = !q || txt.includes(q);

      const clubSubject = (c.fields && c.fields[0]) || c.subject;
      const matchesS  = !s  || clubSubject === s;
      const matchesSf = !sf || (c.subfield||[]).includes(sf);
      const matchesDays = fDays.size===0 || (c.meeting_days||[]).some(d => fDays.has(d));

      return matchesQ && matchesS && matchesSf && matchesDays;
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

    const nameHTML = `<h3 class="text-black font-black text-xl sm:text-2xl leading-snug tracking-tight">${c.name}</h3>`;

    const focusVals = (c.fields && c.fields.length ? c.fields : (c.subject ? [c.subject] : []));
    const focusRow = focusVals.map(v => pastelBadge(v, FIELD_PALETTE[v])).join(" ");

    const catVals = (c.categories||[]).map(k => [k, k.charAt(0).toUpperCase()+k.slice(1)]);
    const catRow  = catVals.map(([k, label]) => pastelBadge(label, CAT_PALETTE[k])).join(" ");

    const subRow   = (c.subfield||[]).map(v => pastelBadge(v, SUB_PALETTE[v])).join(" ");

    const scheduleRow = [
      ...(c.meeting_days||[]).map(chip),
      c.meeting_frequency ? chip(c.meeting_frequency) : '',
      meetingTimeText(c) ? chip(meetingTimeText(c)) : ''
    ].filter(Boolean).join(" ");

    const reqBadges = [
      c.open_to_all ? pastelBadge('Open', ["bg-emerald-50","border-emerald-200","text-emerald-700"]) : '',
      c.prereq_required ? pastelBadge('Prereq', ["bg-amber-50","border-amber-200","text-amber-700"]) : ''
    ].filter(Boolean).join(" ");
    const prereqText = c.prereq_required && c.prerequisites
      ? `<div class="text-xs text-neutral-700"><span class="font-semibold">Prereqs:</span> ${c.prerequisites}</div>` : '';

    const desc = c.description || 'No description yet.';

    return `
<article class="bg-white border border-neutral-300 rounded-2xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
  <div class="bg-gradient-to-r from-brand/20 to-transparent h-2"></div>
  <div class="p-4">
    <div class="flex items-start justify-between gap-3">
      ${nameHTML}
      ${websiteTag}
    </div>
    <div class="mt-3 space-y-3 text-sm">
      ${focusRow ? `<div class="space-y-1">${label('Focus')}<div class="flex flex-wrap gap-2">${focusRow}</div></div>` : ''}
      ${catRow   ? `<div class="space-y-1">${label('Categories')}<div class="flex flex-wrap gap-2">${catRow}</div></div>` : ''}
      ${(c.subfield||[]).length ? `<div class="space-y-1">${label('Subfields')}<div class="flex flex-wrap gap-2">${subRow}</div></div>` : ''}
      ${scheduleRow ? `<div class="space-y-1">${label('Schedule')}<div class="flex flex-wrap gap-2">${scheduleRow}</div></div>` : ''}
      ${reqBadges || prereqText ? `<div class="space-y-1">${label('Requirements')}<div class="flex flex-wrap gap-2">${reqBadges}</div>${prereqText}</div>` : ''}
      <div class="space-y-1">${label('Description')}<p class="text-neutral-800 leading-relaxed">${desc}</p></div>
    </div>
  </div>
</article>
`;
  }

  [search, subject, subfield, ...document.querySelectorAll('input[name="days"]')]
    .forEach(el => el && el.addEventListener('input', render));

  load();
}

/* ---------- PRESIDENTS PAGE ---------- */
export function initPresidents() {
  const form = document.getElementById('presForm');
  const status = document.getElementById('status');
  const mtRange = document.getElementById('mt_range');
  const dbgPayload = document.getElementById('debugPayload');
  const dbgResponse = document.getElementById('debugResponse');
  const desc = document.getElementById('desc');
  const wordCount = document.getElementById('wordCount');

  const prereqRequired = document.getElementById('prereq_required');
  const prereqWrap = document.getElementById('prereq_text_wrap');
  const stemWrap = document.getElementById('stemSubfieldsWrap');

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
    if (wordCount) wordCount.innerHTML = `<span class="font-semibold">${words}</span> / 200 words`;
    setError('description', words > 200);
  };
  desc?.addEventListener('input', updateWords);
  updateWords();

  const FIELD_PALETTE = {
    "STEM":["bg-sky-50","border-sky-200","text-sky-700"],
    "Humanities":["bg-amber-50","border-amber-200","text-amber-700"],
    "Arts":["bg-fuchsia-50","border-fuchsia-200","text-fuchsia-700"],
    "Community Service":["bg-orange-50","border-orange-200","text-orange-700"],
    "Sports":["bg-emerald-50","border-emerald-200","text-emerald-700"],
    "Other":["bg-slate-50","border-slate-200","text-slate-700"]
  };
  const CAT_PALETTE = {
    "competition":["bg-indigo-50","border-indigo-200","text-indigo-700"],
    "activity":["bg-teal-50","border-teal-200","text-teal-700"],
    "community":["bg-orange-50","border-orange-200","text-orange-700"],
    "research":["bg-cyan-50","border-cyan-200","text-cyan-700"],
    "advocacy":["bg-rose-50","border-rose-200","text-rose-700"],
    "outreach":["bg-violet-50","border-violet-200","text-violet-700"]
  };
  const SUB_PALETTE = {
    "Biology":["bg-emerald-50","border-emerald-200","text-emerald-700"],
    "Chemistry":["bg-lime-50","border-lime-200","text-lime-700"],
    "Physics / Engineering":["bg-orange-50","border-orange-200","text-orange-700"],
    "Computer Science / Tech":["bg-purple-50","border-purple-200","text-purple-700"],
    "Math / Data":["bg-sky-50","border-sky-200","text-sky-700"],
    "Medicine & Health":["bg-pink-50","border-pink-200","text-pink-700"]
  };
  const paletteMap = {
    "field:STEM":FIELD_PALETTE["STEM"],
    "field:Humanities":FIELD_PALETTE["Humanities"],
    "field:Arts":FIELD_PALETTE["Arts"],
    "field:Community Service":FIELD_PALETTE["Community Service"],
    "field:Sports":FIELD_PALETTE["Sports"],
    "field:Other":FIELD_PALETTE["Other"],
    "cat:competition":CAT_PALETTE["competition"],
    "cat:activity":CAT_PALETTE["activity"],
    "cat:community":CAT_PALETTE["community"],
    "cat:research":CAT_PALETTE["research"],
    "cat:advocacy":CAT_PALETTE["advocacy"],
    "cat:outreach":CAT_PALETTE["outreach"],
    "sub:Biology":SUB_PALETTE["Biology"],
    "sub:Chemistry":SUB_PALETTE["Chemistry"],
    "sub:Physics / Engineering":SUB_PALETTE["Physics / Engineering"],
    "sub:Computer Science / Tech":SUB_PALETTE["Computer Science / Tech"],
    "sub:Math / Data":SUB_PALETTE["Math / Data"],
    "sub:Medicine & Health":SUB_PALETTE["Medicine & Health"]
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

    const freq = form.querySelector('select[name="meeting_frequency"]').value;
    const timeType = getRadio('meeting_time_type');
    const days = getCheckedValues('meeting_days');
    const afterRange = form.querySelector('input[name="meeting_time_range"]').value.trim();
    const words = (document.getElementById('desc')?.value?.trim().match(/\S+/g) || []).length;

    const setErr = (k, s)=>{ const el = form.querySelector(`[data-error="${k}"]`); if (el) el.classList.toggle('hidden', !s); };
    setErr('meeting_frequency', !freq);
    setErr('meeting_time_type', !timeType);
    setErr('meeting_days', days.length === 0);
    setErr('meeting_time_range', (timeType === 'after_school' && !afterRange));
    setErr('description', words > 200);

    const hasError = (!freq || !timeType || days.length===0 || (timeType==='after_school' && !afterRange) || words>200);
    if (hasError) { status.textContent = 'Please complete the required fields.'; return; }

    const fd = new FormData(form);
    const volunteerRadio = form.querySelector('input[name="volunteer_hours"]:checked');
    const rawWebsite = fd.get('website_url') || '';
    const website_url = normalizeWebsiteUrl(rawWebsite);

    const payload = {
      club_name: fd.get('club_name'),
      president_submit_password: fd.get('president_submit_password'),
      president_code: fd.get('president_code'),
      website_url,
      fields: getCheckedValues('fields'),
      categories: getCheckedValues('categories'),
      subfields: getCheckedValues('subfields'),
      meeting_days: days,
      meeting_frequency: freq,
      meeting_time_type: timeType,
      meeting_time_range: afterRange,
      volunteer_hours: volunteerRadio ? (volunteerRadio.value === 'true') : undefined,
      open_to_all: !!fd.get('open_to_all') || undefined,
      prereq_required: !!fd.get('prereq_required') || undefined,
      prerequisites: (fd.get('prereq_required') ? (fd.get('prerequisites') || '') : '' ),
      description: (document.getElementById('desc')?.value || '')
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
      (function(){ const el = document.getElementById('wordCount'); if (el) el.innerHTML = '<span class="font-semibold">0</span> / 200 words'; })();
      // reset label colors
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

/* ---------- ADMIN PAGE ---------- */
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
    table.querySelectorAll('button[data-reveal]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const span = e.currentTarget.previousElementSibling;
        const full = span.dataset.full;
        if (span.textContent.includes('•')) {
          span.textContent = full || '';
          e.currentTarget.textContent = 'Hide';
        } else {
          span.textContent = full ? '••••••' : '';
          e.currentTarget.textContent = 'Show';
        }
      });
    });
  }

  function rowHTML(c){
    const desc = (c.description||'').slice(0,120) + ((c.description||'').length>120?'…':'');
    const meta = [...(c.fields||[]), ...(c.categories||[])].join(' • ');
    const codeMasked = c.president_code ? '••••••' : '';
    const websiteHref = normalizeWebsiteUrl(c.website_url);
    const website = websiteHref ? `<a class="text-brand underline" href="${websiteHref}" target="_blank" rel="noopener">Open ↗</a>` : '';

    return `
<tr class="border-b" data-id="${c.id}">
  <td class="px-3 py-2">
    <div class="font-semibold">${c.name}</div>
    <div class="text-neutral-600 text-xs">${meta}</div>
  </td>
  <td class="px-3 py-2">
    <span data-full="${c.president_code || ''}">${codeMasked}</span>
    ${c.president_code ? '<button class="ml-2 text-xs px-2 py-0.5 border rounded hover:bg-neutral-50" data-reveal>Show</button>' : ''}
  </td>
  <td class="px-3 py-2">${website || ''}</td>
  <td class="px-3 py-2">${(c.meeting_days||[]).join(", ")}</td>
  <td class="px-3 py-2">${c.status||'approved'}</td>
  <td class="px-3 py-2">${desc}</td>
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
        tr.querySelectorAll("td")[5].textContent = (newDesc||'').slice(0,120) + ((newDesc||'').length>120?'…':'');
      }
    }
  }
}
