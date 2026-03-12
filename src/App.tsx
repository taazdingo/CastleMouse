import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { AnimalTray } from './components/AnimalTray';
import { Animal, AnimalType } from './types/game';
import { runSimulation, SimulationState } from './utils/gameEngine';
import './styles/globals.css';
import { VictoryModal } from './components/VictoryModal';
import { HomeScreen } from './components/HomeScreen';
import { LevelSelectionScreen } from './components/LevelSelectionScreen';
import { LevelEditor, EditorLevel } from './components/LevelEditor';
import { LevelPreview } from './components/LevelPreview';
import { CustomLevelsScreen } from './components/CustomLevelsScreen';
import { LEVELS } from './data/levels';
import { loadCustomLevels, addCustomLevel, deleteCustomLevel } from './utils/levelStorage';

type Screen = 'home' | 'levelSelect' | 'game' | 'editor' | 'preview' | 'customLevels' | 'customGame';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [customLevels, setCustomLevels] = useState<EditorLevel[]>(loadCustomLevels());
  const [editorLevel, setEditorLevel] = useState<EditorLevel | undefined>(undefined);
  const [previewLevel, setPreviewLevel] = useState<EditorLevel | undefined>(undefined);
  const [currentCustomLevel, setCurrentCustomLevel] = useState<EditorLevel | undefined>(undefined);
  
  const level = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  
  const [placedAnimals, setPlacedAnimals] = useState<Animal[]>([]);
  const [phase, setPhase] = useState<'solve' | 'play'>('solve');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [usedAnimals, setUsedAnimals] = useState<string[]>([]);
  const [currentAnimals, setCurrentAnimals] = useState<Animal[]>([]);
  const [isWon, setIsWon] = useState(false);

  const activeLevel = screen === 'customGame' && currentCustomLevel ? currentCustomLevel : level;
  const allAnimals = phase === 'solve' 
    ? [...activeLevel.fixedAnimals, ...placedAnimals]
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
    // Remove the animal from usedAnimals to return it to inventory
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
    
    const initialAnimals = [...activeLevel.fixedAnimals, ...placedAnimals];
    setCurrentAnimals(initialAnimals);
    
    runSimulation(
      initialAnimals,
      activeLevel.gridSize,
      activeLevel.holes,
      (state: SimulationState) => {
        setCurrentAnimals(state.animals);
        
        if (state.completed) {
          setIsAnimating(false);
          if (state.won) {
            setIsWon(true);
            if (screen === 'game' && !completedLevels.includes(currentLevelId)) {
              setCompletedLevels([...completedLevels, currentLevelId]);
            }
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
    setCurrentAnimals([]);
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    handleReset();
    setScreen('game');
  };

  const handleBackToMenu = () => {
    handleReset();
    setEditorLevel(undefined);
    setPreviewLevel(undefined);
    setCurrentCustomLevel(undefined);
    setScreen('home');
  };

  const handleBackToLevelSelect = () => {
    handleReset();
    setScreen('levelSelect');
  };

  const handleNextLevel = () => {
    const nextLevel = LEVELS.find(l => l.id === currentLevelId + 1);
    if (nextLevel) {
      setCurrentLevelId(nextLevel.id);
      handleReset();
    }
  };

  // Editor handlers
  const handleOpenEditor = () => {
    setEditorLevel(undefined);
    setScreen('editor');
  };

  const handleEditCustomLevel = (level: EditorLevel) => {
    setEditorLevel(level);
    setScreen('editor');
  };

  const handlePreviewLevel = (level: EditorLevel) => {
    setPreviewLevel(level);
    setEditorLevel(level); // Preserve the level for when returning to editor
    setScreen('preview');
  };

  const handleBackToEditor = () => {
    setScreen('editor');
  };

  const handleSaveLevel = (level: EditorLevel) => {
    const updatedLevels = addCustomLevel(level);
    setCustomLevels(updatedLevels);
    alert(`Level "${level.name}" saved successfully!`);
  };

  // Custom levels handlers
  const handleOpenCustomLevels = () => {
    setCustomLevels(loadCustomLevels());
    setScreen('customLevels');
  };

  const handlePlayCustomLevel = (level: EditorLevel) => {
    setCurrentCustomLevel(level);
    handleReset();
    setScreen('customGame');
  };

  const handleDeleteCustomLevel = (levelId: string) => {
    const updatedLevels = deleteCustomLevel(levelId);
    setCustomLevels(updatedLevels);
  };

  const handleBackToCustomLevels = () => {
    handleReset();
    setCurrentCustomLevel(undefined);
    setCustomLevels(loadCustomLevels());
    setScreen('customLevels');
  };

  // Home Screen
  if (screen === 'home') {
    return (
      <HomeScreen 
        onPlay={() => setScreen('levelSelect')}
        onLevelEditor={handleOpenEditor}
        onCustomLevels={handleOpenCustomLevels}
      />
    );
  }

  // Level Selection Screen
  if (screen === 'levelSelect') {
    return (
      <LevelSelectionScreen
        levels={LEVELS}
        onSelectLevel={handleSelectLevel}
        onBack={handleBackToMenu}
        completedLevels={completedLevels}
      />
    );
  }

  // Level Editor
  if (screen === 'editor') {
    return (
      <LevelEditor
        onBack={handleBackToMenu}
        onPreview={handlePreviewLevel}
        onSave={handleSaveLevel}
        initialLevel={editorLevel}
      />
    );
  }

  // Level Preview
  if (screen === 'preview' && previewLevel) {
    return (
      <LevelPreview
        level={previewLevel}
        onBackToEditor={handleBackToEditor}
      />
    );
  }

  // Custom Levels Screen
  if (screen === 'customLevels') {
    return (
      <CustomLevelsScreen
        levels={customLevels}
        onBack={handleBackToMenu}
        onPlayLevel={handlePlayCustomLevel}
        onEditLevel={handleEditCustomLevel}
        onDeleteLevel={handleDeleteCustomLevel}
      />
    );
  }

  // Game Screen (both regular and custom levels)
  return (
    <div className="min-h-screen bg-castle-stone-dark flex items-center justify-center p-4">
      <VictoryModal 
        isOpen={isWon} 
        onClose={handleReset}
        onNextLevel={handleNextLevel}
        hasNextLevel={screen === 'game' && currentLevelId < LEVELS.length}
      />
      
      <div className="max-w-3xl w-full">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <button
              onClick={screen === 'customGame' ? handleBackToCustomLevels : handleBackToLevelSelect}
              className="text-parchment-dark hover:text-parchment text-xs uppercase"
            >
              &lt; {screen === 'customGame' ? 'Custom' : 'Levels'}
            </button>
            <div className="border-4 border-castle-gold bg-castle-brown px-4 py-2 stone-pattern">
              <h1 className="text-castle-gold uppercase text-sm">
                {screen === 'customGame' 
                  ? `${currentCustomLevel?.name || 'Custom'}` 
                  : `Level ${level.id}`}
              </h1>
            </div>
          </div>
        </div>

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
            gridSize={activeLevel.gridSize}
            animals={allAnimals}
            holes={activeLevel.holes}
            onCellClick={handleCellClick}
            selectedAnimal={selectedAnimal}
            phase={phase}
            onRemoveAnimal={handleRemoveAnimal}
          />
        </div>

        {/* Inventory */}
        <div className="mb-4">
          <AnimalTray
            availableAnimals={activeLevel.availableAnimals}
            usedAnimals={usedAnimals}
            selectedAnimal={selectedAnimal}
            onSelectAnimal={setSelectedAnimal}
            disabled={phase === 'play'}
          />
        </div>

        {/* Play/Reset Button */}
        <div className="flex justify-center">
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
        </div>
      </div>
    </div>
  );
}

export default App;