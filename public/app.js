// app.js
'use strict';

/* ------------------ Shared utilities + page initializers ------------------ */
// If hosted under /club-directory (Cloudflare Worker path), prefix API calls.
var PREFIX = location.pathname.indexOf('/club-directory') === 0 ? '/club-directory' : '';
var API_BASE = PREFIX || location.origin.replace(/\/$/, '');

// Safe HTML escape (no regex class issues)
function esc(s) {
  var str = (s == null ? '' : String(s));
  var out = '';
  for (var i = 0; i < str.length; i++) {
    var ch = str.charAt(i);
    if (ch === '&') out += '&amp;';
    else if (ch === '<') out += '&lt;';
    else if (ch === '>') out += '&gt;';
    else if (ch === '"') out += '&quot;';
    else if (ch === "'") out += '&#39;';
    else out += ch;
  }
  return out;
}

// Fetch wrappers (ES5-safe)
function fetchText(url, opts) {
  opts = opts || {};
  var hdrs = { 'Content-Type': 'application/json' };
  if (opts.headers) {
    for (var k in opts.headers) {
      if (Object.prototype.hasOwnProperty.call(opts.headers, k)) {
        hdrs[k] = opts.headers[k];
      }
    }
  }
  var fopts = {};
  for (var k2 in opts) {
    if (Object.prototype.hasOwnProperty.call(opts, k2)) {
      fopts[k2] = opts[k2];
    }
  }
  fopts.headers = hdrs;

  return fetch(url, fopts).then(function (r) {
    return r.text().then(function (t) {
      return { ok: r.ok, status: r.status, text: t };
    });
  });
}
function fetchJSON(url, opts) {
  return fetchText(url, opts).then(function (res) {
    if (!res.ok) throw new Error(res.text || ('HTTP ' + res.status));
    try { return JSON.parse(res.text); } catch (e) { return res.text; }
  });
}

function normalizeWebsiteUrl(url) {
  if (!url) return '';
  var u = String(url).trim();
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf('//') === 0) return 'https:' + u;
  if (u.indexOf('.') !== -1 || u.indexOf('www.') === 0) {
    return 'https://' + u.replace(/^\/+/, '');
  }
  return u;
}

// Tiny helpers
function cls() {
  var out = [];
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) out.push(arguments[i]);
  }
  return out.join(' ');
}
function byId(id) { return document.getElementById(id); }

// Email vs link detection for President Contact display
var _EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
function contactHref(contact) {
  if (!contact) return '';
  var v = String(contact).trim();
  if (!v) return '';
  if (/^mailto:/i.test(v)) return v;
  if (_EMAIL_RX.test(v)) return 'mailto:' + v;
  return normalizeWebsiteUrl(v) || v;
}

// Word counting for description (client limit mirrors server)
var MAX_DESC_WORDS = 200;
function countWords(s) {
  var m = String(s || '').trim().match(/\S+/g);
  return m ? m.length : 0;
}

/* ------------------------------ Pastel palettes ------------------------------ */
var FIELD_PALETTE = {
  'STEM': ['bg-sky-50','border-sky-200','text-sky-700'],
  'Humanities': ['bg-amber-50','border-amber-200','text-amber-700'],
  'Arts / Culture': ['bg-fuchsia-50','border-fuchsia-200','text-fuchsia-700'],
  'Social Impact / Service': ['bg-orange-50','border-orange-200','text-orange-700'],
  'Sports & Wellness': ['bg-emerald-50','border-emerald-200','text-emerald-700'],
  'Faith / Identity / Other': ['bg-slate-50','border-slate-200','text-slate-700'],
  // legacy back-compat
  'Arts': ['bg-fuchsia-50','border-fuchsia-200','text-fuchsia-700'],
  'Community Service': ['bg-orange-50','border-orange-200','text-orange-700'],
  'Sports': ['bg-emerald-50','border-emerald-200','text-emerald-700'],
  'Other': ['bg-slate-50','border-slate-200','text-slate-700']
};
var CAT_PALETTE = {
  'competition': ['bg-indigo-50','border-indigo-200','text-indigo-700'],
  'activity': ['bg-teal-50','border-teal-200','text-teal-700'],
  'community': ['bg-orange-50','border-orange-200','text-orange-700'],
  'research': ['bg-cyan-50','border-cyan-200','text-cyan-700'],
  'advocacy': ['bg-rose-50','border-rose-200','text-rose-700'],
  'outreach': ['bg-violet-50','border-violet-200','text-violet-700']
};
var SUB_PALETTE = {
  'Biology': ['bg-emerald-50','border-emerald-200','text-emerald-700'],
  'Chemistry': ['bg-lime-50','border-lime-200','text-lime-700'],
  'Physics / Engineering': ['bg-orange-50','border-orange-200','text-orange-700'],
  'Computer Science / Tech': ['bg-purple-50','border-purple-200','text-purple-700'],
  'Math / Data': ['bg-sky-50','border-sky-200','text-sky-700'],
  'Medicine & Health': ['bg-pink-50','border-pink-200','text-pink-700']
};
var CATEGORY_KEY_TO_DISPLAY = {
  competition: 'Competition-based',
  activity: 'Activity-based',
  community: 'Community Service–based',
  research: 'Research / Academic',
  advocacy: 'Awareness / Advocacy',
  outreach: 'Outreach / Teaching'
};
var CATEGORY_DISPLAY_TO_KEY = (function () {
  var out = {};
  for (var k in CATEGORY_KEY_TO_DISPLAY) {
    if (Object.prototype.hasOwnProperty.call(CATEGORY_KEY_TO_DISPLAY, k)) {
      out[CATEGORY_KEY_TO_DISPLAY[k]] = k;
    }
  }
  return out;
})();
var FIELD_SYNONYMS = {
  'STEM': ['STEM'],
  'Humanities': ['Humanities'],
  'Arts / Culture': ['Arts / Culture','Arts'],
  'Social Impact / Service': ['Social Impact / Service','Community Service'],
  'Sports & Wellness': ['Sports & Wellness','Sports'],
  'Faith / Identity / Other': ['Faith / Identity / Other','Faith / Identity','Other']
};

