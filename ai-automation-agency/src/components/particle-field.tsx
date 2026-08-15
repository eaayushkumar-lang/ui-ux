import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { VIOLET, AMBER, mixBrand } from "@/lib/palette";

/**
 * One reusable section-scoped particle background, driven by a `formation`
 * prop so the three effects share a single renderer/scene/loop scaffold
 * instead of three copy-pasted Three.js setups:
 *
 *   "rings"   Hero    - a glowing core with tilted orbiting Points rings,
 *                       idle rotation; fades out as the section scrolls away.
 *   "spiral"  System  - a logarithmic-spiral galaxy disc that ASSEMBLES from
 *                       a scattered cloud, scrubbed by scroll; idle spin.
 *   "vortex"  Services- a ring of particles spiralling inward to a dark
 *                       centre and recycling to the edge; one-time play-in,
 *                       then self-looping.
 *
 * Shared across all three: BufferGeometry + Float32Array position buffers,
 * PointsMaterial with additive blending + transparency + depthWrite off,
 * low opacity (background role only - text stays readable), per-particle
 * violet->amber colour inside the brand palette.
 *
 * Degrades the same two ways as the rest of the site's motion:
 *   - prefers-reduced-motion -> each effect renders one static frame in its
 *     final formation, no rAF loop, no ScrollTrigger.
 *   - WebGL unavailable -> warn, render nothing, leave layout intact.
 */

export type Formation = "rings" | "spiral" | "vortex";

interface ParticleFieldProps {
  formation: Formation;
  className?: string;
}

// Per-formation particle budgets (roughly halved on mobile).
const COUNTS: Record<Formation, { desktop: number; mobile: number }> = {
  rings: { desktop: 2600, mobile: 1300 },
  spiral: { desktop: 5000, mobile: 2400 },
  vortex: { desktop: 3600, mobile: 1800 },
};

const CAMERA_Z: Record<Formation, number> = { rings: 24, spiral: 30, vortex: 22 };
const BASE_OPACITY = 0.6;

/** A formation's runtime contract: what to add to the scene, how to advance
 * it each frame, how to read it for tests, and how to tear it down. */
interface Strategy {
  object: THREE.Object3D;
  /** elapsed seconds since start; `progress` is the 0-1 scroll value the
   * formation cares about (assembly for spiral, fade for rings; vortex
   * ignores it and uses its own `started` flag). */
  update: (elapsed: number, dt: number, progress: number) => void;
  /** Snapshot the final resting formation (reduced-motion / WebGL-static). */
  rest: () => void;
  sample: () => number;
  dispose: () => void;
}

function particleCount(formation: Formation, width: number) {
  const c = COUNTS[formation];
  return width < 768 ? c.mobile : c.desktop;
}

/** Deterministic per-index pseudo-random in [0,1) - stable targets for a
 * given particle index, so assembly lerps have a fixed destination. */
