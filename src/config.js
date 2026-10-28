export const CANVAS = { width: 480, height: 760 };
export const PHASE_LENGTH = 15000;

export const DIFFICULTIES = {
  easy: { name: 'Fácil', lives: 3, speed: 165, spawnInterval: 1.1, itemInterval: 9, enemyRatio: .28, maxEnemies: 5, canShoot: false },
  normal: { name: 'Normal', lives: 2, speed: 190, spawnInterval: .82, itemInterval: 11, enemyRatio: .5, maxEnemies: 7, canShoot: true, shotInterval: 1.65 },
  hard: { name: 'Difícil', lives: 1, speed: 215, spawnInterval: .62, itemInterval: 13, enemyRatio: .68, maxEnemies: 9, canShoot: true, shotInterval: .95 }
};

export const PHASES = [
  { name: 'Argentina → Equador', destination: 'EQUADOR', colors: ['#5a8f3c', '#7aa84f'], landmarks: ['Cordilheira', 'Andes'] },
  { name: 'Equador → Estados Unidos', destination: 'ESTADOS UNIDOS', colors: ['#1d8fc4', '#3fb1de'], landmarks: ['Caribe', 'Flórida'] }
];
