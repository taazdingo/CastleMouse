import { Level } from '../types/game';

export const LEVELS: Level[] = [
  {
    id: 1,
    gridSize: 8,
    fixedAnimals: [
      { type: 'mouse', position: { row: 5, col: 3 }, id: 'fixed-mouse' }
    ],
    holes: [{ row: 1, col: 3 }],
    availableAnimals: ['cat']
  },
  {
    id: 2,
    gridSize: 8,
    fixedAnimals: [
      { type: 'mouse', position: { row: 6, col: 6 }, id: 'fixed-mouse' }
    ],
    holes: [{ row: 0, col: 0 }],
    availableAnimals: ['cat', 'dog']
  }
];
