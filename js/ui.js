/* ==========================================================================
   OATHBOUND — UI helpers: form controls, toast, modal, ticks, tracks
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc;

  OB.v = {};   // view registry: OB.v.sheet = () => html

  /* ---------- form controls (bound to the active character) ---------- */
  OB.f = {
    text: (path, val, o) => { o = o || {}; return `<input type="text" data-bind="${path}" value="${E(val)}" placeholder="${E(o.ph || '')}" ${o.cls ? `class="${o.cls}"` : ''} ${o.hook ? `data-hook="${o.hook}"` : ''} autocomplete="off" spellcheck="false" aria-label="${E(o.label || o.ph || path)}">`; },
    area: (path, val, o) => { o = o || {}; return `<textarea data-bind="${path}" rows="${o.rows || 3}" placeholder="${E(o.ph || '')}" ${o.cls ? `class="${o.cls}"` : ''} aria-label="${E(o.label || o.ph || path)}">${E(val)}</textarea>`; },
    num: (path, val, min, max, o) => { o = o || {}; return `<input type="number" inputmode="numeric" data-bind="${path}" data-type="num" value="${val}" min="${min}" max="${max}" ${o.cls ? `class="${o.cls}"` : ''} ${o.hook ? `data-hook="${o.hook}"` : ''} aria-label="${E(o.label || path)}">`; },
    sel: (path, val, opts, o) => { o = o || {}; return `<select data-bind="${path}" ${o.hook ? `data-hook="${o.hook}"` : ''} aria-label="${E(o.label || path)}">${o.blank !== false ? `<option value="">${E(o.blank || '— choose —')}</option>` : ''}${opts.map(x => { const v = typeof x === 'string' ? x : x.v, l = typeof x === 'string' ? x : x.l; return `<option value="${E(v)}" ${v === val ? 'selected' : ''}>${E(l)}</option>`; }).join('')}</select>`; },
    chk: (path, val, label, o) => { o = o || {}; return `<label class="chk"><input type="checkbox" data-bind="${path}" data-type="bool" ${val ? 'checked' : ''} ${o.hook ? `data-hook="${o.hook}"` : ''}><span class="box"></span><span>${label}</span></label>`; }
  };

  /* ---------- tick box for progress tracks ---------- */
  OB.tickSvg = function (n) {
    // n = 0..4 ticks: \  /  |  —
    const p = [];
    if (n >= 1) p.push('<path d="M4 4 L20 20"/>');
    if (n >= 2) p.push('<path d="M20 4 L4 20"/>');
    if (n >= 3) p.push('<path d="M12 3 L12 21"/>');
    if (n >= 4) p.push('<path d="M3 12 L21 12"/>');
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${p.join('')}</svg>`;
  };
  OB.trackBoxes = function (ticks) {
    let out = '';
    for (let i = 0; i < 10; i++) {
      const n = Math.max(0, Math.min(4, ticks - i * 4));
      out += `<span class="pbox ${n === 4 ? 'full' : n > 0 ? 'part' : ''}">${OB.tickSvg(n)}</span>`;
    }
    return `<div class="ptrack" role="img" aria-label="${Math.floor(ticks / 4)} of 10 boxes filled">${out}</div>`;
  };

  /* ---------- segmented value row: cells 0..max, click sets value ---------- */
  OB.cells = function (key, value, min, max, o) {
    o = o || {};
    let out = '';
    for (let i = min; i <= max; i++) {
      const cls = ['cell', i === value ? 'cur' : '', i <= value && i >= 0 ? 'fill' : '', i < 0 ? 'neg' : '', (o.lockAbove != null && i > o.lockAbove) ? 'lock' : '', o.reset === i ? 'reset' : ''].join(' ');
      out += `<button type="button" class="${cls}" data-act="setVital" data-k="${key}" data-v="${i}" aria-label="Set ${key} to ${i}" ${(o.lockAbove != null && i > o.lockAbove) ? 'disabled' : ''}>${i > 0 && o.signed ? '+' + i : i}</button>`;
    }
    return `<div class="cells ${o.cls || ''}" role="group" aria-label="${key}">${out}</div>`;
  };

  /* ---------- toast ---------- */
  let toastT = null;
  OB.toast = function (msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
  };

  /* ---------- modal ---------- */
  OB.modal = function (o) {
    const prev = document.getElementById('modal'); if (prev) prev.remove();
    const m = document.createElement('div');
    m.id = 'modal'; m.className = 'modal-wrap';
    m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${E(o.title)}">
      <header><h3>${E(o.title)}</h3><button type="button" class="x" data-m="close" aria-label="Close">×</button></header>
      <div class="modal-body">${o.html || ''}</div>
      <footer>${o.noCancel ? '' : `<button type="button" class="btn ghost" data-m="cancel">${E(o.cancel || 'Cancel')}</button>`}${o.ok === false ? '' : `<button type="button" class="btn primary" data-m="ok">${E(o.ok || 'OK')}</button>`}</footer></div>`;
    document.body.appendChild(m);
    const close = () => { m.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    m.addEventListener('click', e => {
      if (e.target.closest('[data-m="cancel"]')) { close(); if (o.onCancel) o.onCancel(); return; }
      if (e.target === m || e.target.closest('[data-m="close"]')) return close();
      if (e.target.closest('[data-m="ok"]')) { if (!o.onOk || o.onOk(m) !== false) close(); }
    });
    if (o.onOpen) o.onOpen(m);
    const first = m.querySelector('input,select,textarea,button.primary'); if (first) first.focus();
    return { close, el: m };
  };
  OB.confirm = function (msg, okLabel, cb) {
    OB.modal({ title: 'Please confirm', html: `<p>${E(msg)}</p>`, ok: okLabel || 'Yes', onOk: () => { cb(); } });
  };

  /* ---------- small shared markup ---------- */
  OB.badgeRank = r => `<span class="rank r-${r}">${OB.RANK[r].name}</span>`;
  OB.rankSelect = (id, val, bind) => `<select ${bind ? `data-bind="${bind}"` : ''} id="${id || ''}" class="rank-sel">${OB.RANKS.map(r => `<option value="${r.key}" ${r.key === val ? 'selected' : ''}>${r.name}</option>`).join('')}</select>`;
  OB.banner = (img, title, sub) => `<div class="banner" style="--img:url(../assets/${img}.jpg)"><div class="banner-text"><div class="orn"><i></i>${OB.icon('logo')}<i></i></div><h2>${E(title)}</h2>${sub ? `<p>${E(sub)}</p>` : ''}</div></div>`;
  OB.sectionHead = (t, extra) => `<div class="sec-head"><h3>${E(t)}</h3>${extra || ''}</div>`;
  OB.details = (key, title, body, openDefault) => {
    const open = OB.ui.open[key] != null ? OB.ui.open[key] : !!openDefault;
    return `<details class="acc" data-key="${E(key)}" ${open ? 'open' : ''}><summary>${title}</summary><div class="acc-body">${body}</div></details>`;
  };
})(window.OB);
