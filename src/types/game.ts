export type AnimalType = 'mouse' | 'cat' | 'dog' | 'lion' | 'bear' | 'elephant';

export interface Position {
  row: number;
  col: number;
}

export interface Animal {
  type: AnimalType;
  position: Position;
  id: string;
  isFixed?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | null;
}

export interface Level {
  id: number;
  gridSize: number;
  fixedAnimals: Animal[];
  holes: Position[];
  availableAnimals: AnimalType[];
}

export interface GameState {
  level: Level;
  placedAnimals: Animal[];
  phase: 'solve' | 'play';
  isWon: boolean;
}

// Predator hierarchy: each animal fears the next one
export const PREDATOR_HIERARCHY: AnimalType[] = [
  'mouse',
  'cat',
  'dog',
  'lion',
  'bear',
  'elephant'
];

export const ANIMAL_EMOJIS: Record<AnimalType, string> = {
  mouse: '🐭',
  cat: '🐱',
  dog: '🐶',
  lion: '🦁',
  bear: '🐻',
  elephant: '🐘'
};

export function getPredator(prey: AnimalType): AnimalType | null {
  const index = PREDATOR_HIERARCHY.indexOf(prey);
  if (index === -1 || index === PREDATOR_HIERARCHY.length - 1) return null;
  return PREDATOR_HIERARCHY[index + 1];
}

export function isPredatorOf(predator: AnimalType, prey: AnimalType): boolean {
  const preyIndex = PREDATOR_HIERARCHY.indexOf(prey);
  const predatorIndex = PREDATOR_HIERARCHY.indexOf(predator);
  return predatorIndex === preyIndex + 1;
}
