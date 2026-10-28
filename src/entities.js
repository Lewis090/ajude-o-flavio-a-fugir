import { CANVAS } from './config.js';

export function createPlayer() { return { x: CANVAS.width / 2, y: CANVAS.height - 135, radius: 25 }; }
export function createCloud() { return { x: Math.random() * CANVAS.width, y: Math.random() * CANVAS.height, size: .5 + Math.random() }; }
export function createHazard(progress, enemyRatio) {
  const isChaser = Math.random() < enemyRatio;
  const type = Math.random() < .2 + progress * .15 ? 'bird' : 'plane';
  return { type, chaser: isChaser, x: 30 + Math.random() * (CANVAS.width - 60), y: -55, width: type === 'bird' ? 22 : 38, height: type === 'bird' ? 18 : 42, vy: 90 + Math.random() * 90, phase: Math.random() * Math.PI * 2 };
}
export function createItem() { return { x: 40 + Math.random() * (CANVAS.width - 80), y: -30, radius: 16, type: Math.random() < .25 ? 'fuel' : 'shield' }; }
export function collides(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) < (a.radius || 20) + (b.width || b.radius || 18) * .65; }