function hash(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function makeMaterial(size: number, opacity = BASE_OPACITY) {
  return new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/** Sum of squared radial magnitude over a strided sample of a buffer - a
 * cheap, formation-distinctive checksum for the Playwright hook (all
 * formations centre on the origin, so a plain coordinate sum is ~0 for
 * every one and can't tell them apart; radial extent can). */
function checksum(buffers: Float32Array[]) {
  let sum = 0;
  for (const buf of buffers) {
    const stride = Math.max(1, Math.floor(buf.length / 3 / 64)) * 3;
    for (let k = 0; k < buf.length; k += stride) {
      sum += buf[k] ** 2 + buf[k + 1] ** 2 + buf[k + 2] ** 2;
    }
  }
  return sum;
}

// --- Formation 1: orbiting rings -----------------------------------------
function buildRings(count: number): Strategy {
  const group = new THREE.Group();
  group.rotation.x = 0.35; // slight 3/4 tilt so the rings read as orbits

  // Ring definitions: inner amber -> outer violet, each at its own radius,
  // fixed tilt, and spin speed/direction for a layered orbital feel.
  const rings = [
    { radius: 3.4, tiltX: 0.25, tiltZ: 0.15, speed: 0.28, color: AMBER, portion: 0.26 },
    { radius: 6.0, tiltX: -0.4, tiltZ: 0.1, speed: -0.17, color: mixBrand(new THREE.Color(), 0.5), portion: 0.34 },
    { radius: 8.6, tiltX: 0.18, tiltZ: -0.3, speed: 0.1, color: VIOLET, portion: 0.4 },
  ];

  const buffers: Float32Array[] = [];
  const materials: THREE.PointsMaterial[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const spinners: { node: THREE.Object3D; speed: number }[] = [];

  let assigned = 0;
  rings.forEach((ring, ri) => {
    const n = ri === rings.length - 1 ? count - assigned : Math.floor(count * ring.portion);
    assigned += n;

    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const scratch = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const theta = (i / n) * Math.PI * 2 + hash(i, ri) * 0.05;
      const r = ring.radius + (hash(i, ri + 10) - 0.5) * 0.5; // slight radial spread
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (hash(i, ri + 20) - 0.5) * 0.5; // thickness jitter
      positions[i * 3 + 2] = Math.sin(theta) * r;
      scratch.copy(ring.color).multiplyScalar(0.75 + hash(i, ri + 30) * 0.4);
      colors[i * 3] = scratch.r;
      colors[i * 3 + 1] = scratch.g;
      colors[i * 3 + 2] = scratch.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = makeMaterial(0.12);
    const points = new THREE.Points(geometry, material);

    // wrapper holds the fixed tilt; spinner rotates inside it.
    const wrapper = new THREE.Group();
    wrapper.rotation.set(ring.tiltX, 0, ring.tiltZ);
    const spinner = new THREE.Group();
    spinner.add(points);
    wrapper.add(spinner);
    group.add(wrapper);

    buffers.push(positions);
    materials.push(material);
    geometries.push(geometry);
    spinners.push({ node: spinner, speed: ring.speed });
  });

  // Core: a dense little cluster at centre. Overlapping additive points
  // read as a soft bloom without a postprocessing pass.
  const coreN = Math.max(30, Math.floor(count * 0.05));
  const corePos = new Float32Array(coreN * 3);
  const coreCol = new Float32Array(coreN * 3);
  const cscratch = new THREE.Color();
  for (let i = 0; i < coreN; i++) {
    const rr = Math.pow(hash(i, 99), 2) * 1.2;
    const t = hash(i, 98) * Math.PI * 2;
    const p = hash(i, 97) * Math.PI;
    corePos[i * 3] = rr * Math.sin(p) * Math.cos(t);
    corePos[i * 3 + 1] = rr * Math.cos(p);
    corePos[i * 3 + 2] = rr * Math.sin(p) * Math.sin(t);
    mixBrand(cscratch, hash(i, 96)); // core blends both hues
    cscratch.multiplyScalar(1.2);
    coreCol[i * 3] = cscratch.r;
    coreCol[i * 3 + 1] = cscratch.g;
    coreCol[i * 3 + 2] = cscratch.b;
  }
  const coreGeo = new THREE.BufferGeometry();
  coreGeo.setAttribute("position", new THREE.BufferAttribute(corePos, 3));
  coreGeo.setAttribute("color", new THREE.BufferAttribute(coreCol, 3));
  const coreMat = makeMaterial(0.32, 0.75);
  group.add(new THREE.Points(coreGeo, coreMat));
  buffers.push(corePos);
  materials.push(coreMat);
  geometries.push(coreGeo);

  return {
    object: group,
    update: (elapsed, _dt, progress) => {
      for (const s of spinners) s.node.rotation.y = elapsed * s.speed;
      // progress here is a 1->0 fade as the hero scrolls away (see wiring).
      for (const m of materials) m.opacity = (m === coreMat ? 0.75 : BASE_OPACITY) * progress;
    },
    rest: () => {
      for (const m of materials) m.opacity = m === coreMat ? 0.75 : BASE_OPACITY;
    },
    sample: () => checksum(buffers),
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

// --- Formation 2: galaxy / spiral disc ------------------------------------
function buildSpiral(count: number): Strategy {
  const group = new THREE.Group();
  group.rotation.x = -0.55; // view the disc at an angle

  const target = new Float32Array(count * 3);
  const scattered = new Float32Array(count * 3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const ARMS = 3;
  const MAX_RADIUS = 16;
  const scratch = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // Radius biased toward the centre (denser/brighter core).
    const rNorm = Math.pow(hash(i, 1), 1.7);
    const radius = rNorm * MAX_RADIUS + 0.4;
    const arm = i % ARMS;
    // Logarithmic spiral: angle grows with radius, offset per arm, plus a
    // radius-scaled scatter so arms are soft rather than razor lines.
    const spin = radius * 0.42;
    const armOffset = (arm / ARMS) * Math.PI * 2;
    const scatter = (hash(i, 2) - 0.5) * (0.6 + rNorm * 0.9);
    const angle = spin + armOffset + scatter;
    const thickness = (hash(i, 3) - 0.5) * (1.6 - rNorm) * 1.4; // thinner at rim

    target[i * 3] = Math.cos(angle) * radius;
    target[i * 3 + 1] = thickness;
    target[i * 3 + 2] = Math.sin(angle) * radius;

    // Scattered start: a loose cloud the disc condenses out of.
    scattered[i * 3] = (hash(i, 4) - 0.5) * 46;
    scattered[i * 3 + 1] = (hash(i, 5) - 0.5) * 30;
    scattered[i * 3 + 2] = (hash(i, 6) - 0.5) * 46;

    positions[i * 3] = scattered[i * 3];
    positions[i * 3 + 1] = scattered[i * 3 + 1];
    positions[i * 3 + 2] = scattered[i * 3 + 2];

    // Colour by radius: warm amber core -> violet rim, brighter toward
    // centre. Stays inside the brand palette (no white/blue-white).
    mixBrand(scratch, 1 - rNorm); // centre (rNorm~0) -> amber, rim -> violet
    scratch.multiplyScalar(1.15 - rNorm * 0.55);
    colors[i * 3] = scratch.r;
    colors[i * 3 + 1] = scratch.g;
    colors[i * 3 + 2] = scratch.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = makeMaterial(0.1, 0.62);
  const attr = geometry.attributes.position as THREE.BufferAttribute;
  group.add(new THREE.Points(geometry, material));

  function writeAt(progress: number) {
    // Ease so the condensation settles rather than arriving linearly.
    const e = progress * progress * (3 - 2 * progress);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = scattered[i] + (target[i] - scattered[i]) * e;
    }
    attr.needsUpdate = true;
  }

  return {
    object: group,
    update: (elapsed, _dt, progress) => {
      writeAt(progress);
      group.rotation.y = elapsed * 0.05; // slow idle spin of the whole disc
    },
    rest: () => writeAt(1),
    sample: () => checksum([positions]),
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

// --- Formation 3: vortex / convergence ------------------------------------
function buildVortex(count: number): Strategy {
  const group = new THREE.Group();
  group.rotation.x = 0.5;

  const INNER = 1.2; // reset threshold near the dark centre
  const OUTER = 12;
  const angles = new Float32Array(count);
  const radii = new Float32Array(count);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const scratch = new THREE.Color();
  for (let i = 0; i < count; i++) {
    angles[i] = hash(i, 1) * Math.PI * 2;
    radii[i] = INNER + hash(i, 2) * (OUTER - INNER);
    // Colour by angle around the ring: violet -> amber -> violet sweep.
    const t = 0.5 + 0.5 * Math.sin(angles[i]);
    mixBrand(scratch, t);
    colors[i * 3] = scratch.r;
    colors[i * 3 + 1] = scratch.g;
    colors[i * 3 + 2] = scratch.b;
  }

  function writePositions() {
    for (let i = 0; i < count; i++) {
      const r = radii[i];
      positions[i * 3] = Math.cos(angles[i]) * r;
      positions[i * 3 + 1] = (hash(i, 3) - 0.5) * 0.8; // thin disc
      positions[i * 3 + 2] = Math.sin(angles[i]) * r;
    }
  }
  writePositions();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = makeMaterial(0.12, 0.6);
  const attr = geometry.attributes.position as THREE.BufferAttribute;
  group.add(new THREE.Points(geometry, material));

  return {
    object: group,
    update: (_elapsed, dt) => {
      // Continuous inward spiral: each particle drifts toward the centre and
      // swirls; on arrival it recycles to the outer edge - a self-sustaining
      // convergence loop, "everything converging into one system".
      const clamped = Math.min(dt, 0.05); // guard against tab-switch jumps
      for (let i = 0; i < count; i++) {
        radii[i] -= clamped * (0.6 + (1 - radii[i] / OUTER) * 1.4); // faster near centre
        angles[i] += clamped * (0.5 + (1 - radii[i] / OUTER) * 1.2); // tighter swirl inward
        if (radii[i] <= INNER) radii[i] = OUTER - hash(i, 4) * 0.5;
      }
      writePositions();
      attr.needsUpdate = true;
    },
    rest: () => {
      writePositions();
      attr.needsUpdate = true;
    },
    sample: () => checksum([positions]),
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

const BUILDERS: Record<Formation, (count: number) => Strategy> = {
  rings: buildRings,
  spiral: buildSpiral,
  vortex: buildVortex,
};

export function ParticleField({ formation, className }: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // A definitely-non-null capture: TS won't carry the `container` guard
    // above into the nested closures below (resize / cleanup), but a const
    // of the already-narrowed type is trusted there.
    const mount: HTMLDivElement = container;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = mount.closest("section") ?? undefined;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (error) {
      console.warn(`[ParticleField:${formation}] WebGL unavailable - effect disabled.`, error);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.z = CAMERA_Z[formation];

    const strategy = BUILDERS[formation](particleCount(formation, width));
    scene.add(strategy.object);

    // Test hook - lets Playwright read the live formation without depending
    // on WebGL actually compositing (the sandbox's software renderer often
    // paints nothing). Keyed per formation so multiple fields coexist.
    const sampleKey = `__particleSample_${formation}`;
    (window as unknown as Record<string, () => number>)[sampleKey] = strategy.sample;

    function handleResize() {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    function cleanupCommon() {
      window.removeEventListener("resize", handleResize);
      delete (window as unknown as Record<string, unknown>)[sampleKey];
      strategy.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    }

    // --- reduced motion: one static frame in the final formation ----------
    if (reduceMotion) {
      strategy.rest();
      renderer.render(scene, camera);
      return cleanupCommon;
    }

    // --- scroll wiring, per formation -------------------------------------
    // spiral: scrub assembly 0->1 as the section enters.
    // rings:  scrub a 1->0 fade as the section scrolls away.
    // vortex: one-time trigger flips `started`; then it self-loops.
    const proxy = { value: formation === "rings" ? 1 : 0 };
    const startedRef = { current: formation !== "vortex" };
    let scrollTween: gsap.core.Tween | undefined;
    let onceTrigger: ScrollTrigger | undefined;

    if (formation === "spiral") {
      scrollTween = gsap.to(proxy, {
        value: 1,
        ease: "none",
        scrollTrigger: { trigger: section ?? mount, start: "top bottom", end: "center center", scrub: 0.6 },
      });
    } else if (formation === "rings") {
      scrollTween = gsap.to(proxy, {
        value: 0,
        ease: "none",
        scrollTrigger: { trigger: section ?? mount, start: "center center", end: "bottom top", scrub: 0.6 },
      });
    } else {
      onceTrigger = ScrollTrigger.create({
        trigger: section ?? mount,
        start: "top 80%",
        once: true,
        onEnter: () => (startedRef.current = true),
      });
    }

    let rafId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();
    let last = 0;

    function tick() {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;
      const elapsed = clock.getElapsedTime();
      const dt = elapsed - last;
      last = elapsed;
      if (formation === "vortex" && !startedRef.current) {
        strategy.rest();
      } else {
        strategy.update(elapsed, dt, proxy.value);
      }
      renderer.render(scene, camera);
    }
    tick();

    function handleVisibility() {
      isVisible = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      onceTrigger?.kill();
      cleanupCommon();
    };
  }, [formation]);

  return (
    <div
      ref={containerRef}
      data-testid={`particle-field-${formation}`}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0"}
    />
  );
}
