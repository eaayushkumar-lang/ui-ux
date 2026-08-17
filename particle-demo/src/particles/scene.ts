import * as THREE from "three";
import { buildFormations } from "./formations";

export interface SceneStats {
  count: number;
  frameMs: number;
  fps: number;
  coldStart: number;
  morph: number;
}

export interface SceneOptions {
  count: number;
  pixelRatio: number;
  tier: "high" | "low";
  onStats?: (s: SceneStats) => void;
}

const VERT = /* glsl */ `
uniform float uMorph;      // 0..2  (0=torus, 1=galaxy, 2=brain)
uniform float uTime;
uniform float uPixelRatio;
uniform float uSizeScale;
uniform vec3  uMouse;      // world-space point on the z=0 plane
uniform float uMouseStrength;

attribute vec3  aTorus;
attribute vec3  aGalaxy;
attribute vec3  aBrain;
attribute vec3  cTorus;
attribute vec3  cGalaxy;
attribute vec3  cBrain;
attribute float aSize;
attribute float aSeed;

varying vec3 vColor;

float ease(float t){ return t * t * (3.0 - 2.0 * t); }

void main() {
  // Per-particle stagger so the swarm doesn't arrive all at once.
  float stagger = (aSeed - 0.5) * 0.22;
  vec3 pos;
  vec3 col;
  if (uMorph < 1.0) {
    float t = ease(clamp(uMorph + stagger, 0.0, 1.0));
    pos = mix(aTorus, aGalaxy, t);
    col = mix(cTorus, cGalaxy, t);
  } else {
    float t = ease(clamp((uMorph - 1.0) + stagger, 0.0, 1.0));
    pos = mix(aGalaxy, aBrain, t);
    col = mix(cGalaxy, cBrain, t);
  }

  // Gentle idle drift keeps the field alive between morphs.
  pos += 0.015 * vec3(
    sin(uTime * 0.6 + aSeed * 20.0),
    cos(uTime * 0.5 + aSeed * 15.0),
    sin(uTime * 0.4 + aSeed * 10.0)
  );

  vec4 world = modelMatrix * vec4(pos, 1.0);

  // Pointer reactivity: push nearby particles away from the cursor.
  vec2 delta = world.xy - uMouse.xy;
  float dist = length(delta);
  float infl = uMouseStrength * exp(-dist * dist * 2.5);
  world.xy += normalize(delta + 1e-4) * infl;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * uSizeScale / max(0.1, -mv.z);
  vColor = col;
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
  private baseSpin = 0;
  private lastStatsEmit = 0;

  readonly count: number;
  readonly tier: "high" | "low";
  private onStats?: (s: SceneStats) => void;

  constructor(canvas: HTMLCanvasElement, opts: SceneOptions) {
    this.count = opts.count;
    this.tier = opts.tier;
    this.onStats = opts.onStats;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(opts.pixelRatio);
    this.renderer.setClearColor(0x0a0a0f, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    this.camera.position.set(0, 0, 3.6);

    const data = buildFormations(opts.count);
    const geo = new THREE.BufferGeometry();
    // `position` is required by three; we drive real positions from aTorus etc,
    // but provide a base so bounding logic has something valid.
    geo.setAttribute("position", new THREE.BufferAttribute(data.torus, 3));
    geo.setAttribute("aTorus", new THREE.BufferAttribute(data.torus, 3));
    geo.setAttribute("aGalaxy", new THREE.BufferAttribute(data.galaxy, 3));
    geo.setAttribute("aBrain", new THREE.BufferAttribute(data.brain, 3));
    geo.setAttribute("cTorus", new THREE.BufferAttribute(data.cTorus, 3));
    geo.setAttribute("cGalaxy", new THREE.BufferAttribute(data.cGalaxy, 3));
    geo.setAttribute("cBrain", new THREE.BufferAttribute(data.cBrain, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
    geo.setDrawRange(0, opts.count);

    this.uniforms = {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: opts.pixelRatio },
      uSizeScale: { value: opts.tier === "low" ? 8.0 : 7.0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseStrength: { value: 0.0 },
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

  /** 0..2. `immediate` snaps (used by the test harness for stable shots). */
  setMorphTarget(t: number, immediate = false) {
    this.morphTarget = Math.min(2, Math.max(0, t));
    if (immediate) this.morph = this.morphTarget;
  }

  /** nx, ny in [-1, 1]; ny is +up. */
  setPointer(nx: number, ny: number) {
    this.pointerTarget.set(nx, ny);
  }

  getStats(): SceneStats {
    return {
      count: this.count,
      frameMs: this.frameMs,
      fps: 1000 / this.frameMs,
      coldStart: this.coldStart,
      morph: this.morph,
    };
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);

    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    // Exponential moving average of frame time -> stable ms / FPS readout.
    this.frameMs += ((now - this.lastFrame) - this.frameMs) * 0.1;
    this.lastFrame = now;

    // Smooth morph + pointer easing.
    this.morph += (this.morphTarget - this.morph) * 0.06;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.08;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.08;

    const time = this.clock.getElapsedTime();
    this.uniforms.uTime.value = time;
    this.uniforms.uMorph.value = this.morph;

    // Map normalized pointer to a world point on the z=0 plane.
    const halfH = Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    (this.uniforms.uMouse.value as THREE.Vector3).set(this.pointer.x * halfW, this.pointer.y * halfH, 0);
    this.uniforms.uMouseStrength.value = 0.09;

    // Subtle base spin + pointer-driven parallax rotation.
    this.baseSpin += dt * 0.05;
    this.points.rotation.y = this.baseSpin + this.pointer.x * 0.35;
    this.points.rotation.x = -this.pointer.y * 0.22;

    this.renderer.render(this.scene, this.camera);

    if (this.coldStart === 0) {
      this.coldStart = (performance.now() - this.startTime) / 1000;
    }

    // Emit stats ~6x/sec to keep DOM writes cheap.
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
