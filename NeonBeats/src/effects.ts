import { Container, Graphics } from "pixi.js";

interface Particle {
  g: Graphics;
  vx: number;
  vy: number;
  decay: number;
}

interface Ripple {
  g: Graphics;
  radius: number;
  maxRadius: number;
  color: number;
}

export const particleContainer = new Container();
export const rippleContainer = new Container();

let particles: Particle[] = [];
let ripples: Ripple[] = [];

export function createParticleBurst(
  x: number,
  y: number,
  color = 0x00f0ff,
  count = 20,
): void {
  for (let i = 0; i < count; i++) {
    const g = new Graphics().circle(0, 0, Math.random() * 6 + 2).fill(color);
    g.x = x;
    g.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    particleContainer.addChild(g);
    particles.push({
      g,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      decay: Math.random() * 0.03 + 0.015,
    });
  }
}

export function createRipple(x: number, y: number, color = 0x00f0ff): void {
  const g = new Graphics();
  g.x = x;
  g.y = y;
  rippleContainer.addChild(g);
  ripples.push({ g, radius: 5, maxRadius: 90, color });
}

export function updateEffects(delta: number): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.g.x += p.vx * delta;
    p.g.y += p.vy * delta;
    p.g.alpha -= p.decay * delta;
    p.g.scale.x *= 0.98;
    p.g.scale.y *= 0.98;

    if (p.g.alpha <= 0) {
      particleContainer.removeChild(p.g);
      p.g.destroy();
      particles.splice(i, 1);
    }
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.radius += 4 * delta;
    r.g.alpha -= 0.025 * delta;

    r.g.clear().circle(0, 0, r.radius).stroke({ width: 2.5, color: r.color });

    if (r.g.alpha <= 0 || r.radius >= r.maxRadius) {
      rippleContainer.removeChild(r.g);
      r.g.destroy();
      ripples.splice(i, 1);
    }
  }
}

export function clearEffects(): void {
  particles.forEach((p) => p.g.destroy());
  ripples.forEach((r) => r.g.destroy());
  particles = [];
  ripples = [];
}
