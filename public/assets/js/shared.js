'use strict';

/* -------------------------------------------------------------------------- */
/*                              PATH PREFIX / API                             */
/* -------------------------------------------------------------------------- */

export var PREFIX = location.pathname.indexOf('/club-directory') === 0 ? '/club-directory' : '';
export var API_BASE = PREFIX || location.origin.replace(/\/$/, '');

/* -------------------------------------------------------------------------- */
/*                               HTML ESCAPE                                  */
/* -------------------------------------------------------------------------- */

export function esc(s) {
  var str = s == null ? '' : String(s);
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

/* -------------------------------------------------------------------------- */
/*                               FETCH HELPERS                                */
/* -------------------------------------------------------------------------- */

export function fetchText(url, opts) {
  opts = opts || {};
  var hdrs = { 'Content-Type': 'application/json' };
  if (opts.headers) {
    for (var k in opts.headers) if (Object.prototype.hasOwnProperty.call(opts.headers, k)) {
      hdrs[k] = opts.headers[k];
    }
  }
  var fopts = {};
  for (var k2 in opts) if (Object.prototype.hasOwnProperty.call(opts, k2)) {
    fopts[k2] = opts[k2];
  }
  fopts.headers = hdrs;

  return fetch(url, fopts).then(function (r) {
    return r.text().then(function (t) {
      return { ok: r.ok, status: r.status, text: t };
    });
  });
}

export function fetchJSON(url, opts) {
  return fetchText(url, opts).then(function (res) {
    if (!res.ok) throw new Error(res.text || 'HTTP ' + res.status);
    try {
      return JSON.parse(res.text);
    } catch (e) {
      return res.text;
    }
  });
}

/* -------------------------------------------------------------------------- */
/*                         URL / CONTACT HELPERS                              */
/* -------------------------------------------------------------------------- */

/**
 * Strictly safe website URL normalization (client-side mirror of server).
 * - Only http(s) allowed.
 * - Bare domains get https:// prefixed.
 * - Returns '' if resulting URL is not http(s).
 */
export function normalizeWebsiteUrl(url) {
  if (!url) return '';
  var u = String(url).trim();
  if (!u) return '';

  if (!/^https?:\/\//i.test(u) && (u.indexOf('.') !== -1 || u.indexOf('www.') === 0)) {
    u = 'https://' + u.replace(/^\/+/, '');
  }

  if (!/^https?:\/\//i.test(u)) return '';
  return u;
}

export var _EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function contactHref(contact) {
  if (!contact) return '';
  var v = String(contact).trim();
  if (!v) return '';
  if (/^mailto:/i.test(v)) return v;
  if (_EMAIL_RX.test(v)) return 'mailto:' + v;
  // If it *looks* like a URL, normalize and use. Otherwise return as-is.
  var web = normalizeWebsiteUrl(v);
  return web || v;
}

/* -------------------------------------------------------------------------- */
/*                            WORD COUNT HELPERS                              */
/* -------------------------------------------------------------------------- */

export var MAX_DESC_WORDS = 200;

export function countWords(s) {
  var m = String(s || '').trim().match(/\S+/g);
  return m ? m.length : 0;
}

/* -------------------------------------------------------------------------- */
/*                                 DOM HELPERS                                */
/* -------------------------------------------------------------------------- */

export function cls() {
  var out = [];
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) out.push(arguments[i]);
  }
  return out.join(' ');
}

export function byId(id) {
  return document.getElementById(id);
}

/* -------------------------------------------------------------------------- */
/*                              COLOR PALETTES                                */
/* -------------------------------------------------------------------------- */

export var FIELD_PALETTE = {
  'STEM': ['bg-sky-50', 'border-sky-200', 'text-sky-700'],
  'Humanities': ['bg-amber-50', 'border-amber-200', 'text-amber-700'],
  'Arts / Culture': ['bg-fuchsia-50', 'border-fuchsia-200', 'text-fuchsia-700'],
  'Social Impact / Service': ['bg-orange-50', 'border-orange-200', 'text-orange-700'],
  'Sports & Wellness': ['bg-emerald-50', 'border-emerald-200', 'text-emerald-700'],
  'Faith / Identity / Other': ['bg-slate-50', 'border-slate-200', 'text-slate-700'],

  // Legacy back-compat labels
  'Arts': ['bg-fuchsia-50', 'border-fuchsia-200', 'text-fuchsia-700'],
  'Community Service': ['bg-orange-50', 'border-orange-200', 'text-orange-700'],
  'Sports': ['bg-emerald-50', 'border-emerald-200', 'text-emerald-700'],
  'Other': ['bg-slate-50', 'border-slate-200', 'text-slate-700'],
};

