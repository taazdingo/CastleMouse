import { Animal, Position, ANIMAL_EMOJIS } from '../types/game';
import { motion, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface GameBoardProps {
  gridSize: number;
  animals: Animal[];
  holes: Position[];
  onCellClick: (row: number, col: number) => void;
  selectedAnimal: string | null;
  phase: 'solve' | 'play';
  onRemoveAnimal: (id: string) => void;
}

export function GameBoard({
  gridSize,
  animals,
  holes,
  onCellClick,
  selectedAnimal,
  phase,
  onRemoveAnimal
}: GameBoardProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState({ width: 64, height: 64 });

  useEffect(() => {
    const updateCellSize = () => {
      if (gridRef.current) {
        const firstCell = gridRef.current.querySelector('[data-cell]') as HTMLElement;
        if (firstCell) {
          const rect = firstCell.getBoundingClientRect();
          setCellSize({ width: rect.width, height: rect.height });
        }
      }
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  const getAnimalAtPosition = (row: number, col: number) => {
    return animals.find(a => a.position.row === row && a.position.col === col);
  };

  const isHole = (row: number, col: number) => {
    return holes.some(h => h.row === row && h.col === col);
  };

  const handleCellClick = (row: number, col: number) => {
    if (phase === 'solve') {
      const animal = getAnimalAtPosition(row, col);
      if (animal && !animal.id.startsWith('fixed-')) {
        onRemoveAnimal(animal.id);
        return;
      }
    }
    onCellClick(row, col);
  };

  const getCellPosition = (row: number, col: number) => {
    const gap = 2;
    return {
      x: col * (cellSize.width + gap),
      y: row * (cellSize.height + gap)
    };
  };

  return (
    <div className="inline-block bg-castle-brown border-4 border-castle-brown-dark p-3 stone-pattern">
      <div 
        ref={gridRef}
        className="grid gap-0.5 relative"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const hole = isHole(row, col);
          
          return (
            <div
              key={`${row}-${col}`}
              data-cell
              onClick={() => handleCellClick(row, col)}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                flex items-center justify-center
                border-2 border-castle-stone-dark
                ${(row + col) % 2 === 0 ? 'checkerboard-light' : 'checkerboard-dark'}
                ${hole ? 'bg-castle-stone-dark border-black' : ''}
                ${selectedAnimal && phase === 'solve' && !getAnimalAtPosition(row, col) && !hole ? 'hover:brightness-110 cursor-pointer' : ''}
                ${phase === 'solve' ? 'cursor-pointer' : ''}
              `}
            >
              {hole && (
                <div className="text-2xl">🕳️</div>
              )}
            </div>
          );
        })}
        
        {/* Animals */}
        <AnimatePresence>
          {animals.map((animal) => {
            const isFixed = animal.id.startsWith('fixed-');
            const isMouse = animal.type === 'mouse';
            const mouseInHole = isMouse && isHole(animal.position.row, animal.position.col);
            const pos = getCellPosition(animal.position.row, animal.position.col);
            
            return (
              <motion.div
                key={animal.id}
                initial={phase === 'solve' ? { scale: 0, x: pos.x, y: pos.y } : false}
                animate={{ 
                  scale: mouseInHole ? 0.75 : 1,
                  x: pos.x,
                  y: pos.y
                }}
                exit={{ scale: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.5
                }}
                onClick={() => handleCellClick(animal.position.row, animal.position.col)}
                className={`
                  absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                  flex items-center justify-center
                  pointer-events-auto
                  ${!isFixed && phase === 'solve' ? 'cursor-pointer' : ''}
                `}
                style={{
                  left: 0,
                  top: 0,
                  zIndex: 10
                }}
              >
                <div className={`text-3xl relative ${isFixed ? '' : 'hover:scale-110'}`}>
                  {ANIMAL_EMOJIS[animal.type]}
                  {isFixed && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-castle-red border border-parchment blink" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-2 text-center text-xs text-parchment-dark">
        {phase === 'solve' && selectedAnimal && '[ CLICK TO PLACE ]'}
        {phase === 'solve' && !selectedAnimal && '[ CLICK ANIMALS TO REMOVE ]'}
        {phase === 'play' && '[ SIMULATION RUNNING... ]'}
      </div>
    </div>
  );
}