// UI chips
function pastelBadge(text, palette) {
  var p = palette || ['bg-neutral-50','border-neutral-300','text-neutral-700'];
  return '<span class="' + cls('px-2','py-0.5','rounded-full','text-xs','border', p[0], p[1], p[2]) + '">' + esc(text) + '</span>';
}
function chip(text) {
  return '<span class="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs">' + esc(text) + '</span>';
}

/* --------------------------------- INDEX PAGE --------------------------------- */
export function initIndex() {
  var clubList = byId('clubList');
  var resultsCount = byId('resultsCount');

  var search = byId('search');
  var subject = byId('subject');   // Field / Focus
  var category = byId('category'); // Category dropdown
  var subfield = byId('subfield');
  var subfieldWrap = byId('subfieldWrap');

  // STEM subfields (mirror presidents form)
  var subfieldsBySubject = {
    'STEM': [
      'Biology',
      'Chemistry',
      'Physics / Engineering',
      'Computer Science / Tech',
      'Math / Data',
      'Medicine & Health'
    ]
  };

  function showStemSubfieldsIfNeeded() {
    var isStem = subject && subject.value === 'STEM';
    if (subfieldWrap) subfieldWrap.classList.toggle('hidden', !isStem);
    if (!isStem && subfield) subfield.value = '';
  }
  function populateSubfields() {
    if (!subfield) return;
    var opts = subfieldsBySubject['STEM'] || [];
    var html = '<option value="">All Subfields</option>';
    for (var i = 0; i < opts.length; i++) html += '<option>' + esc(opts[i]) + '</option>';
    subfield.innerHTML = html;
  }

  if (subject) subject.addEventListener('change', function () { showStemSubfieldsIfNeeded(); render(); });
  if (subfield) subfield.addEventListener('change', render);
  if (category) category.addEventListener('change', render);
  if (search) search.addEventListener('input', render);

  populateSubfields();
  showStemSubfieldsIfNeeded();

  var dayBoxes = [].slice.call(document.querySelectorAll('input[name="days"]'));
  for (var iDB = 0; iDB < dayBoxes.length; iDB++) {
    dayBoxes[iDB].addEventListener('change', render);
  }
  function getSet(nodes) {
    var set = Object.create(null);
    for (var i = 0; i < nodes.length; i++) {
      var x = nodes[i];
      if (x.checked) set[x.value] = true;
    }
    return set;
  }

  function load() {
    fetchText(API_BASE + '/api/clubs').then(function (res) {
      if (!res.ok) throw new Error(res.text || 'Failed');
      var data = {};
      try { data = JSON.parse(res.text); } catch (e) { data = {}; }
      window.__clubs = data.clubs || [];
      render();
    }).catch(function (e) {
      if (clubList) clubList.innerHTML = '<p class="text-red-600">Failed to load clubs.</p>';
      console.error(e);
    });
  }

  function fieldMatchesSelected(selectedField, clubFieldsRaw, legacySubject) {
    if (!selectedField) return true;
    var synonyms = FIELD_SYNONYMS[selectedField] || [selectedField];
    var clubFields = (clubFieldsRaw && clubFieldsRaw.length > 0) ? clubFieldsRaw : (legacySubject ? [legacySubject] : []);
    for (var i = 0; i < clubFields.length; i++) {
      if (synonyms.indexOf(clubFields[i]) !== -1) return true;
    }
    return false;
  }

  function labelHTML(text) {
    return '<span class="uppercase tracking-wide text-[10px] font-bold text-neutral-500">' + esc(text) + '</span>';
  }

  function meetingTimeText(c) {
    if (c.meeting_time_type === 'lunch') return 'Lunch';
    if (c.meeting_time_type === 'after_school') {
      var label = 'Others';
      return c.meeting_time_range ? (label + ' (' + esc(c.meeting_time_range) + ')') : label;
    }
    return '';
  }

  function cardHTML(c) {
    var websiteHref = normalizeWebsiteUrl(c.website_url);
    var websiteTag = websiteHref
      ? '<a class="text-brand underline text-sm font-semibold" href="' + esc(websiteHref) + '" target="_blank" rel="noopener noreferrer">Website ↗</a>'
      : '';

    var nameHTML = '<h3 class="text-black font-black text-xl sm:text-2xl leading-snug tracking-tight">' + esc(c.name) + '</h3>';

    // Show ALL focuses (fields); fallback to legacy subject if needed
    var focusVals = (c.fields && c.fields.length) ? c.fields : (c.subject ? [c.subject] : []);
    var focusRow = '';
    for (var i = 0; i < focusVals.length; i++) focusRow += pastelBadge(focusVals[i], FIELD_PALETTE[focusVals[i]]) + ' ';

    var catVals = [];
    var cats = c.categories || [];
    for (var k = 0; k < cats.length; k++) {
      var key = cats[k];
      var labelText = CATEGORY_KEY_TO_DISPLAY[key] || key;
      catVals.push([key, labelText]);
    }
    var catRow = '';
    for (var j = 0; j < catVals.length; j++) {
      catRow += pastelBadge(catVals[j][1], CAT_PALETTE[catVals[j][0]]) + ' ';
    }

    var subRow = '';
    var subs = c.subfield || [];
    for (var s = 0; s < subs.length; s++) subRow += pastelBadge(subs[s], SUB_PALETTE[subs[s]]) + ' ';

    var scheduleRowParts = [];
    var md = c.meeting_days || [];
    for (var d = 0; d < md.length; d++) scheduleRowParts.push(chip(md[d]));

    if (c.meeting_frequency) {
      var freqLabel = (c.meeting_frequency === 'event') ? 'N/a' : c.meeting_frequency;
      scheduleRowParts.push(chip(freqLabel));
    }

    var mtText = meetingTimeText(c);
    if (mtText) scheduleRowParts.push(chip(mtText));

    var scheduleRow = scheduleRowParts.join(' ');

    var locationRow = c.meeting_room
      ? '<div class="space-y-1">' + labelHTML('Location') + '<div class="flex flex-wrap gap-2">' + chip(c.meeting_room) + '</div></div>'
      : '';

    // Contact row (clickable email or URL)
    var contactRow = '';
    if (c.president_contact) {
      var ch = contactHref(c.president_contact);
      var isMail = /^mailto:/i.test(ch);
      var contactInner = ch
        ? ('<a class="underline text-brand" href="' + esc(ch) + '"' + (isMail ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + esc(c.president_contact) + (isMail ? '' : ' ↗') + '</a>')
        : esc(c.president_contact);
      contactRow = '<div class="space-y-1">' + labelHTML('Contact') + '<div>' + contactInner + '</div></div>';
    }

    var reqChipsParts = [];
    if (c.volunteer_hours) reqChipsParts.push(pastelBadge('Volunteer Hours', ['bg-emerald-50','border-emerald-200','text-emerald-700']));
    if (c.open_to_all) reqChipsParts.push(pastelBadge('Open to all', ['bg-emerald-50','border-emerald-200','text-emerald-700']));
    if (c.prereq_required) reqChipsParts.push(pastelBadge('Prerequisite', ['bg-amber-50','border-amber-200','text-amber-700']));
    var reqChips = reqChipsParts.join(' ');

    var prereqDetail = (c.prereq_required && c.prerequisites)
      ? '<div class="text-xs text-neutral-600 leading-relaxed"><span class="font-semibold">Details:</span> ' + esc(c.prerequisites) + '</div>'
      : '';

    // Description with clamp + toggle
    var fullDesc = c.description || 'No description yet.';
    var shortDesc = fullDesc.length > 280 ? fullDesc.slice(0, 280) + '…' : fullDesc;

    var html = '';
    html += '<article class="bg-white border border-neutral-300 rounded-2xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">';
    html +=   '<div class="bg-gradient-to-r from-brand/20 to-transparent h-2"></div>';
    html +=   '<div class="p-4">';
    html +=     '<div class="flex items-start justify-between gap-3">';
    html +=       nameHTML;
    html +=       websiteTag;
    html +=     '</div>';
    html +=     '<div class="mt-3 space-y-3 text-sm">';
    if (focusRow) html += '<div class="space-y-1">' + labelHTML('Focus') + '<div class="flex flex-wrap gap-2">' + focusRow + '</div></div>';
    if (catRow)   html += '<div class="space-y-1">' + labelHTML('Categories') + '<div class="flex flex-wrap gap-2">' + catRow + '</div></div>';
    if (subs.length) html += '<div class="space-y-1">' + labelHTML('Subfields') + '<div class="flex flex-wrap gap-2">' + subRow + '</div></div>';
    if (scheduleRow) html += '<div class="space-y-1">' + labelHTML('Schedule') + '<div class="flex flex-wrap gap-2">' + scheduleRow + '</div></div>';
    html +=       locationRow;
    if (contactRow) html += contactRow;
    if (reqChips || prereqDetail) html += '<div class="space-y-1">' + labelHTML('Eligibility & Perks') + '<div class="flex flex-wrap gap-2 items-center">' + reqChips + '</div>' + prereqDetail + '</div>';
    html +=       '<div class="space-y-1">' + labelHTML('Description') +
                    '<p class="text-neutral-800 leading-relaxed" data-desc-full="' + encodeURIComponent(fullDesc) + '">' +
                      esc(shortDesc) +
                      (fullDesc.length > 280 ? ' <button class="ml-1 underline text-brand text-xs" data-more>More</button>' : '') +
                    '</p>' +
                  '</div>';
    html +=     '</div>';
    html +=   '</div>';
    html += '</article>';
    return html;
  }

  function render() {
    if (!window.__clubs) return;

    var q = (search && search.value ? search.value : '').trim().toLowerCase();
    var s = (subject && subject.value) ? subject.value : '';   // display field label
    var sf = (subfield && subfield.value) ? subfield.value : ''; // subfield label
    var fDaysMap = getSet(dayBoxes);

    var catDisplay = (category && category.value) ? category.value : '';
    var catKey = CATEGORY_DISPLAY_TO_KEY[catDisplay] || '';

    var clubs = window.__clubs || [];
    var filtered = [];
    for (var i = 0; i < clubs.length; i++) {
      var c = clubs[i];
      var catKeys = c.categories || [];
      var catLabels = [];
      for (var k = 0; k < catKeys.length; k++) {
        var kk = catKeys[k];
        catLabels.push(CATEGORY_KEY_TO_DISPLAY[kk] || kk);
      }
      var textParts = [
        c.name || '',
        c.description || ''
      ];
      var iF;
      if (c.fields && c.fields.length) for (iF = 0; iF < c.fields.length; iF++) textParts.push(c.fields[iF]);
      if (c.subject) textParts.push(c.subject);
      var iS;
      if (c.subfield && c.subfield.length) for (iS = 0; iS < c.subfield.length; iS++) textParts.push(c.subfield[iS]);
      textParts = textParts.concat(catKeys).concat(catLabels);
      textParts.push(c.prerequisites || '', c.meeting_room || '');
      var txt = textParts.join(' ').toLowerCase();

      var matchesQ = !q || txt.indexOf(q) !== -1;
      var matchesField = fieldMatchesSelected(s, c.fields, c.subject);
      var matchesSf = !sf || (c.subfield || []).indexOf(sf) !== -1;
      var matchesDays = true;
      if (Object.keys(fDaysMap).length > 0) {
        matchesDays = false;
        var md = c.meeting_days || [];
        for (var d = 0; d < md.length; d++) {
          if (fDaysMap[md[d]]) { matchesDays = true; break; }
        }
      }
      var matchesCat = !catKey || (c.categories || []).indexOf(catKey) !== -1;

      if (matchesQ && matchesField && matchesSf && matchesDays && matchesCat) filtered.push(c);
    }

    if (resultsCount) {
      resultsCount.textContent = filtered.length + ' result' + (filtered.length === 1 ? '' : 's');
    }
    if (clubList) {
      if (!filtered.length) {
        clubList.innerHTML = '<p class="text-neutral-600">No clubs match your filters yet.</p>';
      } else {
        var html = '';
        for (var i2 = 0; i2 < filtered.length; i2++) html += cardHTML(filtered[i2]);
        clubList.innerHTML = html;
      }
    }
  }

  // delegate More/Less toggles
  document.addEventListener('click', function (e) {
    var tgt = e.target;
    if (!tgt) return;
    if (tgt.closest) {
      var more = tgt.closest('button[data-more]');
      if (more) {
        e.preventDefault();
        var p = more.closest('p');
        var full = decodeURIComponent(p.getAttribute('data-desc-full') || '');
        var inner = esc(full) + ' <button class="ml-1 underline text-brand text-xs" data-less>Less</button>';
        p.innerHTML = inner;
        return;
      }
      var less = tgt.closest('button[data-less]');
      if (less) {
        e.preventDefault();
        var p2 = less.closest('p');
        var full2 = decodeURIComponent(p2.getAttribute('data-desc-full') || '');
        var short = full2.length > 280 ? full2.slice(0, 280) + '…' : full2;
        var inner2 = esc(short) + (full2.length > 280 ? ' <button class="ml-1 underline text-brand text-xs" data-more>More</button>' : '');
        p2.innerHTML = inner2;
        return;
      }
    }
  });

  load();
}

/* ------------------------------ PRESIDENTS PAGE ------------------------------ */
export function initPresidents() {
  var form = byId('presForm');
  if (!form) return;

  var status = byId('status');
  var mtRange = byId('mt_range');
  var desc = byId('desc');
  var wordCount = byId('wordCount');

  var prereqRequired = byId('prereq_required');
  var prereqWrap = byId('prereq_text_wrap');
  var stemWrap = byId('stemSubfieldsWrap');

  function getCheckedValues(name) {
    var nodes = form.querySelectorAll('input[name="' + name + '"]:checked');
    var out = [];
    for (var i = 0; i < nodes.length; i++) out.push(nodes[i].value);
    return out;
  }
  function getRadio(name) {
    var n = form.querySelector('input[name="' + name + '"]:checked');
    return n ? n.value : '';
  }
  function setError(key, show) {
    var el = form.querySelector('[data-error="' + key + '"]');
    if (el) el.classList.toggle('hidden', !show);
  }

  // Show/hide the time range based on meeting time type
  form.addEventListener('input', function (e) {
    if (e.target && e.target.name === 'meeting_time_type') {
      var v = getRadio('meeting_time_type');
      if (mtRange) mtRange.classList.toggle('hidden', v !== 'after_school');
    }
  });

  // Prerequisite text visibility
  function syncPrereq() {
    var on = !!(prereqRequired && prereqRequired.checked);
    if (prereqWrap) prereqWrap.classList.toggle('hidden', !on);
    if (!on && prereqWrap) {
      var input = prereqWrap.querySelector('input[name="prerequisites"]');
      if (input) input.value = '';
    }
  }
  if (prereqRequired) prereqRequired.addEventListener('change', syncPrereq);
  syncPrereq();

  // STEM subfields visibility: show only if "STEM" is checked in Fields
  function syncStem() {
    var fieldsChecked = getCheckedValues('fields');
    var show = fieldsChecked.indexOf('STEM') !== -1;
    if (stemWrap) stemWrap.classList.toggle('hidden', !show);
    if (!show) {
      var subs = form.querySelectorAll('input[name="subfields"]');
      for (var i = 0; i < subs.length; i++) subs[i].checked = false;
    }
  }
  var fieldBoxes = form.querySelectorAll('input[name="fields"]');
  for (var iF = 0; iF < fieldBoxes.length; iF++) {
    fieldBoxes[iF].addEventListener('change', syncStem);
  }
  syncStem();

  // Live word counter (<= 200 words)
  function updateWords() {
    var words = countWords(desc && desc.value);
    if (wordCount) {
      wordCount.innerHTML = '<span class="font-semibold">' + words + '</span> / ' + MAX_DESC_WORDS + ' words';
      wordCount.classList.toggle('text-red-600', words > MAX_DESC_WORDS);
    }
    setError('description', words > MAX_DESC_WORDS);
  }
  if (desc) desc.addEventListener('input', updateWords);
  updateWords();

  // Pastel highlight for Field/Category/Subfield chips when checked
  var FIELD_P = FIELD_PALETTE;
  var CAT_P = CAT_PALETTE;
  var SUB_P = SUB_PALETTE;

  var paletteMap = {
    'field:STEM': FIELD_P['STEM'],
    'field:Humanities': FIELD_P['Humanities'],
    'field:Arts / Culture': FIELD_P['Arts / Culture'],
    'field:Social Impact / Service': FIELD_P['Social Impact / Service'],
    'field:Sports & Wellness': FIELD_P['Sports & Wellness'],
    'field:Faith / Identity / Other': FIELD_P['Faith / Identity / Other'],
    'cat:competition': CAT_P['competition'],
    'cat:activity': CAT_P['activity'],
    'cat:community': CAT_P['community'],
    'cat:research': CAT_P['research'],
    'cat:advocacy': CAT_P['advocacy'],
    'cat:outreach': CAT_P['outreach'],
    'sub:Biology': SUB_P['Biology'],
    'sub:Chemistry': SUB_P['Chemistry'],
    'sub:Physics / Engineering': SUB_P['Physics / Engineering'],
    'sub:Computer Science / Tech': SUB_P['Computer Science / Tech'],
    'sub:Math / Data': SUB_P['Math / Data'],
    'sub:Medicine & Health': SUB_P['Medicine & Health']
  };
  function applyPalette(labelEl, on) {
    var key = labelEl.getAttribute('data-palette');
    var pal = paletteMap[key];
    var base = ['border','cursor-pointer','rounded','px-2','py-1','flex','items-center','gap-2'];
    labelEl.className = base.join(' ');
    if (on && pal) {
      labelEl.classList.add(pal[0], pal[1], pal[2]);
    } else {
      labelEl.classList.add('border-neutral-300');
    }
  }
  function wirePalette(groupSelector) {
    var labels = document.querySelectorAll(groupSelector + ' [data-palette]');
    for (var i = 0; i < labels.length; i++) {
      (function (lbl) {
        var input = lbl.querySelector('input[type="checkbox"]');
        if (!input) return;
        var sync = function () { applyPalette(lbl, input.checked); };
        input.addEventListener('change', sync);
        sync();
      })(labels[i]);
    }
  }
  wirePalette('#fieldsGroup');
  wirePalette('#categoriesGroup');
  wirePalette('#subfieldsGroup');

  // Submit handler (with double-submit guard)
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('opacity-50'); }
    if (status) status.textContent = 'Submitting…';

    var freq = (form.querySelector('select[name="meeting_frequency"]') || {}).value || '';
    var timeTypeNode = form.querySelector('input[name="meeting_time_type"]:checked');
    var timeType = timeTypeNode ? timeTypeNode.value : '';
    var daysNodes = form.querySelectorAll('input[name="meeting_days"]:checked');
    var days = [];
    for (var i = 0; i < daysNodes.length; i++) days.push(daysNodes[i].value);
    var afterRange = (form.querySelector('input[name="meeting_time_range"]') || {}).value || '';
    afterRange = String(afterRange).trim();

    var words = countWords(desc && desc.value);
    var meetingRoomNode = form.querySelector('input[name="meeting_room"]');
    var meetingRoomVal = (meetingRoomNode && meetingRoomNode.value) ? String(meetingRoomNode.value).trim() : '';

    setError('meeting_frequency', !freq);
    setError('meeting_time_type', !timeType);
    setError('meeting_days', days.length === 0);
    setError('meeting_time_range', (timeType === 'after_school' && !afterRange));
    setError('description', words > MAX_DESC_WORDS);
    setError('meeting_room', !meetingRoomVal);

    var hasError = (!freq || !timeType || days.length === 0 ||
                    (timeType === 'after_school' && !afterRange) ||
                    !meetingRoomVal || words > MAX_DESC_WORDS);
    if (hasError) {
      if (status) status.textContent = 'Please complete the required fields.';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
      return;
    }

    var fd = new FormData(form);
    var volunteerRadio = form.querySelector('input[name="volunteer_hours"]:checked');
    var rawWebsite = fd.get('website_url') || '';
    var website_url = normalizeWebsiteUrl(rawWebsite);
    var president_contact = (fd.get('president_contact') || '').trim();

    var payload = {
      club_name: fd.get('club_name'),
      president_submit_password: fd.get('president_submit_password'),
      president_contact: president_contact || undefined,
      website_url: website_url,
      fields: (function () {
        var arr = [], nodes = form.querySelectorAll('input[name="fields"]:checked');
        for (var i = 0; i < nodes.length; i++) arr.push(nodes[i].value);
        return arr;
      })(),
      categories: (function () {
        var arr = [], nodes = form.querySelectorAll('input[name="categories"]:checked');
        for (var i = 0; i < nodes.length; i++) arr.push(nodes[i].value);
        return arr;
      })(),
      subfields: (function () {
        var arr = [], nodes = form.querySelectorAll('input[name="subfields"]:checked');
        for (var i = 0; i < nodes.length; i++) arr.push(nodes[i].value);
        return arr;
      })(),
      meeting_days: days,
      meeting_frequency: freq,          // 'weekly' | 'biweekly' | 'monthly' | 'event'
      meeting_time_type: timeType,      // 'lunch' | 'after_school'
      meeting_time_range: afterRange,
      meeting_room: meetingRoomVal,
      volunteer_hours: volunteerRadio ? (volunteerRadio.value === 'true') : undefined,
      open_to_all: !!fd.get('open_to_all') || undefined,
      prereq_required: !!fd.get('prereq_required') || undefined,
      prerequisites: (fd.get('prereq_required') ? (fd.get('prerequisites') || '') : ''),
      description: (desc && desc.value) ? desc.value : ''
    };

    var dbgPayload = byId('debugPayload');
    if (dbgPayload) dbgPayload.textContent = JSON.stringify(payload, null, 2);

    fetchText(API_BASE + '/api/presidents/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(function (res) {
      var dbgResponse = byId('debugResponse');
      if (dbgResponse) {
        var shown;
        try { shown = JSON.stringify(JSON.parse(res.text), null, 2); } catch (e) { shown = res.text; }
        dbgResponse.textContent = shown;
      }

      if (!res.ok) {
        try {
          var data = JSON.parse(res.text);
          if (data.reason === 'bad_president_password') {
            if (status) status.textContent = 'Error: President Submission Password is wrong. Ask your commissioner.';
          } else if (data.error === 'missing_required') {
            if (status) status.textContent = 'Missing required: ' + (data.fields || []).join(', ');
          } else if (data.error === 'desc_too_long') {
            if (status) status.textContent = 'Description too long (' + data.words + ' words).';
          } else if (data.error === 'rate_limited') {
            if (status) status.textContent = 'Too many attempts. Try again later.';
          } else if (data.mysql_code) {
            if (status) status.textContent = 'DB Error (' + data.mysql_code + '): ' + (data.mysql_message || 'see console');
          } else {
            if (status) status.textContent = 'Failure to submit. See Debug panel for details.';
          }
        } catch (e) {
          if (status) status.textContent = 'Failure to submit. See Debug panel for details.';
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
        return;
      }

      if (status) status.textContent = 'Submitted! Your club is live.';
      form.reset();
      if (mtRange) mtRange.classList.add('hidden');
      if (prereqWrap) prereqWrap.classList.add('hidden');
      if (stemWrap) stemWrap.classList.add('hidden');

      var wc = byId('wordCount');
      if (wc) wc.innerHTML = '<span class="font-semibold">0</span> / ' + MAX_DESC_WORDS + ' words';

      var groups = ['#fieldsGroup','#categoriesGroup','#subfieldsGroup'];
      for (var g = 0; g < groups.length; g++) {
        var labels = document.querySelectorAll(groups[g] + ' [data-palette]');
        for (var i2 = 0; i2 < labels.length; i2++) {
          var lbl = labels[i2];
          lbl.className = 'border cursor-pointer rounded px-2 py-1 flex items-center gap-2 border-neutral-300';
          var input = lbl.querySelector('input[type="checkbox"]');
          if (input) input.checked = false;
        }
      }

      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
    }).catch(function (err) {
      console.error(err);
      if (status) status.textContent = 'Failure to submit (network). See console.';
      var dbgResponse = byId('debugResponse');
      if (dbgResponse) dbgResponse.textContent = String(err);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
    });
  });
}

