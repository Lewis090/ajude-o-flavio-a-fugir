export const CANVAS = { width: 480, height: 760 };
export const PHASE_LENGTH = 4500;

export const DIFFICULTIES = {
  easy: { name: 'Fácil', lives: 5, speed: 220, spawnInterval: 1.25, itemInterval: 7, enemyRatio: .18, maxEnemies: 4 },
  normal: { name: 'Normal', lives: 3, speed: 260, spawnInterval: 1.0, itemInterval: 9, enemyRatio: .3, maxEnemies: 6 },
  hard: { name: 'Difícil', lives: 2, speed: 305, spawnInterval: .72, itemInterval: 12, enemyRatio: .46, maxEnemies: 8 }
};

export const PHASES = [
  { name: 'Argentina → Equador', destination: 'EQUADOR', colors: ['#5a8f3c', '#7aa84f'], landmarks: ['Cordilheira', 'Andes'] },
  { name: 'Equador → Estados Unidos', destination: 'ESTADOS UNIDOS', colors: ['#1d8fc4', '#3fb1de'], landmarks: ['Caribe', 'Flórida'] }
];
