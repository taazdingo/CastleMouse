import { Level } from '../types/game';
import { CheckCircle2 } from 'lucide-react';

interface LevelSelectionScreenProps {
  levels: Level[];
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  completedLevels: number[];
}

export function LevelSelectionScreen({ 
  levels, 
  onSelectLevel, 
  onBack,
  completedLevels 
}: LevelSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-castle-stone-dark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block border-4 border-castle-gold bg-castle-brown p-4 mb-4 stone-pattern">
            <h1 className="text-castle-gold uppercase">Select Level</h1>
          </div>
          <p className="text-parchment text-xs">
            CHOOSE YOUR CHALLENGE
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {levels.map((level) => {
            const isCompleted = completedLevels.includes(level.id);
            
            return (
              <button
                key={level.id}
                onClick={() => onSelectLevel(level.id)}
                className="relative retro-btn p-6 bg-castle-brown border-castle-brown-dark"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🏰</div>
                  <div className="text-parchment text-xs uppercase">
                    Level {level.id}
                  </div>
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-castle-green border-2 border-parchment p-1">
                      <CheckCircle2 className="w-4 h-4 text-parchment" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="retro-btn px-8 py-3 bg-castle-stone border-castle-stone-dark text-parchment uppercase"
          >
            &lt; BACK
          </button>
        </div>
      </div>
    </div>
  );
}