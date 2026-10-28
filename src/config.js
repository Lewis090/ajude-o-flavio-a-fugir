export const CANVAS = { width: 480, height: 760 };
export const PHASE_LENGTH = 9000;

export const DIFFICULTIES = {
  easy: { name: 'Fácil', lives: 3, speed: 155, spawnInterval: 1.45, itemInterval: 8, enemyRatio: .18, maxEnemies: 4 },
  normal: { name: 'Normal', lives: 2, speed: 180, spawnInterval: 1.2, itemInterval: 10, enemyRatio: .3, maxEnemies: 5 },
  hard: { name: 'Difícil', lives: 1, speed: 205, spawnInterval: .95, itemInterval: 12, enemyRatio: .46, maxEnemies: 6 }
};

export const PHASES = [
  { name: 'Argentina → Equador', destination: 'EQUADOR', colors: ['#5a8f3c', '#7aa84f'], landmarks: ['Cordilheira', 'Andes'] },
  { name: 'Equador → Estados Unidos', destination: 'ESTADOS UNIDOS', colors: ['#1d8fc4', '#3fb1de'], landmarks: ['Caribe', 'Flórida'] }
];
