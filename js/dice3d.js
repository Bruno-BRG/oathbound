/* ==========================================================================
   OATHBOUND — 3D dice (three.js)
   The roll is decided by the game (crypto RNG) first. This module only
   plays a short, smooth throw that lands each die on the face that was
   rolled. Customisable colours, finish, pips or numbers, and quality.
   three.js loads on demand from assets/vendor (works offline via the PWA).
   ========================================================================== */
(function (OB) {
  'use strict';
  const KEY = 'oathbound.dice3d';

  OB.DICE_PRESETS = [
    { key: 'ivory',    name: 'Ivory',    body: '#f2eee3', ink: '#15130e' },
    { key: 'bone',     name: 'Bone',     body: '#d9cfb6', ink: '#3a2a1a' },
    { key: 'obsidian', name: 'Obsidian', body: '#1b1f27', ink: '#e9d7a0' },
    { key: 'ruby',     name: 'Ruby',     body: '#8f1d2a', ink: '#ffe6d6' },
    { key: 'sapphire', name: 'Sapphire', body: '#1f439a', ink: '#e8f0ff' },
    { key: 'emerald',  name: 'Emerald',  body: '#17653f', ink: '#e6ffec' },
    { key: 'amethyst', name: 'Amethyst', body: '#5c2f8d', ink: '#f2e6ff' },
    { key: 'ember',    name: 'Ember',    body: '#b94a1c', ink: '#fff0da' },
    { key: 'gold',     name: 'Gold',     body: '#c9a45c', ink: '#2a1d05' },
    { key: 'steel',    name: 'Steel',    body: '#7a8496', ink: '#0d1219' }
  ];
  const QUALITY = {
    low:    { cell: 128, dpr: 1,   seg: 3, shadow: 0,    aa: false },
    medium: { cell: 256, dpr: 1.5, seg: 5, shadow: 1024, aa: true },
    high:   { cell: 384, dpr: 2,   seg: 8, shadow: 2048, aa: true }
  };
  const FINISH = {
    glossy: { roughness: 0.2,  metalness: 0.04, clearcoat: 1,   clearcoatRoughness: 0.1 },
    matte:  { roughness: 0.62, metalness: 0,    clearcoat: 0,   clearcoatRoughness: 0.6 },
    metal:  { roughness: 0.3,  metalness: 0.9,  clearcoat: 0.3, clearcoatRoughness: 0.3 }
  };

  const defaults = () => ({
    on: true, quality: 'high', pips: true,
    action:    { body: '#f2eee3', ink: '#15130e', finish: 'glossy' },
    challenge: { body: '#1b1f27', ink: '#e9d7a0', finish: 'glossy' }
  });
  const merge = (a, b) => { Object.keys(b || {}).forEach(k => { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) a[k] = merge(a[k] || {}, b[k]); else a[k] = b[k]; }); return a; };
  function loadSettings() {
    const d = defaults();
    try { const j = JSON.parse(localStorage.getItem(KEY)); if (j) return merge(d, j); } catch (e) { /* ignore */ }
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.on = false; } catch (e) { /* ignore */ }
    return d;
  }
  let S = loadSettings();
  const saveSettings = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  /* ---------- lazy three.js ---------- */
  let T = null, loading = null, failed = false, R = null;
  const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
  function load() {
    if (T) return Promise.resolve(T);
    if (failed) return Promise.reject(new Error('3D unavailable'));
    if (!loading) {
      loading = (webglOK() ? import('../assets/vendor/three-dice.js') : Promise.reject(new Error('No WebGL')))
        .then(m => { T = m; return m; })
        .catch(e => { failed = true; loading = null; throw e; });
    }
    return loading;
  }

  /* ---------- colour + texture helpers ---------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = amt >= 0 ? 255 : 0, p = Math.abs(amt);
    r = Math.round(r + (f - r) * p); g = Math.round(g + (f - g) * p); b = Math.round(b + (f - b) * p);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function paintBody(ctx, x, y, s, body) {
    const g = ctx.createRadialGradient(x + s / 2, y + s / 2, s * 0.08, x + s / 2, y + s / 2, s * 0.78);
    g.addColorStop(0, shade(body, 0.07)); g.addColorStop(0.7, body); g.addColorStop(1, shade(body, -0.22));
    ctx.fillStyle = g; ctx.fillRect(x, y, s, s);
  }
  function paintLabel(ctx, x, y, s, label, ink, tri) {
    const len = label.length;
    const px = Math.round(s * (tri ? 0.34 : 0.5) * (len >= 2 ? 0.78 : 1));
    ctx.font = `700 ${px}px "Barlow Condensed", "Lato", Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const cx = x + s / 2, cy = y + s / 2 + px * 0.04;
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillText(label, cx - s * 0.006, cy - s * 0.008);
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillText(label, cx + s * 0.007, cy + s * 0.009);
    ctx.fillStyle = ink; ctx.fillText(label, cx, cy);
    if (/^[69]$/.test(label)) { ctx.fillRect(cx - px * 0.22, cy + px * 0.42, px * 0.44, Math.max(2, px * 0.06)); }
  }
  const PIPS = { 1: [[.5, .5]], 2: [[.28, .72], [.72, .28]], 3: [[.28, .72], [.5, .5], [.72, .28]], 4: [[.28, .28], [.72, .28], [.28, .72], [.72, .72]], 5: [[.28, .28], [.72, .28], [.5, .5], [.28, .72], [.72, .72]], 6: [[.28, .25], [.72, .25], [.28, .5], [.72, .5], [.28, .75], [.72, .75]] };
  function paintPips(ctx, x, y, s, n, ink) {
    PIPS[n].forEach(([u, v]) => {
      const cx = x + u * s, cy = y + v * s, r = s * (n === 1 ? 0.14 : 0.095);
      const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, shade(ink, 0.25)); g.addColorStop(1, ink);
      ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.arc(cx, cy + r * 0.1, r * 1.08, 0, 6.2832); ctx.fill();
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
    });
  }

  /* ---------- geometry ---------- */
  // flat-shaded polyhedron from faces (arrays of Vector3). Face i gets atlas cell i.
  function polyhedron(faces, cols, rows, upIdx) {
    const { Vector3, BufferGeometry, Float32BufferAttribute } = T;
    const pos = [], nor = [], uv = [], normals = [], dists = [];
    faces.forEach((vs, i) => {
      const c = new Vector3(); vs.forEach(v => c.add(v)); c.multiplyScalar(1 / vs.length);
      let n = new Vector3().subVectors(vs[1], vs[0]).cross(new Vector3().subVectors(vs[2], vs[0])).normalize();
      if (n.dot(c) < 0) { n.negate(); vs = vs.slice().reverse(); }
      normals.push(n); dists.push(n.dot(vs[0]));
      const up = new Vector3().subVectors(vs[upIdx[i] || 0], c).normalize();
      const right = new Vector3().crossVectors(up, n).normalize();
      const pts = vs.map(v => { const d = new Vector3().subVectors(v, c); return [d.dot(right), d.dot(up)]; });
      const ext = Math.max(...pts.map(p => Math.max(Math.abs(p[0]), Math.abs(p[1])))) || 1;
      const k = 0.5 / ext * 0.9;
      const ox = (i % cols) / cols, oy = 1 - (Math.floor(i / cols) + 1) / rows;
      const uvs = pts.map(p => [ox + (0.5 + p[0] * k) / cols, oy + (0.5 + p[1] * k) / rows]);
      for (let t = 1; t < vs.length - 1; t++) {
        [0, t, t + 1].forEach(j => { pos.push(vs[j].x, vs[j].y, vs[j].z); nor.push(n.x, n.y, n.z); uv.push(uvs[j][0], uvs[j][1]); });
      }
    });
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
    return { geo, normals, rest: Math.min(...dists) };
  }

  // pentagonal trapezohedron. Opposite faces add up to 11. Numbers per face index 0..9.
  function d10Faces() {
    const { Vector3 } = T;
    const R0 = 1.08, b = 0.1056 * R0, p = 1.0 * R0;
    const U = [], L = [];
    for (let k = 0; k < 5; k++) {
      const a = k * 2 * Math.PI / 5, a2 = a + Math.PI / 5;
      U.push(new Vector3(R0 * Math.cos(a), b, R0 * Math.sin(a)));
      L.push(new Vector3(R0 * Math.cos(a2), -b, R0 * Math.sin(a2)));
    }
    const top = new Vector3(0, p, 0), bot = new Vector3(0, -p, 0);
    const faces = [], nums = [];
    for (let k = 0; k < 5; k++) { faces.push([top, U[k], L[k], U[(k + 1) % 5]]); nums.push(2 * k + 1); }          // 1 3 5 7 9
    for (let j = 0; j < 5; j++) { faces.push([bot, L[j], U[(j + 1) % 5], L[(j + 1) % 5]]); }
    // bottom kite j is opposite to top kite (j + 3) % 5
    const bottom = new Array(5);
    for (let k = 0; k < 5; k++) bottom[(k + 2) % 5] = 11 - (2 * k + 1);
    return { faces, nums: nums.concat(bottom) };
  }

  function d20Faces() {
    const { Vector3 } = T;
    const f = (1 + Math.sqrt(5)) / 2, S = 1.2 / Math.sqrt(1 + f * f);
    const V = [[-1, f, 0], [1, f, 0], [-1, -f, 0], [1, -f, 0], [0, -1, f], [0, 1, f], [0, -1, -f], [0, 1, -f], [f, 0, -1], [f, 0, 1], [-f, 0, -1], [-f, 0, 1]].map(a => new Vector3(a[0] * S, a[1] * S, a[2] * S));
    const I = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    const faces = I.map(t => t.map(i => V[i]));
    const cen = faces.map(vs => vs.reduce((a, v) => a.clone().add(v), new Vector3()).normalize());
    const nums = new Array(20).fill(0); let next = 1;
    for (let i = 0; i < 20; i++) {
      if (nums[i]) continue;
      let o = 0; for (let j = 0; j < 20; j++) if (cen[j].dot(cen[i]) < cen[o].dot(cen[i])) o = j;
      nums[i] = next; nums[o] = 21 - next; next++;
    }
    return { faces, nums };
  }

  /* ---------- die factory (cached per look) ---------- */
  const cache = {};
  function material(T_, map, look) {
    const f = FINISH[look.finish] || FINISH.glossy;
    return new T_.MeshPhysicalMaterial(Object.assign({ map, envMapIntensity: 0.9 }, f));
  }
  function texture(canvas) {
    const tx = new T.CanvasTexture(canvas);
    tx.colorSpace = T.SRGBColorSpace; tx.minFilter = T.LinearMipmapLinearFilter; tx.magFilter = T.LinearFilter;
    tx.anisotropy = R.renderer.capabilities.getMaxAnisotropy();
    return tx;
  }
  function build(type, role) {
    const q = QUALITY[S.quality] || QUALITY.high, look = S[role === 'action' ? 'action' : 'challenge'];
    const key = [type, role, look.body, look.ink, look.finish, S.pips, S.quality].join('|');
    if (cache[key]) return cache[key];
    let out;
    if (type === 'd6') {
      const side = 1.7;
      const geo = new T.RoundedBoxGeometry(side, side, side, q.seg, 0.17);
      const vals = [3, 4, 1, 6, 2, 5];                              // +x -x +y -y +z -z (opposites add to 7)
      const mats = vals.map(v => {
        const cv = document.createElement('canvas'); cv.width = cv.height = q.cell;
        const ctx = cv.getContext('2d'); paintBody(ctx, 0, 0, q.cell, look.body);
        if (S.pips) paintPips(ctx, 0, 0, q.cell, v, look.ink); else paintLabel(ctx, 0, 0, q.cell, String(v), look.ink, false);
        return material(T, texture(cv), look);
      });
      const nrm = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(a => new T.Vector3(a[0], a[1], a[2]));
      out = { geo, mats, faceOf: v => nrm[vals.indexOf(v)], rest: side / 2 };
    } else {
      const isD20 = type === 'd20';
      const def = isD20 ? d20Faces() : d10Faces();
      const cols = 5, rows = Math.ceil(def.faces.length / cols), cs = q.cell;
      const cv = document.createElement('canvas'); cv.width = cols * cs; cv.height = rows * cs;
      const ctx = cv.getContext('2d');
      const kind = type === 'd10t' ? 'tens' : type === 'd10u' ? 'units' : 'plain';
      const labels = def.nums.map(n => kind === 'tens' ? String((n % 10) * 10).padStart(2, '0') : kind === 'units' ? String(n % 10) : String(n));
      def.faces.forEach((_, i) => { const x = (i % cols) * cs, y = Math.floor(i / cols) * cs; paintBody(ctx, x, y, cs, look.body); paintLabel(ctx, x, y, cs, labels[i], look.ink, isD20); });
      const up = def.faces.map(() => 0);
      const built = polyhedron(def.faces, cols, rows, up);
      const map = texture(cv);
      out = { geo: built.geo, mats: material(T, map, look), faceOf: n => built.normals[def.nums.indexOf(n)], rest: built.rest };
    }
    cache[key] = out; return out;
  }
  const clearCache = () => { Object.keys(cache).forEach(k => { const o = cache[k]; (Array.isArray(o.mats) ? o.mats : [o.mats]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); o.geo.dispose(); delete cache[k]; }); };

  /* ---------- renderer / scene ---------- */
  function ensureRenderer() {
    if (R) return R;
    const q = QUALITY[S.quality] || QUALITY.high;
    const canvas = document.createElement('canvas');
    canvas.id = 'dice3d'; canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const renderer = new T.WebGLRenderer({ canvas, antialias: q.aa, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = q.shadow > 0;
    const scene = new T.Scene();
    const pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new T.RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.75;
    const camera = new T.PerspectiveCamera(38, 1, 0.1, 80);
    const hemi = new T.HemisphereLight(0xffffff, 0x2a2f3c, 0.55); scene.add(hemi);
    const sun = new T.DirectionalLight(0xffffff, 2.1); sun.position.set(-4, 11, 5); sun.castShadow = q.shadow > 0;
    if (q.shadow) { sun.shadow.mapSize.set(q.shadow, q.shadow); const c = sun.shadow.camera; c.left = -9; c.right = 9; c.top = 9; c.bottom = -9; c.near = 1; c.far = 30; sun.shadow.bias = -0.0004; sun.shadow.radius = 4; }
    scene.add(sun); scene.add(sun.target);
    const ground = new T.Mesh(new T.PlaneGeometry(60, 60), new T.ShadowMaterial({ opacity: 0.38 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    R = { canvas, renderer, scene, camera, sun, ground, pm, dice: [], raf: 0, hideT: 0, q: S.quality };
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); teardown(); });
    return R;
  }
  function teardown() { if (!R) return; cancelAnimationFrame(R.raf); clearTimeout(R.hideT); clearCache(); try { R.renderer.dispose(); } catch (e) { /* ignore */ } R.canvas.remove(); R = null; }

  const ease = { outQuart: t => 1 - Math.pow(1 - t, 4), outCubic: t => 1 - Math.pow(1 - t, 3) };

  /* ---------- play ---------- */
  // specs: [{type:'d6'|'d10'|'d10t'|'d10u'|'d20', value, role:'action'|'challenge'}]
  const DURATION = 1550, HOLD = 1300;
  function run(specs) {
    ensureRenderer();
    if (R.q !== S.quality) { teardown(); ensureRenderer(); }
    const { renderer, scene, camera, sun, canvas } = R, q = QUALITY[S.quality] || QUALITY.high;
    R.dice.forEach(d => scene.remove(d.mesh)); R.dice = [];
    cancelAnimationFrame(R.raf); clearTimeout(R.hideT);
    const w = window.innerWidth, h = window.innerHeight, dpr = Math.min(window.devicePixelRatio || 1, q.dpr);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const n = specs.length, aspect = w / h;
    const spacing = 2.75, width = Math.max(5.4, n * spacing);
    const dist = Math.max(11.5, width / (2 * Math.tan(camera.fov * Math.PI / 360) * aspect) * 1.02);
    camera.position.set(0, dist * 0.93, dist * 0.37); camera.lookAt(0, 0, -0.3);
    const rows = aspect < 0.75 && n > 2 ? 2 : 1, perRow = Math.ceil(n / rows);
    const { Vector3, Quaternion, MathUtils } = T, UP = new Vector3(0, 1, 0);
    const t0 = performance.now();
    specs.forEach((sp, i) => {
      const def = build(sp.type, sp.role);
      const mesh = new T.Mesh(def.geo, def.mats);
      mesh.castShadow = q.shadow > 0; scene.add(mesh);
      const row = Math.floor(i / perRow), col = i % perRow, inRow = row === rows - 1 ? n - perRow * (rows - 1) : perRow;
      const ex = (col - (inRow - 1) / 2) * spacing, ez = (rows === 1 ? 0 : (row - 0.5) * 2.5) - 0.2;
      const side = (i % 2 ? 1 : -1) * (width / 2 + 3.5);
      const qFace = new Quaternion().setFromUnitVectors(def.faceOf(sp.value).clone().normalize(), UP);
      const qTarget = new Quaternion().setFromAxisAngle(UP, Math.random() * Math.PI * 2).multiply(qFace);
      R.dice.push({
        mesh, rest: def.rest, qTarget, delay: i * 70,
        sx: side, sz: ez + (Math.random() - 0.5) * 3, ex, ez,
        axis: new Vector3(Math.random() - 0.5, Math.random() * 0.6 + 0.4, Math.random() - 0.5).normalize(),
        spin: Math.PI * (5 + Math.random() * 3), bounces: 3 + Math.round(Math.random()), h: 2.8 + Math.random() * 1.2
      });
    });
    sun.target.position.set(0, 0, 0);
    canvas.style.transition = 'none'; canvas.style.opacity = '1'; canvas.style.display = 'block';
    const total = DURATION + specs.length * 70;
    const q2 = new Quaternion(), qs = new Quaternion();
    const frame = now => {
      const el = now - t0;
      R.dice.forEach(d => {
        const t = MathUtils.clamp((el - d.delay) / DURATION, 0, 1), e = ease.outQuart(t), k = Math.pow(1 - t, 1.5);
        const x = d.sx + (d.ex - d.sx) * e, z = d.sz + (d.ez - d.sz) * ease.outCubic(t);
        const y = d.rest + (t < 1 ? Math.abs(Math.sin(Math.PI * d.bounces * t * (0.35 + 0.65 * t))) * d.h * k : 0) + (1 - e) * 0.6;
        d.mesh.position.set(x, y, z);
        qs.setFromAxisAngle(d.axis, d.spin * (1 - ease.outCubic(t)));
        q2.copy(qs).multiply(d.qTarget); d.mesh.quaternion.copy(q2);
      });
      renderer.render(scene, camera);
      if (el < total + 40) R.raf = requestAnimationFrame(frame);
      else {
        R.hideT = setTimeout(() => {
          canvas.style.transition = 'opacity .45s ease'; canvas.style.opacity = '0';
          R.hideT = setTimeout(() => { canvas.style.display = 'none'; }, 480);
        }, HOLD);
      }
    };
    R.raf = requestAnimationFrame(frame);
    return total;
  }

  /* ---------- entry → dice ---------- */
  const digits = v => { const n = v === 100 ? 0 : v; return [Math.floor(n / 10), n % 10]; };
  const d10n = v => (v === 0 ? 10 : v);                 // digit 0 sits on the "10" face
  function specsFor(e) {
    if (e.kind === 'action') return [{ type: 'd6', value: e.d6, role: 'action' }, { type: 'd10', value: e.c1, role: 'challenge' }, { type: 'd10', value: e.c2, role: 'challenge' }];
    if (e.kind === 'progress') return [{ type: 'd10', value: e.c1, role: 'challenge' }, { type: 'd10', value: e.c2, role: 'challenge' }];
    const pct = v => { const [t, u] = digits(v); return [{ type: 'd10t', value: d10n(t), role: 'challenge' }, { type: 'd10u', value: d10n(u), role: 'challenge' }]; };
    if (e.kind === 'ask') return pct(e.roll);
    if (e.kind === 'oracle' && e.parts && e.parts.length === 1 && typeof e.parts[0].roll === 'number') return pct(e.parts[0].roll);
    if (e.kind === 'die') return [{ type: e.sides === 20 ? 'd20' : e.sides === 6 ? 'd6' : 'd10', value: e.value, role: e.sides === 6 ? 'action' : 'challenge' }];
    return null;
  }

  OB.dice3d = {
    settings: () => S,
    supported: () => !failed && webglOK(),
    enabled: () => !!S.on && !failed,
    preload() { if (S.on) load().catch(() => {}); },
    // returns ms until the dice have landed (0 = not played, show result at once)
    play(entry) {
      if (!S.on || failed || !T) { if (S.on && !failed) load().catch(() => {}); return 0; }
      const specs = specsFor(entry); if (!specs) return 0;
      try { return run(specs); } catch (err) { failed = true; teardown(); return 0; }
    },
    test() {
      load().then(() => { if (!T) return; const d6 = 1 + Math.floor(Math.random() * 6), c1 = 1 + Math.floor(Math.random() * 10), c2 = 1 + Math.floor(Math.random() * 10);
        run([{ type: 'd6', value: d6, role: 'action' }, { type: 'd10', value: c1, role: 'challenge' }, { type: 'd10', value: c2, role: 'challenge' }, { type: 'd20', value: 1 + Math.floor(Math.random() * 20), role: 'challenge' }]); })
        .catch(() => OB.toast('3D dice need a browser with WebGL and the hosted app (not file://).'));
    },
    set(path, val) {
      const [a, b] = path.split('.');
      if (b) S[a][b] = val; else S[a] = val;
      saveSettings(); clearCache(); if (path === 'quality') teardown();
    },
    openSettings() {
      const row = (role, title) => {
        const look = S[role];
        return `<div class="dsty"><h4>${title}</h4>
          <div class="dsty-sw">${OB.DICE_PRESETS.map(p => `<button type="button" class="dsw ${look.body === p.body ? 'on' : ''}" style="--b:${p.body};--i:${p.ink}" data-d3-preset="${role}|${p.key}" title="${p.name}" aria-label="${p.name}"><i>6</i></button>`).join('')}</div>
          <div class="dsty-c"><label>Body <input type="color" value="${look.body}" data-d3="${role}.body"></label>
            <label>Numbers <input type="color" value="${look.ink}" data-d3="${role}.ink"></label>
            <label>Finish <select data-d3="${role}.finish"><option value="glossy" ${look.finish === 'glossy' ? 'selected' : ''}>Glossy</option><option value="matte" ${look.finish === 'matte' ? 'selected' : ''}>Matte</option><option value="metal" ${look.finish === 'metal' ? 'selected' : ''}>Metal</option></select></label></div></div>`;
      };
      OB.modal({
        title: 'Dice style', ok: 'Test roll', cancel: 'Close',
        html: `<div class="dsty-top">
            <label class="chk"><input type="checkbox" data-d3="on" ${S.on ? 'checked' : ''}><span class="box"></span><span>3D dice</span></label>
            <label class="fl">Quality<select data-d3="quality"><option value="low" ${S.quality === 'low' ? 'selected' : ''}>Low (fast)</option><option value="medium" ${S.quality === 'medium' ? 'selected' : ''}>Medium</option><option value="high" ${S.quality === 'high' ? 'selected' : ''}>High (sharp)</option></select></label>
            <label class="chk"><input type="checkbox" data-d3="pips" ${S.pips ? 'checked' : ''}><span class="box"></span><span>Pips on the d6</span></label></div>
          ${row('action', 'Action die (d6)')}${row('challenge', 'Challenge dice (d10)')}
          <p class="muted small">${OB.dice3d.supported() ? 'Dice are rolled by the game first. The 3D throw only shows the result. Settings save on this device.' : 'This browser cannot show 3D dice here. WebGL is off, or the page is opened from a file. The roll log still works.'}</p>`,
        onOpen: m => {
          const refresh = () => { OB.dice3d.openSettings(); };
          m.addEventListener('change', e => {
            const el = e.target.closest('[data-d3]'); if (!el) return;
            const v = el.type === 'checkbox' ? el.checked : el.value;
            OB.dice3d.set(el.dataset.d3, v);
            if (el.dataset.d3 === 'on' && v) OB.dice3d.preload();
          });
          m.addEventListener('input', e => { const el = e.target.closest('input[type=color][data-d3]'); if (el) OB.dice3d.set(el.dataset.d3, el.value); });
          m.addEventListener('click', e => {
            const b = e.target.closest('[data-d3-preset]'); if (!b) return;
            const [role, key] = b.dataset.d3Preset.split('|'); const p = OB.DICE_PRESETS.find(x => x.key === key);
            OB.dice3d.set(role + '.body', p.body); OB.dice3d.set(role + '.ink', p.ink); refresh();
          });
        },
        onOk: () => { OB.dice3d.test(); return false; }
      });
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(() => OB.dice3d.preload(), { timeout: 4000 }); else setTimeout(() => OB.dice3d.preload(), 2500);
})(window.OB);
