import * as THREE from "three";
import { buildFormations } from "./formations";

export interface SceneStats {
  count: number;
  frameMs: number;
  fps: number;
  coldStart: number;
  morph: number; // 0..4
}

export interface SceneOptions {
  count: number;
  pixelRatio: number;
  tier: "high" | "low";
  onStats?: (s: SceneStats) => void;
}

const VERT = /* glsl */ `
uniform float uMorph;      // 0..4
uniform float uTime;
uniform float uPixelRatio;
uniform float uSizeScale;
uniform vec3  uMouse;
uniform float uMouseStrength;

attribute vec3  aF0; attribute vec3 aF1; attribute vec3 aF2; attribute vec3 aF3; attribute vec3 aF4;
attribute vec3  cF0; attribute vec3 cF1; attribute vec3 cF2; attribute vec3 cF3; attribute vec3 cF4;
attribute float aSize;
attribute float aSeed;

varying vec3 vColor;

float ease(float t){ return t * t * (3.0 - 2.0 * t); }

void main() {
  int seg = int(floor(uMorph));
  if (seg > 3) seg = 3;
  float stagger = (aSeed - 0.5) * 0.2;
  float t = ease(clamp(uMorph - float(seg) + stagger, 0.0, 1.0));

  vec3 pA, pB, cA, cB;
  if (seg == 0)      { pA = aF0; pB = aF1; cA = cF0; cB = cF1; }
  else if (seg == 1) { pA = aF1; pB = aF2; cA = cF1; cB = cF2; }
  else if (seg == 2) { pA = aF2; pB = aF3; cA = cF2; cB = cF3; }
  else               { pA = aF3; pB = aF4; cA = cF3; cB = cF4; }

  vec3 pos = mix(pA, pB, t);
  vec3 col = mix(cA, cB, t);

  // Idle drift for life.
  pos += 0.015 * vec3(
    sin(uTime * 0.6 + aSeed * 20.0),
    cos(uTime * 0.5 + aSeed * 15.0),
    sin(uTime * 0.4 + aSeed * 10.0)
  );

  vec4 world = modelMatrix * vec4(pos, 1.0);

  // Pointer push.
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float infl = uMouseStrength * exp(-dist * dist * 2.5);
  world.xy += normalize(d + 1e-4) * infl;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * uSizeScale / max(0.1, -mv.z);

  // Gentle twinkle (reads as stars in the finale, negligible elsewhere).
  float tw = 0.82 + 0.18 * sin(uTime * 2.5 + aSeed * 35.0);
  vColor = col * tw;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(vColor, alpha);
}
`;

export class ParticleScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private points: THREE.Points;
  private material: THREE.ShaderMaterial;
  private uniforms: Record<string, THREE.IUniform>;
  private raf = 0;
  private disposed = false;

  private morph = 0;
  private morphTarget = 0;
  private pointer = new THREE.Vector2(0, 0);
  private pointerTarget = new THREE.Vector2(0, 0);

  private clock = new THREE.Clock();
  private startTime = performance.now();
  private coldStart = 0;
  private lastFrame = performance.now();
  private frameMs = 16.7;
  private spin = 0;
  private lastStatsEmit = 0;

  readonly count: number;
  readonly tier: "high" | "low";
  private onStats?: (s: SceneStats) => void;

  constructor(canvas: HTMLCanvasElement, opts: SceneOptions) {
    this.count = opts.count;
    this.tier = opts.tier;
    this.onStats = opts.onStats;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(opts.pixelRatio);
    this.renderer.setClearColor(0x060608, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    this.camera.position.set(0, 0, 3.7);

    const d = buildFormations(opts.count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(d.pos[0], 3));
    const names = ["aF0", "aF1", "aF2", "aF3", "aF4"];
    const cnames = ["cF0", "cF1", "cF2", "cF3", "cF4"];
    for (let k = 0; k < 5; k++) {
      geo.setAttribute(names[k], new THREE.BufferAttribute(d.pos[k], 3));
      geo.setAttribute(cnames[k], new THREE.BufferAttribute(d.col[k], 3));
    }
    geo.setAttribute("aSize", new THREE.BufferAttribute(d.size, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(d.seed, 1));
    geo.setDrawRange(0, opts.count);

    this.uniforms = {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: opts.pixelRatio },
      uSizeScale: { value: opts.tier === "low" ? 8.0 : 7.0 },
      uMouse: { value: new THREE.Vector3() },
      uMouseStrength: { value: 0.09 },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.resize();
    window.addEventListener("resize", this.resize);
    this.loop();
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  /** 0..4. `immediate` snaps (used by the test harness). */
  setMorphTarget(t: number, immediate = false) {
    this.morphTarget = Math.min(4, Math.max(0, t));
    if (immediate) this.morph = this.morphTarget;
  }

  setPointer(nx: number, ny: number) {
    this.pointerTarget.set(nx, ny);
  }

  getStats(): SceneStats {
    return { count: this.count, frameMs: this.frameMs, fps: 1000 / this.frameMs, coldStart: this.coldStart, morph: this.morph };
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);

    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.frameMs += ((now - this.lastFrame) - this.frameMs) * 0.1;
    this.lastFrame = now;

    this.morph += (this.morphTarget - this.morph) * 0.06;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.08;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.08;

    this.uniforms.uTime.value = this.clock.getElapsedTime();
    this.uniforms.uMorph.value = this.morph;

    const halfH = Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    (this.uniforms.uMouse.value as THREE.Vector3).set(this.pointer.x * halfW, this.pointer.y * halfH, 0);

    // Slow rotation only near the DNA formation (morph ~2); other formations stay put.
    const dnaProx = Math.max(0, 1 - Math.abs(this.morph - 2));
    this.spin += dt * 0.45 * dnaProx;
    this.points.rotation.y = this.spin + this.pointer.x * 0.32;
    this.points.rotation.x = -this.pointer.y * 0.18;

    this.renderer.render(this.scene, this.camera);
    if (this.coldStart === 0) this.coldStart = (performance.now() - this.startTime) / 1000;

    if (this.onStats && now - this.lastStatsEmit > 160) {
      this.lastStatsEmit = now;
      this.onStats(this.getStats());
    }
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    this.points.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