export var CAT_PALETTE = {
  'competition': ['bg-indigo-50', 'border-indigo-200', 'text-indigo-700'],
  'activity': ['bg-teal-50', 'border-teal-200', 'text-teal-700'],
  'community': ['bg-orange-50', 'border-orange-200', 'text-orange-700'],
  'research': ['bg-cyan-50', 'border-cyan-200', 'text-cyan-700'],
  'advocacy': ['bg-rose-50', 'border-rose-200', 'text-rose-700'],
  'outreach': ['bg-violet-50', 'border-violet-200', 'text-violet-700'],
};

export var SUB_PALETTE = {
  'Biology': ['bg-emerald-50', 'border-emerald-200', 'text-emerald-700'],
  'Chemistry': ['bg-lime-50', 'border-lime-200', 'text-lime-700'],
  'Physics / Engineering': ['bg-orange-50', 'border-orange-200', 'text-orange-700'],
  'Computer Science / Tech': ['bg-purple-50', 'border-purple-200', 'text-purple-700'],
  'Math / Data': ['bg-sky-50', 'border-sky-200', 'text-sky-700'],
  'Medicine & Health': ['bg-pink-50', 'border-pink-200', 'text-pink-700'],
};

/* -------------------------------------------------------------------------- */
/*                                 BADGE HELPERS                              */
/* -------------------------------------------------------------------------- */

export function pastelBadge(text, palette) {
  var p = palette || ['bg-neutral-50', 'border-neutral-300', 'text-neutral-700'];
  return (
    '<span class="' +
    cls('px-2', 'py-0.5', 'rounded-full', 'text-xs', 'border', p[0], p[1], p[2]) +
    '">' +
    esc(text) +
    '</span>'
  );
}

export function chip(text) {
  return (
    '<span class="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs">' +
    esc(text) +
    '</span>'
  );
}

/* -------------------------------------------------------------------------- */
/*                        ADMIN SESSION UTILITIES (CLIENT)                    */
/* -------------------------------------------------------------------------- */

var ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours (UI-side)

export function setAdminSessionToken(sessionId) {
  try {
    localStorage.setItem('ADMIN_SESSION', sessionId);
    localStorage.setItem('ADMIN_LOGIN_TIME', String(Date.now()));
  } catch (e) {
    // ignore
  }
}

export function getAdminSessionToken() {
  try {
    return localStorage.getItem('ADMIN_SESSION') || '';
  } catch (e) {
    return '';
  }
}

export function adminAuthHeaders() {
  var h = {};
  var sid = getAdminSessionToken();
  if (sid) h['x-admin-session'] = sid;
  return h;
}

export function isAdminSessionValid() {
  try {
    var sid = localStorage.getItem('ADMIN_SESSION');
    var t = localStorage.getItem('ADMIN_LOGIN_TIME');
    if (!sid || !t) return false;
    var elapsed = Date.now() - Number(t);
    return elapsed >= 0 && elapsed < ADMIN_SESSION_TTL_MS;
  } catch (e) {
    return false;
  }
}

export function updateAdminSessionTimestamp() {
  try {
    if (!getAdminSessionToken()) return;
    localStorage.setItem('ADMIN_LOGIN_TIME', String(Date.now()));
  } catch (e) {
    // ignore
  }
}

export function clearAdminStorage() {
  try {
    localStorage.removeItem('ADMIN_SESSION');
    localStorage.removeItem('ADMIN_LOGIN_TIME');
  } catch (e) {
    // ignore
  }
}

/* -------------------------------------------------------------------------- */
/*                      SHA-256 HELPER (BROWSER SIDE)                         */
/* -------------------------------------------------------------------------- */

export async function sha256Browser(s) {
  if (!window.crypto || !window.crypto.subtle) return null;
  var buf = new TextEncoder().encode(String(s));
  var hash = await window.crypto.subtle.digest('SHA-256', buf);
  var arr = Array.from(new Uint8Array(hash));
  return arr.map(function (b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
}
