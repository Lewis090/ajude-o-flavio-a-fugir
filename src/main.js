import { Input } from './input.js';
import { Renderer } from './renderer.js';
import { Game } from './game.js';

const canvas = document.querySelector('#game-canvas');
const menu = document.querySelector('#game-menu');
const message = document.querySelector('#game-message');
const pauseButton = document.querySelector('#pause-button');
let game;
const input = new Input(canvas, () => game?.togglePause());
game = new Game(input, new Renderer(canvas.getContext('2d')), showEvent);
let last = performance.now();

document.querySelectorAll('[data-difficulty]').forEach((button) => button.addEventListener('click', () => game.start(button.dataset.difficulty)));
pauseButton.addEventListener('click', () => game.togglePause());
document.addEventListener('visibilitychange', () => { if (document.hidden) game.pause(); });
window.addEventListener('blur', () => game.pause());

function showEvent(event, currentGame) {
  if (event === 'playing') { menu.hidden = true; message.hidden = true; pauseButton.hidden = false; updatePauseButton(currentGame); return; }
  if (event === 'paused' || event === 'resumed') { updatePauseButton(currentGame); return; }
  const content = event === 'phaseComplete'
    ? `<p class="eyebrow">Fase 1 concluída</p><h2>Equador alcançado!</h2><p>Prepare-se para cruzar o Caribe rumo aos Estados Unidos.</p><button data-action="continue">Continuar para a fase 2</button>`
    : resultMarkup(event, currentGame);
  message.innerHTML = content; message.hidden = false; pauseButton.hidden = true;
  message.querySelector('[data-action="continue"]')?.addEventListener('click', () => { message.hidden = true; });
  message.querySelector('[data-action="restart"]')?.addEventListener('click', () => { message.hidden = true; menu.hidden = false; });
  message.querySelector('[data-rank-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const initials = message.querySelector('[name="initials"]').value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3).padEnd(3, 'A');
    saveRank(initials, currentGame.score);
    message.querySelector('[data-rank-form]').replaceWith(document.createElement('p'));
    message.querySelector('.rank-table').outerHTML = rankTable();
  });
}

function resultMarkup(event, currentGame) {
  const victory = event === 'win';
  return `<p class="eyebrow">${victory ? 'Missão cumprida' : 'Fim de voo'}</p><h2>${victory ? 'Estados Unidos!' : 'Fomos pegos!'}</h2><p>${victory ? 'Flávio chegou são e salvo na Flórida.' : `Você ficou sem vidas na dificuldade ${currentGame.difficulty.name}.`}</p><p><strong>Score: ${currentGame.score.toLocaleString('pt-BR')}</strong> · 🛂 ${currentGame.passports}</p><form class="rank-form" data-rank-form><label for="initials">Digite 3 letras para o ranking</label><input id="initials" name="initials" maxlength="3" minlength="3" pattern="[A-Za-z]{3}" value="AAA" autocomplete="off" required><button type="submit">Salvar no ranking</button></form>${rankTable()}<button data-action="restart">Jogar novamente</button>`;
}

function getRanks() {
  try { const ranks = JSON.parse(localStorage.getItem('flavio-rank') || '[]'); return Array.isArray(ranks) ? ranks : []; } catch (error) { console.warn('Não foi possível ler o ranking local.', error); return []; }
}
function saveRank(initials, score) {
  const ranks = [...getRanks(), { initials, score, date: Date.now() }].sort((a, b) => b.score - a.score).slice(0, 5);
  try { localStorage.setItem('flavio-rank', JSON.stringify(ranks)); } catch (error) { console.warn('Não foi possível salvar o ranking local.', error); }
}
function rankTable() {
  const rows = getRanks().map((rank, index) => `<tr><td>${index + 1}</td><td>${rank.initials}</td><td>${rank.score.toLocaleString('pt-BR')}</td></tr>`).join('');
  return `<table class="rank-table"><thead><tr><th>#</th><th>Nome</th><th>Score</th></tr></thead><tbody>${rows || '<tr><td colspan="3">Ainda não há pontuações</td></tr>'}</tbody></table>`;
}

function updatePauseButton(currentGame) { pauseButton.textContent = currentGame.paused ? '▶ Continuar' : '⏸ Pausar'; pauseButton.setAttribute('aria-label', currentGame.paused ? 'Continuar jogo' : 'Pausar jogo'); }
function loop(now) { const dt = Math.min(.04, (now - last) / 1000); last = now; if (!menu.hidden && message.hidden) game.draw(); else if (menu.hidden && message.hidden) { if (!game.paused) game.update(dt); game.draw(); } requestAnimationFrame(loop); }
game.draw();
pauseButton.hidden = true;
requestAnimationFrame(loop);
