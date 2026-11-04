"use client";

import { useEffect, useRef } from "react";
import type { Color, Material } from "three";
import { asset } from "@/lib/asset";

const GLB = asset("/assets/squishy-mini.glb");
const TINTED = ["Continuous golden rear wall", "Smooth golden gel envelope", "Gold glitter", "Gold beads"];
const CYCLE_MS = 14000;

type Tinted = { material: Material & { color: Color; vertexColors: boolean }; h: number; s: number; l: number };

export function SquishyBadge() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dead = false;
    let raf = 0;
    let visible = false;
    let cleanup = () => {};

    const boot = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const { MeshoptDecoder } = await import("three/addons/libs/meshopt_decoder.module.js");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (dead) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 9);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envMap;
      pmrem.dispose();
      const key = new THREE.DirectionalLight(0xfff0d4, 2.4);
      key.position.set(3, 5, 5);
      scene.add(key, new THREE.HemisphereLight(0xfff6e8, 0x1a0f05, 0.6));

      const pivot = new THREE.Group();
      scene.add(pivot);
      const tinted: Tinted[] = [];
      const hsl = { h: 0, s: 0, l: 0 };

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(GLB);
      if (dead) {
        renderer.dispose();
        return;
      }

      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(box.getCenter(new THREE.Vector3()));
      pivot.scale.setScalar(3.4 / Math.max(size.x, size.y));
      pivot.add(model);

      let beads: Color | null = null;
      model.traverse((object) => {
        const mesh = object as import("three").Mesh;
        if (!mesh.isMesh || Array.isArray(mesh.material)) return;
        const material = mesh.material as Tinted["material"] & { opacity: number };
        if (material.name === "Smooth golden gel envelope") {
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
        const final = mesh.material as Tinted["material"];
        if (final.name === "Gold beads") beads = final.color;
        if (TINTED.includes(final.name)) {
          final.color.getHSL(hsl);
          tinted.push({ material: final, ...hsl });
        }
      });

      for (const item of tinted) {
        if (item.material.name !== "Gold glitter") continue;
        item.material.vertexColors = false;
        item.material.needsUpdate = true;
        if (beads) {
          (beads as Color).getHSL(hsl);
          Object.assign(item, { h: hsl.h, s: hsl.s, l: Math.min(hsl.l * 1.2, 0.95) });
        }
      }

      const start = performance.now();
      const frame = (now: number) => {
        const t = (now - start) / 1000;
        const shift = ((now - start) % CYCLE_MS) / CYCLE_MS;
        for (const item of tinted) item.material.color.setHSL((item.h + shift) % 1, Math.min(item.s * 0.85, 1), item.l);
        pivot.rotation.y = Math.sin(t * 0.6) * 0.45;
        pivot.rotation.x = Math.sin(t * 0.9) * 0.06;
        pivot.position.y = Math.sin(t * 1.4) * 0.06;
        renderer.render(scene, camera);
      };
      const loop = (now: number) => {
        frame(now);
        raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
      };
      const wake = () => {
        if (!raf && visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(loop);
      };

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        wake();
      });
      observer.observe(canvas);
      document.addEventListener("visibilitychange", wake);
      frame(start);
      canvas.classList.add("is-ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
        document.removeEventListener("visibilitychange", wake);
        envMap.dispose();
        renderer.dispose();
      };
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const handle = idle(() => {
      boot().catch(() => canvas.remove());
    });

    return () => {
      dead = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
      cleanup();
    };
  }, []);

  return <canvas ref={ref} className="squishy" aria-hidden="true" />;
}
