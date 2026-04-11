export interface LevelData {
  id: number;
  obstacleCount: number;
  speed: number;
  rotationChance: number;
  themeName: 'light' | 'lava' | 'beach' | 'forest' | 'ice' | 'desert' | 'city' | 'candy';
}

export const LEVELS: LevelData[] = [
  { id: 1, obstacleCount: 10, speed: 20, rotationChance: 0.1, themeName: 'beach' },
  { id: 2, obstacleCount: 15, speed: 25, rotationChance: 0.2, themeName: 'lava' },
  { id: 3, obstacleCount: 20, speed: 30, rotationChance: 0.3, themeName: 'desert' },
  { id: 4, obstacleCount: 25, speed: 35, rotationChance: 0.4, themeName: 'forest' },
  { id: 5, obstacleCount: 30, speed: 40, rotationChance: 0.5, themeName: 'city' },
];
