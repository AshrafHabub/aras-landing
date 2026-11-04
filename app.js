/* ==========================================================================
   ARAS GRUPPE — Landing-Logik
   - Intro (einmal pro Sitzung)
   - EIN WebGL-Canvas (fixed) für das Squishy; es folgt "Ankern" im DOM:
       [data-anchor="hero"]    → im Hero
       [data-anchor="squishy"] → fliegt in die DeSquishy-Karte
   - Antippen drückt das Squishy an der getroffenen Seite ein (Morph-Targets
     press_top / press_front / press_back / press_left / press_right) mit Feder.
   - Gestapelte Karten (Mobile), Header-Blur, Scroll-Reveal
   Performance: nur transform/opacity im DOM, DPR-Deckel 1.75 mit Auto-Absenkung,
   Rendern pausiert, wenn das Squishy nicht im Bild ist.
   ========================================================================== */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = matchMedia('(min-width: 1080px)');

/* JS-Gate (siehe <head>): melden, dass app.js läuft. Hat der 3-s-Fallback .js schon
   entfernt (app.js kam zu spät), bleibt die statische Fassung: kein Intro, keine Reveals. */
const root = document.documentElement;
const lateStart = !root.classList.contains('js');
root.classList.add('app-ready');

/* ---------------- Intro ---------------- */
function runIntro() {
  const el = $('[data-intro]');
  if (!el) return Promise.resolve();
  if (lateStart) { el.remove(); return Promise.resolve(); }
  let seen = false;
  try { seen = sessionStorage.getItem('aras-intro') === '1'; sessionStorage.setItem('aras-intro', '1'); } catch (_) {}
  if (seen || reduceMotion) { el.remove(); return Promise.resolve(); }
  return new Promise((resolve) => {
    setTimeout(() => {
      el.classList.add('is-done');
      resolve();
      setTimeout(() => el.remove(), 750);
    }, 1250);
  });
}

/* ---------------- Reveal ---------------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
$$('.reveal').forEach((el) => io.observe(el));

const yearEl = $('[data-year]');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------------- DOM-Loop (Header, Kartenstapel) ---------------- */
const header = $('[data-header]');
const cards = $$('[data-card]');
const cardScale = cards.map(() => 1);

function scrollTop() { return Math.max(window.scrollY || 0, document.body.scrollTop || 0); }

function updateDom() {
  if (header) header.classList.toggle('is-scrolled', scrollTop() > 8);
  if (isDesktop.matches) return;
  // Karte i wird kleiner, sobald Karte i+1 sie überdeckt
  for (let i = 0; i < cards.length - 1; i++) {
    const a = cards[i].getBoundingClientRect();
    const b = cards[i + 1].getBoundingClientRect();
    const p = Math.min(Math.max(1 - (b.top - a.top) / a.height, 0), 1);
    const s = 1 - p * 0.07;
    if (Math.abs(s - cardScale[i]) > 0.0005) {
      cardScale[i] = s;
      cards[i].style.transform = `scale(${s.toFixed(4)})`;
    }
  }
}

/* ---------------- 3D-Bühne ---------------- */
const canvas = $('[data-stage]');
const anchors = { hero: $('[data-anchor="hero"]'), squishy: $('[data-anchor="squishy"]') };
const blob = $('[data-blob]');
const pctEl = $('[data-pct]');
const hint = $('[data-hint]');
const countEl = $('[data-count]');

const TARGETS = ['press_top', 'press_front', 'press_back', 'press_left', 'press_right'];
const state = {
  ready: false,
  dropping: false,
  dropY: 0, dropV: 0,
  pos: new THREE.Vector3(0, 0, 0),
  scale: 1,
  placed: false,
  springs: TARGETS.map(() => ({ x: 0, v: 0 })),
  squash: { x: 0, v: 0 },            // globale Stauchung (Y runter, XZ raus)
  tilt: new THREE.Vector2(0, 0),
  tiltTarget: new THREE.Vector2(0, 0),
  count: 0,
  activeAnchor: 'hero',
  lastDist: 0,
};

let renderer, scene, camera, pivot, morphMeshes = [], modelSize = 2.6, raycaster, pointer;
let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
const frameTimes = [];

