import { useState } from 'react';
import { GameBoard } from './GameBoard';
import { AnimalTray } from './AnimalTray';
import { Animal, AnimalType } from '../types/game';
import { runSimulation, SimulationState } from '../utils/gameEngine';
import { EditorLevel } from './LevelEditor';

interface LevelPreviewProps {
  level: EditorLevel;
  onBackToEditor: () => void;
}

export function LevelPreview({ level, onBackToEditor }: LevelPreviewProps) {
  const [placedAnimals, setPlacedAnimals] = useState<Animal[]>([]);
  const [phase, setPhase] = useState<'solve' | 'play'>('solve');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [usedAnimals, setUsedAnimals] = useState<string[]>([]);
  const [currentAnimals, setCurrentAnimals] = useState<Animal[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const allAnimals = phase === 'solve' 
    ? [...level.fixedAnimals, ...placedAnimals]
    : currentAnimals;

  const handleCellClick = (row: number, col: number) => {
    if (phase !== 'solve' || !selectedAnimal) return;

    const isOccupied = allAnimals.some(
      a => a.position.row === row && a.position.col === col
    );

    if (isOccupied) return;

    const newAnimal: Animal = {
      type: selectedAnimal as AnimalType,
      position: { row, col },
      id: `placed-${Date.now()}`
    };

    setPlacedAnimals([...placedAnimals, newAnimal]);
    setUsedAnimals([...usedAnimals, selectedAnimal]);
    setSelectedAnimal(null);
  };

  const handleRemoveAnimal = (id: string) => {
    const animal = placedAnimals.find(a => a.id === id);
    if (!animal) return;

    setPlacedAnimals(placedAnimals.filter(a => a.id !== id));
    const usedIndex = usedAnimals.indexOf(animal.type);
    if (usedIndex !== -1) {
      const newUsedAnimals = [...usedAnimals];
      newUsedAnimals.splice(usedIndex, 1);
      setUsedAnimals(newUsedAnimals);
    }
  };

  const handlePlay = () => {
    setPhase('play');
    setIsAnimating(true);
    setIsWon(false);
    setShowCompletion(false);
    
    const initialAnimals = [...level.fixedAnimals, ...placedAnimals];
    setCurrentAnimals(initialAnimals);
    
    runSimulation(
      initialAnimals,
      level.gridSize,
      level.holes,
      (state: SimulationState) => {
        setCurrentAnimals(state.animals);
        
        if (state.completed) {
          setIsAnimating(false);
          if (state.won) {
            setIsWon(true);
            setShowCompletion(true);
          }
        }
      }
    );
  };

  const handleReset = () => {
    setPhase('solve');
    setPlacedAnimals([]);
    setUsedAnimals([]);
    setSelectedAnimal(null);
    setIsAnimating(false);
    setIsWon(false);
    setShowCompletion(false);
    setCurrentAnimals([]);
  };

  return (
    <div className="min-h-screen bg-castle-stone-dark flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-4">
          <div className="inline-block border-4 border-castle-gold bg-castle-brown p-4 mb-4 stone-pattern">
            <h1 className="text-castle-gold uppercase text-sm">Preview: {level.name || 'Untitled'}</h1>
          </div>
          <p className="text-parchment text-xs uppercase">
            {phase === 'solve' 
              ? '[ Test Your Level ]' 
              : isWon 
                ? '[ Level Complete! ]' 
                : isAnimating 
                  ? '[ Testing... ]'
                  : '[ Try Again ]'}
          </p>
        </div>

        {/* Completion banner */}
        {showCompletion && (
          <div className="mb-4 p-4 border-4 border-castle-green bg-castle-green/20 text-center stone-pattern">
            <p className="text-parchment text-xs uppercase">
              THE MOUSE REACHED THE HOLE! YOUR LEVEL WORKS!
            </p>
          </div>
        )}

        {/* Fear Chain */}
        <div className="mb-4 flex justify-center items-center gap-2 text-xl flex-wrap">
          <span>🐭</span>
          <span className="text-castle-stone-light text-sm">&lt;</span>
          <span>🐱</span>
          <span className="text-castle-stone-light text-sm">&lt;</span>
          <span>🐶</span>
          <span className="text-castle-stone-light text-sm">&lt;</span>
          <span>🦁</span>
          <span className="text-castle-stone-light text-sm">&lt;</span>
          <span>🐻</span>
          <span className="text-castle-stone-light text-sm">&lt;</span>
          <span>🐘</span>
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-4">
          <GameBoard
            gridSize={level.gridSize}
            animals={allAnimals}
            holes={level.holes}
            onCellClick={handleCellClick}
            selectedAnimal={selectedAnimal}
            phase={phase}
            onRemoveAnimal={handleRemoveAnimal}
          />
        </div>

        {/* Inventory */}
        <div className="mb-4">
          <AnimalTray
            availableAnimals={level.availableAnimals}
            usedAnimals={usedAnimals}
            selectedAnimal={selectedAnimal}
            onSelectAnimal={setSelectedAnimal}
            disabled={phase === 'play'}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {phase === 'solve' && (
            <button
              onClick={handlePlay}
              disabled={isAnimating}
              className="retro-btn px-8 py-4 bg-castle-green border-castle-green text-parchment uppercase disabled:opacity-50"
            >
              &gt; Play
            </button>
          )}
          
          {phase === 'play' && (
            <button
              onClick={handleReset}
              disabled={isAnimating}
              className="retro-btn px-8 py-4 bg-castle-red border-castle-red text-parchment uppercase disabled:opacity-50"
            >
              &gt; Reset
            </button>
          )}

          <button
            onClick={onBackToEditor}
            className="retro-btn px-8 py-4 bg-castle-blue border-castle-blue text-parchment uppercase"
          >
            &lt; Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
}