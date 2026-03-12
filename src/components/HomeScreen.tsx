interface HomeScreenProps {
  onPlay: () => void;
  onLevelEditor: () => void;
  onCustomLevels: () => void;
}

export function HomeScreen({ onPlay, onLevelEditor, onCustomLevels }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-castle-stone-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Castle Title Banner */}
        <div className="mb-8 text-center">
          <div className="inline-block border-4 border-castle-gold bg-castle-brown p-6 mb-4 stone-pattern">
            <div className="text-6xl mb-4">🏰</div>
            <h1 className="text-castle-gold mb-0">CASTLE MOUSE</h1>
          </div>
          <p className="text-parchment text-sm leading-relaxed px-4">
            GUIDE THE MOUSE TO SAFETY!
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 max-w-md mx-auto mb-8">
          <button
            onClick={onPlay}
            className="retro-btn px-8 py-4 bg-castle-green border-castle-green text-parchment uppercase"
          >
            &gt; PLAY GAME
          </button>

          <button
            onClick={onLevelEditor}
            className="retro-btn px-8 py-4 bg-castle-blue border-castle-blue text-parchment uppercase"
          >
            &gt; LEVEL EDITOR
          </button>

          <button
            onClick={onCustomLevels}
            className="retro-btn px-8 py-4 bg-castle-red border-castle-red text-parchment uppercase"
          >
            &gt; CUSTOM LEVELS
          </button>
        </div>

        {/* Info Box */}
        <div className="border-4 border-castle-stone bg-castle-stone-dark p-4 stone-pattern">
          <h3 className="text-castle-gold mb-3 uppercase text-center">How to Play</h3>
          <div className="space-y-2 text-parchment text-xs leading-relaxed">
            <p>&gt; EACH ANIMAL FEARS THE NEXT</p>
            <p>&gt; PLACE ANIMALS ON THE GRID</p>
            <p>&gt; CREATE CHAIN REACTIONS</p>
            <p>&gt; GET MOUSE INTO THE HOLE</p>
          </div>
        </div>

        {/* Animal Chain */}
        <div className="mt-6 flex justify-center items-center gap-2 text-2xl flex-wrap">
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
      </div>
    </div>
  );
}