function initStage() {
  if (!canvas) return Promise.reject(new Error('no canvas'));
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: dpr < 2, powerPreference: 'high-performance' });
  } catch (e) { return Promise.reject(e); }
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xfff0d4, 2.4); key.position.set(3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff3b2a, 3.2); rim.position.set(-5, 1.5, -4); scene.add(rim); // ARAS-Rot als Kantenlicht
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x1a0f05, 0.6));

  pivot = new THREE.Group();
  scene.add(pivot);
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  resize();
  new ResizeObserver(resize).observe(canvas);

  const url = canvas.dataset.glb;
  return new Promise((resolve, reject) => {
    loadModel(url, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);          // Mittelpunkt in den Ursprung
      modelSize = Math.max(size.x, size.y);
      pivot.add(model);

      model.traverse((o) => {
        if (!o.isMesh) return;
        o.frustumCulled = false;            // Morphs verschieben die Bounds
        if (o.morphTargetInfluences) morphMeshes.push(o);
        const m = o.material;
        if (m && m.name === 'Smooth golden gel envelope') {
          // Gel-Hülle: Klarlack für den nassen Glanz
          const gel = new THREE.MeshPhysicalMaterial({
            color: m.color, roughness: 0.12, metalness: 0.1,
            transparent: true, opacity: Math.max(m.opacity, 0.32), depthWrite: false,
            clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.4,
          });
          gel.name = m.name;
          o.material = gel;
          o.renderOrder = 2;
        }
        if (m && m.name === 'Gold glitter') m.envMapIntensity = 1.8;
      });
      resolve();
    }, (ev) => {
      if (pctEl && ev.total) pctEl.textContent = `Lädt ${Math.round((ev.loaded / ev.total) * 100)} %`;
    }, reject);
  });
}

/* Lädt .glb normal. Nur für Hosts, die keine .glb ausliefern (z. B. die
   Design-System-Vorschau): ".b64.txt" = dieselbe Datei als Base64-Text. */
function loadModel(url, onLoad, onProgress, onError) {
  const loader = new GLTFLoader();
  if (!url.endsWith('.b64.txt')) return loader.load(url, onLoad, onProgress, onError);
  fetch(url).then((r) => r.text()).then((txt) => {
    const s = atob(txt.trim());
    const bytes = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    loader.parse(bytes.buffer, '', onLoad, onError);
  }).catch(onError);
}

function resize() {
  if (!renderer) return;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* Pixel → Welt (Ebene z = 0) */
function anchorToWorld(rect, out) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  const ppu = h / visH;
  out.x = (rect.left + rect.width / 2 - w / 2) / ppu;
  out.y = -(rect.top + rect.height / 2 - h / 2) / ppu;
  const sizePx = Math.min(rect.width, rect.height);
  return (sizePx * 0.86) / (modelSize * ppu);
}

function pickAnchor() {
  const h = canvas.clientHeight;
  const s = anchors.squishy && anchors.squishy.getBoundingClientRect();
  if (s && s.top < h * 0.82 && s.bottom > h * 0.12) return 'squishy';
  return 'hero';
}

function impulse(i, strength = 1) {
  const sp = state.springs[i];
  sp.v += (reduceMotion ? 5 : 13) * strength;
  state.squash.v += (reduceMotion ? 1.5 : 4) * strength;
}

function onTap(e) {
  if (!state.ready || !pivot) return;
  const r = canvas.getBoundingClientRect();
  pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  // schneller Vorabtest gegen eine Kugel
  const sphere = new THREE.Sphere(pivot.position, (modelSize / 2) * state.scale * 1.05);
  if (!raycaster.ray.intersectsSphere(sphere)) return;
  const hit = raycaster.intersectObject(pivot, true)[0];
  if (!hit) return;

  const p = pivot.worldToLocal(hit.point.clone()).divideScalar(modelSize / 2);
  // Welche Seite wurde getroffen?
  const scores = [p.y * 1.15 - 0.15, p.z, -p.z, -p.x, p.x];
  let best = 0;
  for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
  impulse(best, 1);

  state.tiltTarget.set(-pointer.y * 0.25, pointer.x * 0.35);
  state.count += 1;
  if (countEl) countEl.textContent = '×' + String(state.count).padStart(2, '0');
  if (hint) hint.classList.add('is-hidden');
  if (navigator.vibrate) { try { navigator.vibrate(8); } catch (_) {} }
}

function onMove(e) {
  if (e.pointerType !== 'mouse') return;
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = (e.clientY / window.innerHeight) * 2 - 1;
  state.tiltTarget.set(y * 0.18, x * 0.4);
}

const tmp = new THREE.Vector3();
let rendering = true;

