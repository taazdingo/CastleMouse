import { EditorLevel } from './LevelEditor';
import { Trash2, Play, Edit } from 'lucide-react';

interface CustomLevelsScreenProps {
  levels: EditorLevel[];
  onBack: () => void;
  onPlayLevel: (level: EditorLevel) => void;
  onEditLevel: (level: EditorLevel) => void;
  onDeleteLevel: (levelId: string) => void;
}

export function CustomLevelsScreen({
  levels,
  onBack,
  onPlayLevel,
  onEditLevel,
  onDeleteLevel
}: CustomLevelsScreenProps) {
  return (
    <div className="min-h-screen bg-castle-stone-dark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block border-4 border-castle-gold bg-castle-brown p-4 mb-4 stone-pattern">
            <h1 className="text-castle-gold uppercase">Custom Levels</h1>
          </div>
          <p className="text-parchment text-xs uppercase">
            {levels.length === 0 
              ? 'No Levels Yet - Create One!' 
              : `${levels.length} Custom Level${levels.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {levels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className="border-4 border-castle-stone bg-castle-stone-dark p-4 stone-pattern"
              >
                <div className="mb-3">
                  <h3 className="text-parchment text-xs uppercase mb-2">{level.name || 'Untitled'}</h3>
                  <div className="flex gap-3 text-xs text-parchment-dark">
                    <span>🕳️ x{level.holes.length}</span>
                    <span>🐾 x{level.fixedAnimals.length}</span>
                    <span>🎒 x{level.availableAnimals.length}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onPlayLevel(level)}
                    className="flex-1 retro-btn px-4 py-2 bg-castle-green border-castle-green text-parchment text-xs uppercase"
                  >
                    &gt; Play
                  </button>
                  <button
                    onClick={() => onEditLevel(level)}
                    className="retro-btn px-3 py-2 bg-castle-blue border-castle-blue text-parchment"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`DELETE "${level.name || 'Untitled'}"?`)) {
                        onDeleteLevel(level.id!);
                      }
                    }}
                    className="retro-btn px-3 py-2 bg-castle-red border-castle-red text-parchment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {levels.length === 0 && (
          <div className="text-center mb-8 border-4 border-castle-stone bg-castle-stone-dark p-8 stone-pattern">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-parchment text-xs uppercase">
              Create Your First Level In The Editor!
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onBack}
            className="retro-btn px-8 py-3 bg-castle-stone border-castle-stone-dark text-parchment uppercase"
          >
            &lt; Back
          </button>
        </div>
      </div>
    </div>
  );
}