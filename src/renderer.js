import { CANVAS } from './config.js';

export class Renderer {
  constructor(ctx) { this.ctx = ctx; }

  draw(game) {
    const { ctx } = this; const phase = game.phase; const progress = game.phaseDistance / game.phaseLength; const offset = (game.distance * .5) % 120;
    ctx.fillStyle = phase.colors[0]; ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.fillStyle = phase.colors[1]; for (let y = -120 + offset; y < CANVAS.height; y += 120) ctx.fillRect(0, y, CANVAS.width, 60);
    if (game.phaseIndex === 1) { ctx.fillStyle = '#ffffff22'; for (let y = -60 + offset; y < CANVAS.height; y += 60) ctx.fillRect(0, y, CANVAS.width, 3); }
    this.drawLandmarks(game, progress, offset);
    game.clouds.forEach((cloud) => this.drawCloud(cloud));
    game.items.forEach((item) => this.drawItem(item));
    game.hazards.forEach((hazard) => this.drawHazard(hazard));
    if (!(game.hitTimer > 0 && Math.floor(game.time * 14) % 2)) this.drawPlane(game.player.x, game.player.y, '#e8e8e8', -1);
    if (game.shield > 0) { ctx.strokeStyle = `rgba(255,210,63,${.5 + .3 * Math.sin(game.time * 12)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(game.player.x, game.player.y, 50, 0, Math.PI * 2); ctx.stroke(); }
    this.drawHud(game, progress);
  }

  drawLandmarks(game, progress, offset) {
    const { ctx } = this;
    ctx.fillStyle = '#263d5a99';
    for (let x = -30; x < CANVAS.width + 80; x += 95) { const height = 30 + ((x * 7) % 35); ctx.beginPath(); ctx.moveTo(x, 105 + offset % 80); ctx.lineTo(x + 45, 105 - height + offset % 80); ctx.lineTo(x + 95, 105 + offset % 80); ctx.fill(); }
    if (game.phaseIndex === 1 && progress > .82) { ctx.fillStyle = '#f2dfa6'; ctx.fillRect(0, CANVAS.height - progress * 55, CANVAS.width, 60); }
  }

  drawCloud(c) { const { ctx } = this; ctx.fillStyle = '#ffffff99'; ctx.beginPath(); ctx.ellipse(c.x, c.y, 50 * c.size, 18 * c.size, 0, 0, Math.PI * 2); ctx.ellipse(c.x + 25 * c.size, c.y - 8 * c.size, 30 * c.size, 16 * c.size, 0, 0, Math.PI * 2); ctx.fill(); }
  drawItem(item) { const { ctx } = this; ctx.fillStyle = item.type === 'fuel' ? '#7dff9b' : '#ffd23f'; ctx.beginPath(); ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#071022'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText(item.type === 'fuel' ? '⚡' : '★', item.x, item.y + 6); }
  drawHazard(hazard) { if (hazard.type === 'bird') { const { ctx } = this; ctx.strokeStyle = '#34201a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(hazard.x - 10, hazard.y, 12, Math.PI, 0); ctx.arc(hazard.x + 10, hazard.y, 12, Math.PI, 0); ctx.stroke(); return; } this.drawPlane(hazard.x, hazard.y, hazard.chaser ? '#0a2a6b' : '#143c8c', 1); }
  drawPlane(x, y, color, direction) { const { ctx } = this; ctx.save(); ctx.translate(x, y); if (direction > 0) ctx.scale(1, -1); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(7, -10); ctx.lineTo(44, 8); ctx.lineTo(44, 18); ctx.lineTo(7, 10); ctx.lineTo(5, 28); ctx.lineTo(18, 36); ctx.lineTo(18, 42); ctx.lineTo(0, 37); ctx.lineTo(-18, 42); ctx.lineTo(-18, 36); ctx.lineTo(-5, 28); ctx.lineTo(-7, 10); ctx.lineTo(-44, 18); ctx.lineTo(-44, 8); ctx.lineTo(-7, -10); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#0006'; ctx.stroke(); ctx.fillStyle = '#b4e6ff'; ctx.beginPath(); ctx.ellipse(0, -14, 3.5, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  drawHud(game, progress) { const { ctx } = this; ctx.fillStyle = '#00000075'; ctx.fillRect(0, 0, CANVAS.width, 62); ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left'; ctx.fillText(`FASE ${game.phaseIndex + 1}/2 · ${game.phase.destination}`, 12, 19); ctx.font = '11px system-ui'; ctx.fillText(`${game.difficulty.name} · ${game.phase.landmarks[Math.min(1, Math.floor(progress * 2))]}`, 12, 39); ctx.textAlign = 'right'; ctx.font = 'bold 16px system-ui'; ctx.fillText('❤'.repeat(Math.max(0, game.lives)), CANVAS.width - 12, 20); ctx.fillStyle = '#ffffff55'; ctx.fillRect(12, 48, CANVAS.width - 24, 6); ctx.fillStyle = '#ffd23f'; ctx.fillRect(12, 48, (CANVAS.width - 24) * progress, 6); }
}
