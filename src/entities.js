import { CANVAS } from './config.js';

export function createPlayer() { return { x: CANVAS.width / 2, y: CANVAS.height - 135, radius: 25 }; }
export function createCloud() { return { x: Math.random() * CANVAS.width, y: Math.random() * CANVAS.height, size: .5 + Math.random() }; }
export function createHazard(progress, enemyRatio) {
  const isChaser = Math.random() < enemyRatio;
  const type = Math.random() < .2 + progress * .15 ? 'bird' : 'plane';
  return { type, chaser: isChaser, x: 30 + Math.random() * (CANVAS.width - 60), y: -55, width: type === 'bird' ? 22 : 38, height: type === 'bird' ? 18 : 42, vy: 90 + Math.random() * 90, phase: Math.random() * Math.PI * 2, shootTimer: .7 + Math.random() * 1.8 };
}
export function createProjectile(hazard) { return { x: hazard.x, y: hazard.y + 35, radius: 8, vy: 280 }; }
export function createItem() {
  const roll = Math.random();
  const type = roll < .28 ? 'passport' : roll < .52 ? 'fuel' : 'shield';
  return { x: 40 + Math.random() * (CANVAS.width - 80), y: -30, radius: type === 'passport' ? 18 : 16, type };
}
export function collides(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) < (a.radius || 20) + (b.width || b.radius || 18) * .65; }
