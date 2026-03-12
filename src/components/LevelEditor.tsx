import { useState } from 'react';
import { Animal, Position, AnimalType, ANIMAL_EMOJIS } from '../types/game';

interface LevelEditorProps {
  onBack: () => void;
  onPreview: (level: EditorLevel) => void;
  onSave: (level: EditorLevel) => void;
  initialLevel?: EditorLevel;
}

export interface EditorLevel {
  gridSize: number;
  fixedAnimals: Animal[];
  holes: Position[];
  availableAnimals: AnimalType[];
  name?: string;
  id?: string;
}

type EditorMode = 'hole' | 'animal' | 'erase';
type EditorAnimalType = AnimalType | null;

export function LevelEditor({ onBack, onPreview, onSave, initialLevel }: LevelEditorProps) {
  const [gridSize] = useState(8);
  const [holes, setHoles] = useState<Position[]>(initialLevel?.holes || []);
  const [fixedAnimals, setFixedAnimals] = useState<Animal[]>(initialLevel?.fixedAnimals || []);
  const [mode, setMode] = useState<EditorMode>('hole');
  const [selectedAnimal, setSelectedAnimal] = useState<EditorAnimalType>(null);
  const [levelName, setLevelName] = useState(initialLevel?.name || '');
  
  const [inventory, setInventory] = useState<Record<AnimalType, number>>(
    initialLevel?.availableAnimals.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<AnimalType, number>) || {
      mouse: 0,
      cat: 0,
      dog: 0,
      lion: 0,
      bear: 0,
      elephant: 0
    }
  );

  const allAnimalTypes: AnimalType[] = ['mouse', 'cat', 'dog', 'lion', 'bear', 'elephant'];

  const handleCellClick = (row: number, col: number) => {
    if (mode === 'hole') {
      const existingHoleIndex = holes.findIndex(h => h.row === row && h.col === col);
      if (existingHoleIndex >= 0) {
        setHoles(holes.filter((_, i) => i !== existingHoleIndex));
      } else {
        setHoles([...holes, { row, col }]);
      }
    } else if (mode === 'animal' && selectedAnimal) {
      const existingAnimalIndex = fixedAnimals.findIndex(
        a => a.position.row === row && a.position.col === col
      );
      
      if (existingAnimalIndex >= 0) {
        const newAnimals = [...fixedAnimals];
        newAnimals[existingAnimalIndex] = {
          type: selectedAnimal,
          position: { row, col },
          id: `fixed-${Date.now()}`
        };
        setFixedAnimals(newAnimals);
      } else {
        setFixedAnimals([
          ...fixedAnimals,
          {
            type: selectedAnimal,
            position: { row, col },
            id: `fixed-${Date.now()}`
          }
        ]);
      }
    } else if (mode === 'erase') {
      setHoles(holes.filter(h => !(h.row === row && h.col === col)));
      setFixedAnimals(fixedAnimals.filter(a => !(a.position.row === row && a.position.col === col)));
    }
  };

  const getAnimalAtPosition = (row: number, col: number) => {
    return fixedAnimals.find(a => a.position.row === row && a.position.col === col);
  };

  const isHole = (row: number, col: number) => {
    return holes.some(h => h.row === row && h.col === col);
  };

  const handlePreview = () => {
    const availableAnimals: AnimalType[] = [];
    Object.entries(inventory).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        availableAnimals.push(type as AnimalType);
      }
    });

    onPreview({
      gridSize,
      fixedAnimals,
      holes,
      availableAnimals,
      name: levelName,
      id: initialLevel?.id
    });
  };

  const handleSave = () => {
    if (!levelName.trim()) {
      alert('PLEASE ENTER A LEVEL NAME!');
      return;
    }
    
    if (holes.length === 0) {
      alert('PLEASE ADD AT LEAST ONE HOLE!');
      return;
    }

    const availableAnimals: AnimalType[] = [];
    Object.entries(inventory).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        availableAnimals.push(type as AnimalType);
      }
    });

    onSave({
      gridSize,
      fixedAnimals,
      holes,
      availableAnimals,
      name: levelName,
      id: initialLevel?.id || `custom-${Date.now()}`
    });
  };

  const incrementInventory = (type: AnimalType) => {
    setInventory({ ...inventory, [type]: inventory[type] + 1 });
  };

  const decrementInventory = (type: AnimalType) => {
    if (inventory[type] > 0) {
      setInventory({ ...inventory, [type]: inventory[type] - 1 });
    }
  };

  return (
    <div className="min-h-screen bg-castle-stone-dark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6">
          <div className="inline-block border-4 border-castle-gold bg-castle-brown p-4 mb-4 stone-pattern">
            <h1 className="text-castle-gold uppercase">Level Editor</h1>
          </div>
          <input
            type="text"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            placeholder="ENTER LEVEL NAME..."
            className="px-4 py-2 bg-castle-stone border-2 border-castle-stone-dark text-parchment placeholder-parchment-dark text-xs uppercase w-full max-w-md"
            style={{ fontFamily: 'Press Start 2P, cursive' }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Grid */}
          <div className="inline-block bg-castle-brown border-4 border-castle-brown-dark p-3 stone-pattern">
            <div
              className="grid gap-0.5 relative"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const hole = isHole(row, col);
                const animal = getAnimalAtPosition(row, col);

                return (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => handleCellClick(row, col)}
                    className={`
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                      flex items-center justify-center
                      border-2 border-castle-stone-dark
                      cursor-pointer
                      ${(row + col) % 2 === 0 ? 'checkerboard-light' : 'checkerboard-dark'}
                      ${hole ? 'bg-castle-stone-dark border-black' : ''}
                      ${mode === 'hole' ? 'hover:brightness-110' : ''}
                      ${mode === 'animal' ? 'hover:brightness-110' : ''}
                      ${mode === 'erase' ? 'hover:brightness-75' : ''}
                    `}
                  >
                    {hole && <div className="text-2xl">🕳️</div>}
                    {animal && <div className="text-3xl">{ANIMAL_EMOJIS[animal.type]}</div>}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-center text-xs text-parchment-dark">
              {mode === 'hole' && '[ CLICK TO ADD/REMOVE HOLES ]'}
              {mode === 'animal' && selectedAnimal && '[ CLICK TO PLACE ANIMAL ]'}
              {mode === 'animal' && !selectedAnimal && '[ SELECT AN ANIMAL FIRST ]'}
              {mode === 'erase' && '[ CLICK TO ERASE ]'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[280px]">
            {/* Mode Selection */}
            <div className="border-4 border-castle-stone bg-castle-stone-dark p-3 stone-pattern">
              <h3 className="text-castle-gold mb-3 uppercase text-xs">Edit Mode</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                <button
                  onClick={() => setMode('hole')}
                  className={`px-4 py-2 border-2 text-xs uppercase ${
                    mode === 'hole'
                      ? 'bg-castle-brown border-castle-brown-dark text-parchment'
                      : 'bg-castle-stone border-castle-stone-dark text-parchment-dark'
                  }`}
                >
                  HOLES
                </button>
                <button
                  onClick={() => setMode('animal')}
                  className={`px-4 py-2 border-2 text-xs uppercase ${
                    mode === 'animal'
                      ? 'bg-castle-brown border-castle-brown-dark text-parchment'
                      : 'bg-castle-stone border-castle-stone-dark text-parchment-dark'
                  }`}
                >
                  ANIMALS
                </button>
                <button
                  onClick={() => setMode('erase')}
                  className={`px-4 py-2 border-2 text-xs uppercase ${
                    mode === 'erase'
                      ? 'bg-castle-brown border-castle-brown-dark text-parchment'
                      : 'bg-castle-stone border-castle-stone-dark text-parchment-dark'
                  }`}
                >
                  ERASE
                </button>
              </div>
            </div>

            {/* Animal Selection */}
            {mode === 'animal' && (
              <div className="border-4 border-castle-stone bg-castle-stone-dark p-3 stone-pattern">
                <h3 className="text-castle-gold mb-3 uppercase text-xs">Fixed Animals</h3>
                <div className="grid grid-cols-3 gap-2">
                  {allAnimalTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedAnimal(type)}
                      className={`p-3 border-2 text-2xl ${
                        selectedAnimal === type
                          ? 'bg-castle-gold border-castle-gold scale-110'
                          : 'bg-castle-brown border-castle-brown-dark'
                      }`}
                    >
                      {ANIMAL_EMOJIS[type]}
                    </button>
                  ))}
                </div>
                <p className="text-parchment-dark text-xs mt-2 leading-relaxed">
                  FIXED ANIMALS START ON BOARD
                </p>
              </div>
            )}

            {/* Inventory */}
            <div className="border-4 border-castle-stone bg-castle-stone-dark p-3 stone-pattern">
              <h3 className="text-castle-gold mb-3 uppercase text-xs">Player Inventory</h3>
              <div className="space-y-2">
                {allAnimalTypes.map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ANIMAL_EMOJIS[type]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementInventory(type)}
                        className="w-6 h-6 bg-castle-red border-2 border-castle-red text-parchment text-xs"
                      >
                        -
                      </button>
                      <span className="text-parchment w-6 text-center text-xs">{inventory[type]}</span>
                      <button
                        onClick={() => incrementInventory(type)}
                        className="w-6 h-6 bg-castle-green border-2 border-castle-green text-parchment text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-parchment-dark text-xs mt-2 leading-relaxed">
                ANIMALS PLAYER CAN PLACE
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              <button
                onClick={handlePreview}
                className="retro-btn px-6 py-3 bg-castle-blue border-castle-blue text-parchment uppercase"
              >
                &gt; Preview
              </button>
              <button
                onClick={handleSave}
                className="retro-btn px-6 py-3 bg-castle-green border-castle-green text-parchment uppercase"
              >
                &gt; Save
              </button>
              <button
                onClick={onBack}
                className="retro-btn px-6 py-3 bg-castle-stone border-castle-stone-dark text-parchment uppercase"
              >
                &lt; Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}