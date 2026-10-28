import { Input } from './input.js';
import { Renderer } from './renderer.js';
import { Game } from './game.js';

const canvas = document.querySelector('#game-canvas');
const menu = document.querySelector('#game-menu');
const message = document.querySelector('#game-message');
const game = new Game(new Input(canvas), new Renderer(canvas.getContext('2d')), showEvent);
let last = performance.now();

document.querySelectorAll('[data-difficulty]').forEach((button) => button.addEventListener('click', () => game.start(button.dataset.difficulty)));

function showEvent(event, currentGame) {
  if (event === 'playing') { menu.hidden = true; message.hidden = true; return; }
  const content = event === 'phaseComplete'
    ? `<p class="eyebrow">Fase 1 concluída</p><h2>Equador alcançado!</h2><p>Prepare-se para cruzar o Caribe rumo aos Estados Unidos.</p><button data-action="continue">Continuar para a fase 2</button>`
    : event === 'win'
      ? `<p class="eyebrow">Missão cumprida</p><h2>Estados Unidos!</h2><p>Flávio chegou são e salvo na Flórida.</p><button data-action="restart">Jogar novamente</button>`
      : `<p class="eyebrow">Fim de voo</p><h2>Fomos pegos!</h2><p>Você ficou sem vidas na dificuldade ${currentGame.difficulty.name}.</p><button data-action="restart">Tentar novamente</button>`;
  message.innerHTML = content; message.hidden = false;
  message.querySelector('[data-action="continue"]')?.addEventListener('click', () => { message.hidden = true; });
  message.querySelector('[data-action="restart"]')?.addEventListener('click', () => { message.hidden = true; menu.hidden = false; });
}

function loop(now) { const dt = Math.min(.04, (now - last) / 1000); last = now; if (!menu.hidden && message.hidden) game.draw(); else if (menu.hidden && message.hidden) { game.update(dt); game.draw(); } requestAnimationFrame(loop); }
game.draw();
requestAnimationFrame(loop);
