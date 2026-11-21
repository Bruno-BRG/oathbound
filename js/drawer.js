/* ==========================================================================
   OATHBOUND — right drawer: journal section (dice, oracles and moves
   live in their own files and are placed here by app.js)
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc, F = OB.f;

  OB.drawerJournal = function () {
    const c = OB.char();
    const q = (OB.ui.journalQ || '').toLowerCase().trim();
    const list = c.journal
      .filter(j => !q || ((j.title || '') + ' ' + (j.text || '')).toLowerCase().includes(q))
      .slice()
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return `<div class="jr-tools">
        <button type="button" class="btn sm primary" data-act="addEntry">${OB.icon('plus')}New entry</button>
        <input type="search" id="journal-search" placeholder="Search title or text…" value="${E(OB.ui.journalQ || '')}" aria-label="Search journal">
      </div>
      ${list.map(j => `<article class="entry ${j.pinned ? 'pinned' : ''}">
        <div class="entry-h">
          ${F.text(`journal#${j.id}.title`, j.title, { ph: 'Title', cls: 'entry-title', label: 'Entry title' })}
          <button type="button" class="ib sm" data-act="pinEntry" data-id="${j.id}" aria-pressed="${!!j.pinned}" aria-label="${j.pinned ? 'Unpin' : 'Pin'} entry" title="${j.pinned ? 'Unpin' : 'Pin to top'}">${OB.icon(j.pinned ? 'pin' : 'pinOff')}</button>
          <button type="button" class="ib sm" data-act="delEntry" data-id="${j.id}" aria-label="Delete entry">${OB.icon('trash')}</button>
        </div>
        ${F.text(`journal#${j.id}.date`, j.date, { ph: 'Date or session', cls: 'entry-date', label: 'Entry date' })}
        ${F.area(`journal#${j.id}.text`, j.text, { rows: 5, ph: 'What happened…', label: 'Entry text' })}
      </article>`).join('') || '<p class="muted empty">No entries yet. Write what happened, or add a quest starter from the Campaign or Amarin tabs.</p>'}`;
  };
})(window.OB);
