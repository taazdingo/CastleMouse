interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
}

export function VictoryModal({ isOpen, onClose, onNextLevel, hasNextLevel }: VictoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="border-4 border-castle-gold bg-castle-brown p-8 max-w-md w-full stone-pattern">
        <div className="text-center">
          <div className="text-6xl mb-4 blink">🎉</div>
          <h2 className="text-castle-gold mb-4 uppercase">Victory!</h2>
          <p className="text-parchment text-xs mb-6 leading-relaxed">
            THE MOUSE MADE IT SAFELY INTO THE HOLE!
          </p>
          <div className="flex flex-col gap-3">
            {hasNextLevel && onNextLevel && (
              <button
                onClick={onNextLevel}
                className="retro-btn px-6 py-3 bg-castle-green border-castle-green text-parchment uppercase"
              >
                &gt; NEXT LEVEL
              </button>
            )}
            <button
              onClick={onClose}
              className="retro-btn px-6 py-3 bg-castle-blue border-castle-blue text-parchment uppercase"
            >
              &gt; RETRY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}