import { Animal, Position, AnimalType, isPredatorOf } from '../types/game';

export interface MovingAnimal extends Animal {
  velocity: { dx: number; dy: number };
}

export interface SimulationState {
  animals: Animal[];
  movingAnimals: Map<string, { dx: number; dy: number }>;
  completed: boolean;
  won: boolean;
}

function getOppositeDirection(fromPos: Position, toPos: Position): { dx: number; dy: number } {
  const dx = toPos.col - fromPos.col;
  const dy = toPos.row - fromPos.row;
  
  // Normalize to -1, 0, or 1
  return {
    dx: dx === 0 ? 0 : dx / Math.abs(dx),
    dy: dy === 0 ? 0 : dy / Math.abs(dy)
  };
}

function isAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  // Adjacent means one square away horizontally or vertically (not diagonal)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function getAdjacentPredators(animal: Animal, allAnimals: Animal[]): Animal[] {
  return allAnimals.filter(other => {
    if (other.id === animal.id) return false;
    if (!isPredatorOf(other.type, animal.type)) return false;
    return isAdjacent(animal.position, other.position);
  });
}

export function initializeSimulation(animals: Animal[]): SimulationState {
  const movingAnimals = new Map<string, { dx: number; dy: number }>();
  
  // Check each animal for adjacent predators
  animals.forEach(animal => {
    const predators = getAdjacentPredators(animal, animals);
    
    if (predators.length > 0) {
      // If multiple predators, choose the first one (could be enhanced)
      const predator = predators[0];
      const direction = getOppositeDirection(predator.position, animal.position);
      movingAnimals.set(animal.id, direction);
    }
  });
  
  return {
    animals: animals.map(a => ({ ...a })),
    movingAnimals,
    completed: movingAnimals.size === 0,
    won: false
  };
}

export function simulationStep(
  state: SimulationState,
  gridSize: number,
  holes: Position[]
): SimulationState {
  if (state.completed) return state;
  
  const newAnimals = state.animals.map(a => ({ ...a }));
  const newMovingAnimals = new Map(state.movingAnimals);
  const animalsToStop = new Set<string>();
  const animalsToStart = new Map<string, { dx: number; dy: number }>();
  
  // Move each moving animal one step
  newMovingAnimals.forEach((velocity, animalId) => {
    const animal = newAnimals.find(a => a.id === animalId);
    if (!animal) return;
    
    const newRow = animal.position.row + velocity.dy;
    const newCol = animal.position.col + velocity.dx;
    
    // Check bounds
    if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
      animalsToStop.add(animalId);
      return;
    }
    
    // Check for collision with another animal
    const collision = newAnimals.find(
      other => other.id !== animalId && 
      other.position.row === newRow && 
      other.position.col === newCol
    );
    
    if (collision) {
      // Hit another animal
      if (isPredatorOf(collision.type, animal.type)) {
        // Hit our predator - reverse or change direction
        // If head-on collision, reverse
        const oppositeDir = getOppositeDirection(collision.position, animal.position);
        newMovingAnimals.set(animalId, oppositeDir);
        // Don't move this step, will reverse next step
        animalsToStop.add(animalId);
      } else {
        // Hit a non-predator - stop
        animalsToStop.add(animalId);
      }
      return;
    }
    
    // Move the animal
    animal.position = { row: newRow, col: newCol };
    
    // After moving, check if any adjacent animal is our predator
    const adjacentPredators = getAdjacentPredators(animal, newAnimals);
    if (adjacentPredators.length > 0) {
      const predator = adjacentPredators[0];
      const newDirection = getOppositeDirection(predator.position, animal.position);
      
      // Check if we need to change direction
      if (newDirection.dx !== velocity.dx || newDirection.dy !== velocity.dy) {
        newMovingAnimals.set(animalId, newDirection);
      }
    }
    
    // Check if this animal being at new position scares any stationary animals
    newAnimals.forEach(other => {
      if (other.id === animalId) return;
      if (newMovingAnimals.has(other.id)) return; // Already moving
      if (animalsToStart.has(other.id)) return; // Already triggered
      
      if (isPredatorOf(animal.type, other.type) && isAdjacent(animal.position, other.position)) {
        // We just scared this animal!
        const fleeDirection = getOppositeDirection(animal.position, other.position);
        animalsToStart.set(other.id, fleeDirection);
      }
    });
  });
  
  // Remove stopped animals
  animalsToStop.forEach(id => {
    newMovingAnimals.delete(id);
  });
  
  // Add newly scared animals
  animalsToStart.forEach((velocity, id) => {
    if (!animalsToStop.has(id)) {
      newMovingAnimals.set(id, velocity);
    }
  });
  
  // Check win condition - mouse in hole
  const mouse = newAnimals.find(a => a.type === 'mouse');
  let won = false;
  if (mouse) {
    won = holes.some(hole => 
      hole.row === mouse.position.row && hole.col === mouse.position.col
    );
  }
  
  return {
    animals: newAnimals,
    movingAnimals: newMovingAnimals,
    completed: newMovingAnimals.size === 0 || won,
    won
  };
}

export function runSimulation(
  animals: Animal[],
  gridSize: number,
  holes: Position[],
  onStep: (state: SimulationState) => void,
  maxSteps: number = 100
) {
  let state = initializeSimulation(animals);
  let step = 0;
  
  const interval = setInterval(() => {
    if (state.completed || step >= maxSteps) {
      clearInterval(interval);
      onStep(state);
      return;
    }
    
    state = simulationStep(state, gridSize, holes);
    step++;
    onStep(state);
  }, 300); // 300ms per step
  
  return () => clearInterval(interval);
}