/* ---------------------------------- ADMIN PAGE ---------------------------------- */
function sha256HexBrowser(s) {
  try {
    if (!window.crypto || !window.crypto.subtle) return null;
  } catch (e) { return null; }
  var buf = new TextEncoder().encode(String(s));
  return window.crypto.subtle.digest('SHA-256', buf).then(function (hash) {
    var bytes = new Uint8Array(hash);
    var out = '';
    for (var i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
  });
}
export function initAdmin() {
  var loginSection = byId('adminLogin');
  var formEl = loginSection ? loginSection.querySelector('form') : null;
  var panel = byId('adminPanel');
  var table = byId('adminTableBody');
  if (!formEl || !panel || !table) return;

  function _fetchJSON(url, opts) {
    opts = opts || {};
    var hdrs = { 'Content-Type': 'application/json' };
    if (opts.headers) for (var k in opts.headers) if (Object.prototype.hasOwnProperty.call(opts.headers, k)) hdrs[k] = opts.headers[k];
    var fopts = {};
    for (var k2 in opts) if (Object.prototype.hasOwnProperty.call(opts, k2)) fopts[k2] = opts[k2];
    fopts.headers = hdrs;

    return fetch(url, fopts).then(function (r) {
      return r.text().then(function (t) {
        if (!r.ok) throw new Error(t || ('HTTP ' + r.status));
        try { return JSON.parse(t); } catch (e) { return t; }
      });
    });
  }

  // Robust login: send hash if available; fall back to plaintext+header auth if needed.
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(formEl);
    var code = fd.get('code') || '';

    function successStoreAndLoad(hashUsed) {
      if (hashUsed) {
        localStorage.setItem('ADMIN_HASH', hashUsed);
        sessionStorage.removeItem('ADMIN_CODE');
      } else {
        // only keep plaintext for this session (don’t persist across reloads)
        sessionStorage.setItem('ADMIN_CODE', code);
        localStorage.removeItem('ADMIN_HASH');
      }
      if (loginSection) loginSection.classList.add('hidden');
      panel.classList.remove('hidden');
      load();
    }


    function tryHeaderFallback() {
      return fetchText(API_BASE + '/api/admin/clubs', {
        headers: { 'x-admin-code': code }
      }).then(function (r) {
        if (!r.ok) throw new Error('unauthorized');
        successStoreAndLoad(null);
      });
    }

    var p = sha256HexBrowser(code);
    var doLogin = function (hash) {
      var body = hash ? JSON.stringify({ code_hash: hash }) : JSON.stringify({ code: code });
      _fetchJSON(API_BASE + '/api/admin/login', { method: 'POST', body: body })
        .then(function () { successStoreAndLoad(hash); })
        .catch(function () {
          // If POST /login fails (or blocked), try header-based auth directly.
          tryHeaderFallback().catch(function () {
            alert('Invalid code');
          });
        });
    };

    if (p && typeof p.then === 'function') {
      p.then(doLogin).catch(function () {
        tryHeaderFallback().catch(function () { alert('Invalid code'); });
      });
    } else {
      doLogin(null);
    }
  });

  function authHeaders() {
    var h = {};
    var code = sessionStorage.getItem('ADMIN_CODE') || '';
    var hash = localStorage.getItem('ADMIN_HASH') || '';
    if (hash) h['x-admin-hash'] = hash;
    if (code) h['x-admin-code'] = code;
    return h;
  }

  function rowHTML(c) {
    var desc = (c.description || '');
    var short = desc.slice(0, 120) + (desc.length > 120 ? '…' : '');
    var metaParts = [];
    var ff = c.fields || [];
    for (var i = 0; i < ff.length; i++) metaParts.push(ff[i]);
    var cc = c.categories || [];
    for (var j = 0; j < cc.length; j++) metaParts.push(CATEGORY_KEY_TO_DISPLAY[cc[j]] || cc[j]);
    var meta = metaParts.join(' • ');
    var websiteHref = normalizeWebsiteUrl(c.website_url);
    var website = websiteHref ? '<a class="text-brand underline" href="' + esc(websiteHref) + '" target="_blank" rel="noopener">Open ↗</a>' : '';
    var contact = c.president_contact || '';

    var html = '';
    html += '<tr class="border-b" data-id="' + c.id + '">';
    html +=   '<td class="px-3 py-2"><div class="font-semibold">' + esc(c.name) + '</div><div class="text-neutral-600 text-xs">' + esc(meta) + '</div></td>';
    html +=   '<td class="px-3 py-2"><span>' + esc(contact) + '</span></td>';
    html +=   '<td class="px-3 py-2">' + (website || '') + '</td>';
    html +=   '<td class="px-3 py-2">' + esc((c.meeting_days || []).join(', ')) + '</td>';
    html +=   '<td class="px-3 py-2">' + esc(c.meeting_room || '') + '</td>';
    html +=   '<td class="px-3 py-2">' + esc(c.status || 'approved') + '</td>';
    html +=   '<td class="px-3 py-2">' + esc(short) + '</td>';
    html +=   '<td class="px-3 py-2"><div class="flex flex-wrap gap-2">';
    if (String(c.status) !== 'approved') {
      html +=   '<button class="px-3 py-1 rounded-lg border-2 border-emerald-600 text-emerald-600 font-bold hover:text-emerald-700 hover:border-emerald-700" data-action="approve">Approve</button>';
    }
    html +=     '<button class="px-3 py-1 rounded-lg border-2 border-brand text-brand font-bold hover:text-brand700 hover:border-brand700" data-action="edit">Edit</button>';
    html +=     '<button class="px-3 py-1 rounded-lg border-2 border-red-500 text-red-500 font-bold hover:text-red-700 hover:border-red-700" data-action="delete">Delete</button>';
    html +=   '</div></td>';
    html += '</tr>';
    return html;
  }

  function load() {
    var headers = authHeaders();
    _fetchJSON(API_BASE + '/api/admin/clubs', { headers: headers }).then(function (data) {
      var clubs = data.clubs || [];
      var html = '';
      for (var i = 0; i < clubs.length; i++) html += rowHTML(clubs[i]);
      table.innerHTML = html;

      var btns = table.querySelectorAll('button[data-action]');
      for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', onAction);
      }
    }).catch(function (e) {
      // If we have stored creds but failed, show login again
      panel.classList.add('hidden');
      if (loginSection) loginSection.classList.remove('hidden');
      console.error(e);
      alert('Failed to load clubs');
    });
  }

  function onAction(e) {
    var btn = e.currentTarget;
    var tr = btn.closest('tr');
    var id = tr.getAttribute('data-id');
    var action = btn.getAttribute('data-action');
    var headers = authHeaders();

    if (action === 'delete') {
      if (confirm('Delete this club?')) {
        fetchText(API_BASE + '/api/clubs/' + id, { method: 'DELETE', headers: headers }).then(function (r) {
          if (!r.ok) return alert('Delete failed');
          tr.parentNode.removeChild(tr);
        });
      }
    } else if (action === 'edit') {
      fetchText(API_BASE + '/api/clubs/' + id, { headers: headers }).then(function (r) {
        if (!r.ok) return alert('Failed to fetch club');
        var current = {};
        try { current = JSON.parse(r.text); } catch (e) { current = {}; }
        var newDesc = prompt('Edit description:', (current.club && current.club.description) || '');
        if (newDesc !== null) {
          fetchText(API_BASE + '/api/clubs/' + id, { method: 'PATCH', body: JSON.stringify({ description: newDesc }), headers: headers }).then(function (r2) {
            if (!r2.ok) return alert('Failed to update');
            var cells = tr.querySelectorAll('td');
            var short = (newDesc || '').slice(0, 120) + ((newDesc || '').length > 120 ? '…' : '');
            cells[6].textContent = short; // description cell
          });
        }
      });
    } else if (action === 'approve') {
      fetchText(API_BASE + '/api/clubs/' + id + '/approve', { method: 'POST', headers: headers }).then(function (r) {
        if (!r.ok) return alert('Approve failed');
        var cells = tr.querySelectorAll('td');
        cells[5].textContent = 'approved'; // status cell
        btn.parentNode.removeChild(btn);    // remove Approve button
      });
    }
  }

  // Auto-auth if credentials are already stored
  // Verify stored creds before showing the panel
  (function autoAuth() {
    var hash = localStorage.getItem('ADMIN_HASH');
    var code = sessionStorage.getItem('ADMIN_CODE'); // note: sessionStorage (see #2)
    if (!hash && !code) return;

    var headers = {};
    if (hash) headers['x-admin-hash'] = hash;
    if (code) headers['x-admin-code'] = code;

    _fetchJSON(API_BASE + '/api/admin/clubs', { headers: headers })
      .then(function () {
        // only now show the panel
        if (loginSection) loginSection.classList.add('hidden');
        panel.classList.remove('hidden');
        load();
      })
      .catch(function () {
        // creds invalid; clear and keep login visible
        localStorage.removeItem('ADMIN_HASH');
        sessionStorage.removeItem('ADMIN_CODE');
      });
  })();

}
