import { CANVAS } from './config.js';

export class Renderer {
  constructor(ctx) { this.ctx = ctx; }

  draw(game) {
    const { ctx } = this; const phase = game.phase; const progress = game.phaseDistance / game.phaseLength; const offset = (game.distance * .5) % 120; const night = Math.max(0, Math.min(1, (progress - .32) / .48));
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS.height); sky.addColorStop(0, this.mixColor(phase.colors[0], '#101b46', night)); sky.addColorStop(1, this.mixColor(phase.colors[1], '#26305f', night)); ctx.fillStyle = sky; ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.fillStyle = this.mixColor(phase.colors[1], '#18254d', night); for (let y = -120 + offset; y < CANVAS.height; y += 120) ctx.fillRect(0, y, CANVAS.width, 60);
    if (night > .15) this.drawStars(night);
    if (game.phaseIndex === 1) { ctx.fillStyle = '#ffffff22'; for (let y = -60 + offset; y < CANVAS.height; y += 60) ctx.fillRect(0, y, CANVAS.width, 3); }
    this.drawLandmarks(game, progress, offset);
    game.clouds.forEach((cloud) => this.drawCloud(cloud));
    game.items.forEach((item) => this.drawItem(item));
    game.hazards.forEach((hazard) => this.drawHazard(hazard));
    game.projectiles.forEach((projectile) => this.drawProjectile(projectile));
    if (!(game.hitTimer > 0 && Math.floor(game.time * 14) % 2)) this.drawPlane(game.player.x, game.player.y, '#e8e8e8', -1);
    if (game.shield > 0) { ctx.strokeStyle = `rgba(255,210,63,${.5 + .3 * Math.sin(game.time * 12)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(game.player.x, game.player.y, 50, 0, Math.PI * 2); ctx.stroke(); }
    this.drawHud(game, progress);
    if (game.paused) this.drawPauseOverlay();
  }

  drawLandmarks(game, progress, offset) {
    const { ctx } = this;
    ctx.fillStyle = '#263d5a99';
    for (let x = -30; x < CANVAS.width + 80; x += 95) { const height = 30 + ((x * 7) % 35); ctx.beginPath(); ctx.moveTo(x, 105 + offset % 80); ctx.lineTo(x + 45, 105 - height + offset % 80); ctx.lineTo(x + 95, 105 + offset % 80); ctx.fill(); }
    if (game.phaseIndex === 1 && progress > .82) { ctx.fillStyle = '#f2dfa6'; ctx.fillRect(0, CANVAS.height - progress * 55, CANVAS.width, 60); }
  }
  mixColor(day, night, amount) { const parse = (hex) => hex.match(/\w\w/g).map((part) => parseInt(part, 16)); const a = parse(day); const b = parse(night); return `rgb(${a.map((value, index) => Math.round(value + (b[index] - value) * amount)).join(',')})`; }
  drawStars(opacity) { const { ctx } = this; ctx.fillStyle = `rgba(255,255,220,${opacity * .8})`; for (let index = 0; index < 34; index += 1) { const x = (index * 83) % CANVAS.width; const y = 72 + ((index * 47) % 300); ctx.fillRect(x, y, index % 3 === 0 ? 3 : 2, index % 3 === 0 ? 3 : 2); } }
  drawProjectile(projectile) { const { ctx } = this; ctx.save(); ctx.translate(projectile.x, projectile.y); ctx.shadowColor = '#ff5b35'; ctx.shadowBlur = 12; ctx.fillStyle = '#ff793f'; ctx.beginPath(); ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff2a8'; ctx.beginPath(); ctx.arc(-2, -2, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

  drawCloud(c) {
    const { ctx } = this;
    ctx.save(); ctx.translate(c.x, c.y);
    ctx.fillStyle = '#00000018'; ctx.beginPath(); ctx.ellipse(5, 10, 52 * c.size, 16 * c.size, 0, 0, Math.PI * 2); ctx.fill();
    const gradient = ctx.createLinearGradient(0, -20, 0, 18); gradient.addColorStop(0, '#fff'); gradient.addColorStop(1, '#b8cce0');
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(0, 0, 50 * c.size, 18 * c.size, 0, 0, Math.PI * 2); ctx.ellipse(25 * c.size, -8 * c.size, 30 * c.size, 16 * c.size, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  drawItem(item) {
    const { ctx } = this; const color = item.type === 'fuel' ? '#7dff9b' : '#ffd23f';
    const passport = item.type === 'passport';
    const itemColor = passport ? '#62b5ff' : color;
    ctx.save(); ctx.translate(item.x, item.y); ctx.shadowColor = itemColor; ctx.shadowBlur = 16; const gradient = ctx.createRadialGradient(-5, -6, 2, 0, 0, item.radius); gradient.addColorStop(0, '#fff'); gradient.addColorStop(.3, itemColor); gradient.addColorStop(1, passport ? '#174c91' : '#a66b00'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(0, 0, item.radius, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#071022'; ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(passport ? '🛂' : item.type === 'fuel' ? '⚡' : '★', 0, 6); ctx.restore();
  }
  drawHazard(hazard) { if (hazard.type === 'bird') { this.drawBird(hazard); return; } this.drawPlane(hazard.x, hazard.y, hazard.chaser ? '#162d72' : '#244d9a', 1); }
  drawBird(bird) {
    const { ctx } = this; ctx.save(); ctx.translate(bird.x, bird.y); ctx.fillStyle = '#00000030'; ctx.beginPath(); ctx.ellipse(2, 10, 25, 7, 0, 0, Math.PI * 2); ctx.fill();
    const gradient = ctx.createLinearGradient(0, -14, 0, 14); gradient.addColorStop(0, '#f4a261'); gradient.addColorStop(1, '#9d3d28'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(0, 0, 13, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#d86b36'; ctx.beginPath(); ctx.ellipse(-15, -3, 15, 6, -.35, 0, Math.PI * 2); ctx.ellipse(15, -3, 15, 6, .35, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, -5, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#172033'; ctx.beginPath(); ctx.arc(7, -5, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  drawPlane(x, y, color, direction) {
    const { ctx } = this; ctx.save(); ctx.translate(x, y); if (direction > 0) ctx.scale(1, -1);
    ctx.fillStyle = '#00000035'; ctx.beginPath(); ctx.ellipse(4, 32, 38, 9, 0, 0, Math.PI * 2); ctx.fill();
    const gradient = ctx.createLinearGradient(-35, -40, 35, 42); gradient.addColorStop(0, '#f7fbff'); gradient.addColorStop(.2, color); gradient.addColorStop(.72, color); gradient.addColorStop(1, '#071b4d'); ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.moveTo(0, -38); ctx.quadraticCurveTo(8, -20, 10, -10); ctx.lineTo(45, 9); ctx.quadraticCurveTo(48, 14, 43, 19); ctx.lineTo(8, 11); ctx.lineTo(6, 28); ctx.lineTo(19, 37); ctx.lineTo(18, 43); ctx.lineTo(0, 38); ctx.lineTo(-18, 43); ctx.lineTo(-19, 37); ctx.lineTo(-6, 28); ctx.lineTo(-8, 11); ctx.lineTo(-43, 19); ctx.quadraticCurveTo(-48, 14, -45, 9); ctx.lineTo(-10, -10); ctx.quadraticCurveTo(-8, -20, 0, -38); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#06132f99'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#bcecff'; ctx.beginPath(); ctx.ellipse(0, -14, 4, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff8'; ctx.fillRect(-28, 12, 20, 3); ctx.fillRect(8, 12, 20, 3); ctx.restore();
  }
  drawHud(game, progress) { const { ctx } = this; ctx.fillStyle = '#00000075'; ctx.fillRect(0, 0, CANVAS.width, 62); ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left'; ctx.fillText(`FASE ${game.phaseIndex + 1}/2 · ${game.phase.destination}`, 12, 19); ctx.font = '11px system-ui'; ctx.fillText(`${game.difficulty.name} · ${game.phase.landmarks[Math.min(1, Math.floor(progress * 2))]}`, 12, 39); ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 12px system-ui'; ctx.fillText(`SCORE ${game.score.toLocaleString('pt-BR')}`, 220, 19); ctx.fillStyle = '#62b5ff'; ctx.fillText(`🛂 ${game.passports}`, 220, 39); this.drawLives(game.lives); ctx.fillStyle = '#ffffff55'; ctx.fillRect(12, 48, CANVAS.width - 24, 6); ctx.fillStyle = '#ffd23f'; ctx.fillRect(12, 48, (CANVAS.width - 24) * progress, 6); if (game.shield > 0) { ctx.fillStyle = '#ffffff55'; ctx.fillRect(12, 58, 120, 3); ctx.fillStyle = '#ffd23f'; ctx.fillRect(12, 58, 120 * Math.min(1, game.shield / 5), 3); ctx.font = '9px system-ui'; ctx.fillStyle = '#fff'; ctx.fillText('ESCUDO', 136, 61); } }
  drawLives(lives) { const { ctx } = this; const startX = CANVAS.width - 14 - Math.max(0, lives) * 20; for (let index = 0; index < lives; index += 1) { const x = startX + index * 20; ctx.save(); ctx.translate(x, 14); ctx.fillStyle = '#ef3340'; ctx.shadowColor = '#7f1020'; ctx.shadowBlur = 4; ctx.beginPath(); ctx.moveTo(0, 7); ctx.bezierCurveTo(-15, -2, -8, -11, 0, -5); ctx.bezierCurveTo(8, -11, 15, -2, 0, 7); ctx.fill(); ctx.restore(); } }
  drawPauseOverlay() { const { ctx } = this; ctx.fillStyle = '#071022aa'; ctx.fillRect(0, 0, CANVAS.width, CANVAS.height); ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = 'bold 36px system-ui'; ctx.fillText('PAUSADO', CANVAS.width / 2, CANVAS.height / 2 - 12); ctx.font = '16px system-ui'; ctx.fillStyle = '#ffd23f'; ctx.fillText('Toque em Continuar ou pressione P', CANVAS.width / 2, CANVAS.height / 2 + 25); }
}