function updateStage(dt, t) {
  if (!state.ready) return;

  // 1) Anker folgen (gedämpft) → Flug Hero ↔ DeSquishy-Karte
  const name = pickAnchor();
  if (name !== state.activeAnchor) state.activeAnchor = name;
  const el = anchors[state.activeAnchor] || anchors.hero;
  const targetScale = anchorToWorld(el.getBoundingClientRect(), tmp);
  tmp.z = 0;
  if (!state.placed) { state.pos.copy(tmp); state.scale = targetScale; state.placed = true; }
  const k = 1 - Math.exp(-dt * (reduceMotion ? 30 : 9));
  const prevX = state.pos.x;
  state.pos.lerp(tmp, k);
  state.scale += (targetScale - state.scale) * k;
  const dist = state.pos.distanceTo(tmp);
  if (state.lastDist > 1.2 && dist < 0.15) impulse(0, 0.9);   // Landung nach Flug → Plopp
  state.lastDist = dist;

  // 2) Fall beim ersten Auftritt
  if (state.dropping) {
    state.dropV -= 34 * dt;
    state.dropY += state.dropV * dt;
    if (state.dropY <= 0) {
      state.dropY = 0;
      if (state.dropV < -3) impulse(0, 1.5);
      state.dropV = -state.dropV * 0.22;
      if (Math.abs(state.dropV) < 1.2) { state.dropV = 0; state.dropping = false; }
    }
  }

  // 3) Federn: normal unterdämpft (Jelly), bei „Weniger Bewegung“ kritisch gedämpft (kein Nachschwingen)
  const K = 230, C = reduceMotion ? 2 * Math.sqrt(K) : 11;
  for (const sp of state.springs) {
    sp.v += (-K * sp.x - C * sp.v) * dt;
    sp.x += sp.v * dt;
    sp.x = Math.min(Math.max(sp.x, -0.45), 1.15);
  }
  const sq = state.squash;
  sq.v += (-170 * sq.x - (reduceMotion ? 2 * Math.sqrt(170) : 9) * sq.v) * dt;
  sq.x += sq.v * dt;

  const breath = reduceMotion ? 0 : (Math.sin(t * 2.1) * 0.5 + 0.5) * 0.05;
  for (const m of morphMeshes) {
    const dict = m.morphTargetDictionary || {};
    TARGETS.forEach((n, i) => {
      const idx = dict[n] ?? i;
      m.morphTargetInfluences[idx] = state.springs[i].x + (i === 0 ? breath : 0);
    });
  }

  // 4) Transform
  state.tilt.lerp(state.tiltTarget, 1 - Math.exp(-dt * 4));
  state.tiltTarget.multiplyScalar(Math.exp(-dt * 0.6));
  const sway = reduceMotion ? 0 : Math.sin(t * 0.45) * 0.32;
  const bob = reduceMotion ? 0 : Math.sin(t * 1.5) * 0.035;
  const vx = (state.pos.x - prevX) / Math.max(dt, 0.001);
  pivot.position.set(state.pos.x, state.pos.y + (bob + state.dropY) * state.scale, 0);
  pivot.rotation.set(0.12 + state.tilt.x, sway + state.tilt.y, THREE.MathUtils.clamp(-vx * 0.04, -0.4, 0.4));
  const s = state.scale;
  const sqz = THREE.MathUtils.clamp(sq.x * 0.12, -0.12, 0.18);
  pivot.scale.set(s * (1 + sqz * 0.6), s * (1 - sqz), s * (1 + sqz * 0.6));

  // 5) Nur rendern, wenn sichtbar
  const halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const onScreen = Math.abs(pivot.position.y) < halfH + modelSize * s && Math.abs(pivot.position.x) < halfH * camera.aspect + modelSize * s;
  if (onScreen) { renderer.render(scene, camera); rendering = true; }
  else if (rendering) { renderer.clear(); rendering = false; }

  // 6) Adaptive Qualität
  frameTimes.push(dt);
  if (frameTimes.length > 90) {
    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    frameTimes.length = 0;
    if (avg > 0.024 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); renderer.setPixelRatio(dpr); resize(); }
  }
}

/* ---------------- Loop ---------------- */
let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 1 / 20);
  last = now;
  updateDom();
  updateStage(dt, now / 1000);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------------- Start ---------------- */
const introDone = runIntro().then(() => document.body.classList.add('is-loaded'));
const stageReady = initStage();

Promise.all([introDone, stageReady]).then(() => {
  state.ready = true;
  state.dropping = !reduceMotion;
  state.dropY = reduceMotion ? 0 : 3.2;
  canvas.classList.add('is-ready');
  if (blob) blob.classList.add('is-gone');
  if (pctEl) pctEl.remove();
  document.addEventListener('pointerdown', onTap, { passive: true });
  window.addEventListener('pointermove', onMove, { passive: true });
}).catch((err) => {
  // Kein WebGL / Modell fehlt → der CSS-Blob bleibt als Squishy stehen
  console.warn('[aras] 3D deaktiviert:', err);
  if (pctEl) pctEl.remove();
  if (hint) hint.classList.add('is-hidden');
  if (blob) blob.addEventListener('pointerdown', () => {
    blob.animate([{ transform: 'scale(1.2,0.75)' }, { transform: 'scale(0.92,1.1)' }, { transform: 'scale(1)' }], { duration: 500, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
  });
});
