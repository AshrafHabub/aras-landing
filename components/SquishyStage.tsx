"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { Group, Material, Mesh, PerspectiveCamera, Scene, Texture, WebGLRenderer } from "three";
import { asset } from "@/lib/asset";
import { TINTS, type TintId } from "@/lib/tints";

const TARGETS = ["press_top", "press_front", "press_back", "press_left", "press_right"] as const;
const GLB = asset("/assets/squishy.glb");
const TINT_KEY = "aras-tint";
const BODY_MATERIALS = ["Continuous golden rear wall", "Smooth golden gel envelope", "Gold glitter", "Gold beads"];
const GOLD_HUE = 0.075;

type BootWindow = Window & { __arasBoot?: number; __arasLate?: number };

export function SquishyStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const w = window as BootWindow;
    const root = document.documentElement;
    if (w.__arasLate) {
      root.classList.remove("js");
      document.getElementById("aras-js-gate")?.remove();
    } else {
      root.classList.add("js");
      if (!document.getElementById("aras-js-gate")) {
        const style = document.createElement("style");
        style.id = "aras-js-gate";
        style.textContent =
          ".hero__title .line>span{transform:translateY(105%)}.rise{opacity:0}.reveal{opacity:0}";
        document.head.appendChild(style);
      }
    }
    root.classList.add("app-ready");
  }, []);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const canvas: HTMLCanvasElement = node;

    const w = window as BootWindow;
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = matchMedia("(min-width: 1080px)");
    const lateStart = w.__arasLate === 1 || !root.classList.contains("js");

    let dead = false;
    let raf = 0;
    const cleanups: Array<() => void> = [];

    const $ = <T extends Element>(sel: string) => document.querySelector<T>(sel);
    const intro = $("[data-intro]");
    let introFinished = false;
    let introRemoveTimer = 0;

    if (lateStart || reduceMotion) {
      intro?.remove();
      introFinished = true;
      document.body.classList.add("is-loaded");
    } else {
      let seen = false;
      try {
        seen = sessionStorage.getItem("aras-intro") === "1";
      } catch {
        seen = false;
      }
      if (seen || !intro) {
        intro?.remove();
        introFinished = true;
        document.body.classList.add("is-loaded");
      } else {
        try {
          sessionStorage.setItem("aras-intro", "1");
        } catch {
          /* ignore */
        }
        const doneTimer = window.setTimeout(() => {
          introFinished = true;
          intro.classList.add("is-done");
          document.body.classList.add("is-loaded");
          introRemoveTimer = window.setTimeout(() => intro.remove(), 750);
        }, 1250);
        cleanups.push(() => {
          window.clearTimeout(doneTimer);
          window.clearTimeout(introRemoveTimer);
          if (!introFinished) {
            try {
              sessionStorage.removeItem("aras-intro");
            } catch {
              /* ignore */
            }
          }
        });
      }
    }

    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    reveals.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    const header = $("[data-header]");
    const cards = [...document.querySelectorAll<HTMLElement>("[data-card]")];
    const cardScale = cards.map(() => 1);

    const anchors = {
      hero: document.querySelector<HTMLElement>('[data-anchor="hero"]'),
      squishy: document.querySelector<HTMLElement>('[data-anchor="squishy"]'),
    };
    const blob = document.querySelector<HTMLElement>("[data-blob]");
    const pctEl = document.querySelector<HTMLElement>("[data-pct]");
    const hint = document.querySelector<HTMLElement>("[data-hint]");
    const countEl = document.querySelector<HTMLElement>("[data-count]");
    const resetBtn = document.querySelector<HTMLButtonElement>("[data-reset]");

    const mouse = { x: 0, y: 0, seen: false };
    const pose = {
      follow: true,
      dirty: false,
      gesture: false,
      knead: false,
      button: -1,
      blockMenu: false,
      dragging: false,
      side: 0,
      pointerId: -1,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      latched: [0, 0, 0, 0, 0],
    };
    const spin = { yaw: 0, pitch: 0 };

    const state = {
      ready: false,
      dropping: false,
      dropY: 0,
      dropV: 0,
      scale: 1,
      placed: false,
      springs: TARGETS.map(() => ({ x: 0, v: 0 })),
      squash: { x: 0, v: 0 },
      count: 0,
      activeAnchor: "hero" as "hero" | "squishy",
      lastDist: 0,
    };

    let renderer: WebGLRenderer | null = null;
    let scene: Scene | null = null;
    let camera: PerspectiveCamera | null = null;
    let pivot: Group | null = null;
    let envMap: Texture | null = null;
    const morphMeshes: Mesh[] = [];
    type Tintable = {
      material: Material & { color: import("three").Color; vertexColors: boolean };
      base: import("three").Color;
      target: import("three").Color;
      glitter: boolean;
    };
    const tintables: Tintable[] = [];
    let tint: TintId = "gold";
    try {
      const saved = localStorage.getItem(TINT_KEY);
      if (TINTS.some((t) => t.id === saved)) tint = saved as TintId;
    } catch {
      /* private mode */
    }
    let modelSize = 2.6;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const frameTimes: number[] = [];
    let rendering = true;
    let last = performance.now();

    const held: {
      THREE: typeof import("three") | null;
      pos: import("three").Vector3 | null;
      tmp: import("three").Vector3 | null;
      raycaster: import("three").Raycaster | null;
      pointer: import("three").Vector2 | null;
      lookPoint: import("three").Vector3 | null;
      lookDir: import("three").Vector3 | null;
      faceAxis: import("three").Vector3 | null;
      lookQuat: import("three").Quaternion | null;
      aimQuat: import("three").Quaternion | null;
      pitchQuat: import("three").Quaternion | null;
      userQuat: import("three").Quaternion | null;
      axisX: import("three").Vector3 | null;
      axisY: import("three").Vector3 | null;
    } = {
      THREE: null,
      pos: null,
      tmp: null,
      raycaster: null,
      pointer: null,
      lookPoint: null,
      lookDir: null,
      faceAxis: null,
      lookQuat: null,
      aimQuat: null,
      pitchQuat: null,
      userQuat: null,
      axisX: null,
      axisY: null,
    };

    function scrollTop() {
      return Math.max(window.scrollY || 0, document.body.scrollTop || 0);
    }

    function updateDom() {
      header?.classList.toggle("is-scrolled", scrollTop() > 8);
      if (isDesktop.matches) return;
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

    function resize() {
      if (!renderer || !camera) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function anchorToWorld(rect: DOMRect, out: import("three").Vector3) {
      const THREE = held.THREE;
      if (!THREE || !camera) return 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const ppu = height / visH;
      out.x = (rect.left + rect.width / 2 - width / 2) / ppu;
      out.y = -(rect.top + rect.height / 2 - height / 2) / ppu;
      const sizePx = Math.min(rect.width, rect.height);
      return (sizePx * 0.86) / (modelSize * ppu);
    }

    function pickAnchor() {
      const height = canvas.clientHeight;
      const slot = anchors.squishy?.getBoundingClientRect();
      if (slot && slot.top < height * 0.82 && slot.bottom > height * 0.12) return "squishy" as const;
      return "hero" as const;
    }

    function impulse(index: number, strength = 1) {
      const spring = state.springs[index];
      spring.v += (reduceMotion ? 5 : 13) * strength;
      state.squash.v += (reduceMotion ? 1.5 : 4) * strength;
    }

    function setResetVisible(on: boolean) {
      if (!resetBtn) return;
      resetBtn.classList.toggle("is-on", on);
      resetBtn.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) resetBtn.removeAttribute("tabindex");
      else resetBtn.tabIndex = -1;
    }

    function markDirty() {
      if (pose.dirty) return;
      pose.dirty = true;
      setResetVisible(true);
    }

    function pointerNdc(event: MouseEvent, out: import("three").Vector2) {
      const rect = canvas.getBoundingClientRect();
      out.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
    }

    function squishHit(event: MouseEvent) {
      const { THREE, raycaster, pointer } = held;
      if (!state.ready || !pivot || !THREE || !raycaster || !pointer || !camera) return null;
      pointerNdc(event, pointer);
      raycaster.setFromCamera(pointer, camera);
      const sphere = new THREE.Sphere(pivot.position, (modelSize / 2) * state.scale * 1.05);
      if (!raycaster.ray.intersectsSphere(sphere)) return null;
      return raycaster.intersectObject(pivot, true)[0] ?? null;
    }

    function sideOf(hit: import("three").Intersection) {
      if (!pivot) return 0;
      const point = pivot.worldToLocal(hit.point.clone()).divideScalar(modelSize / 2);
      const scores = [point.y * 1.15 - 0.15, point.z, -point.z, -point.x, point.x];
      let best = 0;
      for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
      return best;
    }

    function tintTargets(id: TintId) {
      const spec = TINTS.find((t) => t.id === id) ?? TINTS[0];
      const hsl = { h: 0, s: 0, l: 0 };
      const beads = tintables.find((t) => t.material.name === "Gold beads");
      for (const item of tintables) {
        const source = item.glitter && beads ? beads.base : item.base;
        if (spec.hue === null) {
          item.target.copy(item.glitter ? item.base : source);
          continue;
        }
        source.getHSL(hsl);
        const hue = (((spec.hue + hsl.h - GOLD_HUE) % 1) + 1) % 1;
        item.target.setHSL(hue, Math.min(hsl.s * spec.sat, 1), Math.min(hsl.l * spec.light * (item.glitter ? 1.2 : 1), 0.95));
      }
    }

    function applyTint(id: TintId, instant = false) {
      tint = id;
      tintTargets(id);
      for (const item of tintables) {
        if (!item.glitter) continue;
        const useVertex = id === "gold";
        if (item.material.vertexColors !== useVertex) {
          item.material.vertexColors = useVertex;
          item.material.needsUpdate = true;
        }
        item.material.color.copy(item.target);
      }
      if (instant || reduceMotion) for (const item of tintables) item.material.color.copy(item.target);
      document.querySelectorAll<HTMLInputElement>('input[name="tint"]').forEach((input) => {
        input.checked = input.value === id;
      });
    }

    function onTintChange(event: Event) {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.name !== "tint") return;
      const id = input.value as TintId;
      if (!TINTS.some((t) => t.id === id)) return;
      try {
        localStorage.setItem(TINT_KEY, id);
      } catch {
        /* private mode */
      }
      applyTint(id);
      impulse(0, 0.6);
    }

    function resetPose() {
      pose.follow = true;
      pose.dirty = false;
      pose.gesture = false;
      pose.knead = false;
      pose.button = -1;
      pose.dragging = false;
      pose.pointerId = -1;
      pose.latched = [0, 0, 0, 0, 0];
      spin.yaw = 0;
      spin.pitch = 0;
      for (const spring of state.springs) {
        spring.x = 0;
        spring.v = 0;
      }
      state.squash.x = 0;
      state.squash.v = 0;
      if (held.aimQuat && pivot) held.aimQuat.copy(pivot.quaternion);
      held.userQuat?.identity();
      setResetVisible(false);
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0 && event.button !== 2) return;
      if (pose.gesture) return;
      const target = event.target;
      if (target instanceof Element && target.closest("a, button, input, label, textarea, select")) return;
      const hit = squishHit(event);
      if (!hit) return;
      pose.gesture = true;
      pose.knead = event.button === 0;
      pose.button = event.button;
      pose.dragging = false;
      pose.pointerId = event.pointerId;
      pose.lastX = event.clientX;
      pose.lastY = event.clientY;
      pose.lastT = performance.now();
      pose.side = sideOf(hit);
      spin.yaw = 0;
      spin.pitch = 0;
      if (pose.follow && held.userQuat && pivot) {
        held.userQuat.copy(pivot.quaternion);
        pose.follow = false;
        markDirty();
      }
      if (!pose.knead) return;
      pose.latched[pose.side] = Math.min(1.15, pose.latched[pose.side] + (reduceMotion ? 0.22 : 0.16));
      markDirty();
      state.count += 1;
      if (countEl) countEl.textContent = "×" + String(state.count).padStart(2, "0");
      if (navigator.vibrate) {
        try {
          navigator.vibrate(8);
        } catch {
          /* ignore */
        }
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "mouse" && held.pointer) {
        pointerNdc(event, held.pointer);
        mouse.x = held.pointer.x;
        mouse.y = held.pointer.y;
        mouse.seen = true;
      }
      if (!pose.gesture || event.pointerId !== pose.pointerId || !pivot) return;
      const dx = event.clientX - pose.lastX;
      const dy = event.clientY - pose.lastY;
      if (!pose.dragging && Math.hypot(dx, dy) < 6) return;
      const { THREE, userQuat, axisX, axisY } = held;
      if (!THREE || !userQuat || !axisX || !axisY) return;
      if (pose.follow) {
        pose.follow = false;
        userQuat.copy(pivot.quaternion);
      }
      pose.dragging = true;
      markDirty();
      const now = performance.now();
      const stepDt = Math.min(Math.max((now - pose.lastT) / 1000, 1 / 120), 0.05);
      pose.lastT = now;
      const gain = pose.button === 2 ? 0.004 : 0.012;
      const yawStep = dx * gain;
      const pitchStep = dy * gain;
      const yawQuat = held.lookQuat;
      const pitchQuat = held.pitchQuat;
      if (yawQuat && pitchQuat) {
        yawQuat.setFromAxisAngle(axisY, yawStep);
        pitchQuat.setFromAxisAngle(axisX, pitchStep);
        userQuat.premultiply(yawQuat).premultiply(pitchQuat).normalize();
      }
      if (!reduceMotion) {
        const blend = 1 - Math.exp(-stepDt * 16);
        const yawRate = THREE.MathUtils.clamp(yawStep / stepDt, -7, 7);
        const pitchRate = THREE.MathUtils.clamp(pitchStep / stepDt, -7, 7);
        spin.yaw += (yawRate - spin.yaw) * blend;
        spin.pitch += (pitchRate - spin.pitch) * blend;
      }
      pose.lastX = event.clientX;
      pose.lastY = event.clientY;
      event.preventDefault();
    }

    function onPointerUp(event: PointerEvent) {
      if (event.pointerId !== pose.pointerId) return;
      if (event.type !== "pointercancel" && event.button !== pose.button) return;
      if (pose.button === 2) {
        pose.blockMenu = true;
        requestAnimationFrame(() => {
          pose.blockMenu = false;
        });
      }
      if (!pose.dragging || reduceMotion) {
        spin.yaw = 0;
        spin.pitch = 0;
      }
      pose.gesture = false;
      pose.knead = false;
      pose.button = -1;
      pose.dragging = false;
      pose.pointerId = -1;
    }

    function coast(dt: number) {
      if (pose.follow || pose.gesture || reduceMotion) return;
      const { THREE, userQuat, axisX, axisY, lookQuat, pitchQuat } = held;
      if (!THREE || !userQuat || !axisX || !axisY || !lookQuat || !pitchQuat) return;
      if (Math.hypot(spin.yaw, spin.pitch) < 0.05) {
        spin.yaw = 0;
        spin.pitch = 0;
        return;
      }
      lookQuat.setFromAxisAngle(axisY, spin.yaw * dt);
      pitchQuat.setFromAxisAngle(axisX, spin.pitch * dt);
      userQuat.premultiply(lookQuat).premultiply(pitchQuat).normalize();
      const damp = Math.exp(-dt * 2.4);
      spin.yaw *= damp;
      spin.pitch *= damp;
    }

    function onContextMenu(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("a, button, input, textarea, select")) return;
      if (pose.blockMenu || pose.button === 2 || squishHit(event)) event.preventDefault();
    }

    function aimFace(dt: number) {
      const { THREE, lookQuat, aimQuat, pitchQuat, axisX, axisY } = held;
      if (!THREE || !lookQuat || !aimQuat || !pitchQuat || !axisX || !axisY) return;
      if (!mouse.seen) {
        lookQuat.identity();
      } else {
        const yaw = THREE.MathUtils.clamp(mouse.x, -1, 1) * 0.58;
        const pitch = -THREE.MathUtils.clamp(mouse.y, -1, 1) * 0.36;
        lookQuat.setFromAxisAngle(axisY, yaw);
        pitchQuat.setFromAxisAngle(axisX, pitch);
        lookQuat.multiply(pitchQuat);
      }
      const blend = reduceMotion ? 1 : 1 - Math.exp(-dt * 6);
      aimQuat.slerp(lookQuat, blend);
    }

    function updateStage(dt: number, t: number) {
      const { THREE, pos, tmp } = held;
      if (!state.ready || !THREE || !pos || !tmp || !pivot || !camera || !renderer || !scene) {
        return;
      }

      const name = pickAnchor();
      if (name !== state.activeAnchor) state.activeAnchor = name;
      const el = anchors[state.activeAnchor] || anchors.hero;
      if (!el) return;
      const targetScale = anchorToWorld(el.getBoundingClientRect(), tmp);
      tmp.z = 0;
      if (!state.placed) {
        pos.copy(tmp);
        state.scale = targetScale;
        state.placed = true;
      }
      const k = 1 - Math.exp(-dt * (reduceMotion ? 30 : 9));
      pos.lerp(tmp, k);
      state.scale += (targetScale - state.scale) * k;
      const dist = pos.distanceTo(tmp);
      if (state.lastDist > 1.2 && dist < 0.15) impulse(0, 0.9);
      state.lastDist = dist;

      if (state.dropping) {
        state.dropV -= 34 * dt;
        state.dropY += state.dropV * dt;
        if (state.dropY <= 0) {
          state.dropY = 0;
          if (state.dropV < -3) impulse(0, 1.5);
          state.dropV = -state.dropV * 0.22;
          if (Math.abs(state.dropV) < 1.2) {
            state.dropV = 0;
            state.dropping = false;
          }
        }
      }

      const springK = 230;
      const springC = reduceMotion ? 2 * Math.sqrt(springK) : 11;
      for (const spring of state.springs) {
        spring.v += (-springK * spring.x - springC * spring.v) * dt;
        spring.x += spring.v * dt;
        spring.x = Math.min(Math.max(spring.x, -0.45), 1.15);
      }
      const squash = state.squash;
      squash.v += (-170 * squash.x - (reduceMotion ? 2 * Math.sqrt(170) : 9) * squash.v) * dt;
      squash.x += squash.v * dt;

      if (pose.knead) {
        pose.latched[pose.side] = Math.min(1.15, pose.latched[pose.side] + dt * (reduceMotion ? 0.45 : 0.72));
      }

      const breath =
        reduceMotion || pose.latched[0] > 0.02 || pose.knead ? 0 : (Math.sin(t * 2.1) * 0.5 + 0.5) * 0.05;
      for (const mesh of morphMeshes) {
        const dict = mesh.morphTargetDictionary || {};
        const influences = mesh.morphTargetInfluences;
        if (!influences) continue;
        TARGETS.forEach((target, index) => {
          const idx = dict[target] ?? index;
          influences[idx] = THREE.MathUtils.clamp(
            pose.latched[index] + state.springs[index].x + (index === 0 ? breath : 0),
            -0.45,
            1.15,
          );
        });
      }

      const tintBlend = 1 - Math.exp(-dt * 12);
      for (const item of tintables) {
        if (!item.glitter) item.material.color.lerp(item.target, tintBlend);
      }

      const bob = reduceMotion || !pose.follow ? 0 : Math.sin(t * 1.5) * 0.035;
      pivot.position.set(pos.x, pos.y + (bob + state.dropY) * state.scale, 0);
      if (pose.follow) {
        aimFace(dt);
        if (held.aimQuat) pivot.quaternion.copy(held.aimQuat);
      } else if (held.userQuat) {
        coast(dt);
        pivot.quaternion.copy(held.userQuat);
      }
      const squashAmount = THREE.MathUtils.clamp(squash.x * 0.12, -0.12, 0.18);
      const s = state.scale;
      pivot.scale.set(s * (1 + squashAmount * 0.6), s * (1 - squashAmount), s * (1 + squashAmount * 0.6));

      const halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const onScreen =
        Math.abs(pivot.position.y) < halfH + modelSize * s &&
        Math.abs(pivot.position.x) < halfH * camera.aspect + modelSize * s;
      if (onScreen) {
        renderer.render(scene, camera);
        rendering = true;
      } else if (rendering) {
        renderer.clear();
        rendering = false;
      }

      frameTimes.push(dt);
      if (frameTimes.length > 90) {
        const avg = frameTimes.reduce((sum, value) => sum + value, 0) / frameTimes.length;
        frameTimes.length = 0;
        if (avg > 0.024 && dpr > 1) {
          dpr = Math.max(1, dpr - 0.25);
          renderer.setPixelRatio(dpr);
          resize();
        }
      }
    }

    const loop = (now: number) => {
      if (dead) return;
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      updateDom();
      updateStage(dt, now / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const bootStage = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (dead) return;

      held.THREE = THREE;
      held.pos = new THREE.Vector3();
      held.tmp = new THREE.Vector3();
      held.raycaster = new THREE.Raycaster();
      held.pointer = new THREE.Vector2();
      held.lookPoint = new THREE.Vector3();
      held.lookDir = new THREE.Vector3();
      held.faceAxis = new THREE.Vector3(0, 0, 1);
      held.lookQuat = new THREE.Quaternion();
      held.aimQuat = new THREE.Quaternion();
      held.pitchQuat = new THREE.Quaternion();
      held.userQuat = new THREE.Quaternion();
      held.axisX = new THREE.Vector3(1, 0, 0);
      held.axisY = new THREE.Vector3(0, 1, 0);

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: dpr < 2,
          powerPreference: "high-performance",
        });
      } catch (error) {
        throw error;
      }
      if (dead) {
        renderer.dispose();
        renderer = null;
        return;
      }

      renderer.setPixelRatio(dpr);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setClearColor(0x000000, 0);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const pmrem = new THREE.PMREMGenerator(renderer);
      envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envMap;
      pmrem.dispose();

      const key = new THREE.DirectionalLight(0xfff0d4, 2.4);
      key.position.set(3, 5, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xff3b2a, 3.2);
      rim.position.set(-5, 1.5, -4);
      scene.add(rim);
      scene.add(new THREE.HemisphereLight(0xfff6e8, 0x1a0f05, 0.6));

      pivot = new THREE.Group();
      scene.add(pivot);
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      cleanups.push(() => observer.disconnect());

      await new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          GLB,
          (gltf) => {
            if (dead || !pivot) {
              resolve();
              return;
            }
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            modelSize = Math.max(size.x, size.y);
            pivot.add(model);

            model.traverse((object) => {
              const mesh = object as Mesh;
              if (!mesh.isMesh) return;
              mesh.frustumCulled = false;
              if (mesh.morphTargetInfluences) morphMeshes.push(mesh);
              const material = mesh.material as Material & {
                color?: import("three").Color;
                opacity: number;
                envMapIntensity?: number;
              };
              if (Array.isArray(mesh.material)) return;
              if (material.name === "Smooth golden gel envelope" && material.color) {
                const gel = new THREE.MeshPhysicalMaterial({
                  color: material.color,
                  roughness: 0.12,
                  metalness: 0.1,
                  transparent: true,
                  opacity: Math.max(material.opacity, 0.32),
                  depthWrite: false,
                  clearcoat: 1,
                  clearcoatRoughness: 0.06,
                  envMapIntensity: 1.4,
                });
                gel.name = material.name;
                mesh.material = gel;
                mesh.renderOrder = 2;
              }
              if (material.name === "Gold glitter") material.envMapIntensity = 1.8;
              const finalMaterial = mesh.material as Tintable["material"];
              if (BODY_MATERIALS.includes(finalMaterial.name) && finalMaterial.color) {
                tintables.push({
                  material: finalMaterial,
                  base: finalMaterial.color.clone(),
                  target: finalMaterial.color.clone(),
                  glitter: finalMaterial.name === "Gold glitter",
                });
              }
            });
            applyTint(tint, true);
            resolve();
          },
          (event) => {
            if (pctEl && event.total) {
              pctEl.textContent = `Lädt ${Math.round((event.loaded / event.total) * 100)} %`;
            }
          },
          (error) => reject(error),
        );
      });

      if (dead) return;
      state.ready = true;
      state.dropping = !reduceMotion;
      state.dropY = reduceMotion ? 0 : 3.2;
      canvas.classList.add("is-ready");
      blob?.classList.add("is-gone");
      pctEl?.remove();
      const onReset = () => resetPose();
      resetBtn?.addEventListener("click", onReset);
      document.addEventListener("change", onTintChange);
      root.classList.add("tint-ready");
      document.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      window.addEventListener("contextmenu", onContextMenu);
      cleanups.push(() => {
        resetBtn?.removeEventListener("click", onReset);
        document.removeEventListener("change", onTintChange);
        root.classList.remove("tint-ready");
        document.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        window.removeEventListener("contextmenu", onContextMenu);
      });
    };

    bootStage().catch((error) => {
      if (dead) return;
      console.warn("[aras] 3D deaktiviert:", error);
      pctEl?.remove();
      hint?.classList.add("is-hidden");
      const onBlob = () => {
        blob?.animate(
          [{ transform: "scale(1.2, 0.75)" }, { transform: "scale(0.92, 1.1)" }, { transform: "scale(1)" }],
          { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
        );
      };
      blob?.addEventListener("pointerdown", onBlob);
      cleanups.push(() => blob?.removeEventListener("pointerdown", onBlob));
    });

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      scene?.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material?.dispose());
      });
      envMap?.dispose();
      if (scene) scene.environment = null;
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="stage" data-stage data-glb={GLB} aria-hidden="true" />;
}
