import { CANVAS, DIFFICULTIES, PHASES, PHASE_LENGTH } from './config.js';
import { collides, createCloud, createHazard, createItem, createPlayer } from './entities.js';

export class Game {
  constructor(input, renderer, onEvent) { this.input = input; this.renderer = renderer; this.onEvent = onEvent; this.phaseLength = PHASE_LENGTH; this.reset('normal'); }
  reset(difficultyKey) { this.difficulty = DIFFICULTIES[difficultyKey]; this.phaseIndex = 0; this.phase = PHASES[0]; this.distance = 0; this.phaseDistance = 0; this.lives = this.difficulty.lives; this.time = 0; this.shield = 0; this.hitTimer = 0; this.spawnTimer = 0; this.itemTimer = 4; this.player = createPlayer(); this.clouds = Array.from({ length: 10 }, createCloud); this.hazards = []; this.items = []; }
  start(difficultyKey) { this.reset(difficultyKey); this.onEvent('playing', this); }
  update(dt) {
    this.time += dt; const progress = this.phaseDistance / this.phaseLength; const speed = this.difficulty.speed + progress * 145; this.distance += speed * dt; this.phaseDistance += speed * dt; this.movePlayer(dt); this.moveClouds(dt, speed);
    this.spawnTimer -= dt; if (this.spawnTimer <= 0 && this.hazards.length < this.difficulty.maxEnemies) { this.spawnTimer = Math.max(.3, this.difficulty.spawnInterval - progress * .25); this.hazards.push(createHazard(progress, this.difficulty.enemyRatio)); }
    this.itemTimer -= dt; if (this.itemTimer <= 0) { this.itemTimer = this.difficulty.itemInterval + Math.random() * 4; this.items.push(createItem()); }
    this.hazards.forEach((hazard) => { hazard.y += (speed * .45 + hazard.vy) * dt; if (hazard.chaser && hazard.y < this.player.y - 30) hazard.x += Math.sign(this.player.x - hazard.x) * Math.min(Math.abs(this.player.x - hazard.x), 120 * dt); if (hazard.type === 'bird') hazard.x += Math.sin(this.time * 4 + hazard.phase) * 35 * dt; });
    this.items.forEach((item) => item.y += speed * .7 * dt); this.hazards = this.hazards.filter((item) => item.y < CANVAS.height + 70); this.items = this.items.filter((item) => item.y < CANVAS.height + 40);
    this.shield = Math.max(0, this.shield - dt); this.hitTimer = Math.max(0, this.hitTimer - dt); this.collectItems(); this.checkCollisions();
    if (this.phaseDistance >= this.phaseLength) { if (this.phaseIndex === 0) { this.onEvent('phaseComplete', this); this.phaseIndex = 1; this.phase = PHASES[1]; this.phaseDistance = 0; this.hazards = []; this.items = []; } else this.onEvent('win', this); }
  }
  movePlayer(dt) { const direction = this.input.direction(); this.player.x += direction.x * 310 * dt; this.player.y += direction.y * 310 * dt; if (this.input.target) { this.player.x += (this.input.target.x - this.player.x) * Math.min(1, dt * 10); this.player.y += (this.input.target.y - 70 - this.player.y) * Math.min(1, dt * 10); } this.player.x = Math.max(30, Math.min(CANVAS.width - 30, this.player.x)); this.player.y = Math.max(75, Math.min(CANVAS.height - 50, this.player.y)); }
  moveClouds(dt, speed) { this.clouds.forEach((cloud) => { cloud.y += speed * dt * cloud.size * .6; if (cloud.y > CANVAS.height + 40) { cloud.y = -40; cloud.x = Math.random() * CANVAS.width; } }); }
  collectItems() { this.items.forEach((item) => { if (collides(this.player, item)) { item.y = CANVAS.height + 100; if (item.type === 'fuel') this.phaseDistance = Math.min(this.phaseLength, this.phaseDistance + 250); else this.shield = 5; } }); }
  checkCollisions() { if (this.hitTimer > 0 || this.shield > 0) return; const hazard = this.hazards.find((item) => collides(this.player, item)); if (!hazard) return; hazard.y = CANVAS.height + 100; this.lives -= 1; this.hitTimer = 1.5; if (this.lives <= 0) this.onEvent('gameOver', this); }
  draw() { this.renderer.draw(this); }
}
