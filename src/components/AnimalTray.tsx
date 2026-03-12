import { AnimalType, ANIMAL_EMOJIS } from '../types/game';

interface AnimalTrayProps {
  availableAnimals: AnimalType[];
  usedAnimals: string[];
  selectedAnimal: string | null;
  onSelectAnimal: (animal: string | null) => void;
  disabled?: boolean;
}

export function AnimalTray({
  availableAnimals,
  usedAnimals,
  selectedAnimal,
  onSelectAnimal,
  disabled = false
}: AnimalTrayProps) {
  const animalCounts: Record<string, { total: number; used: number }> = {};
  
  availableAnimals.forEach(animal => {
    if (!animalCounts[animal]) {
      animalCounts[animal] = { total: 0, used: 0 };
    }
    animalCounts[animal].total++;
  });

  usedAnimals.forEach(animal => {
    if (animalCounts[animal]) {
      animalCounts[animal].used++;
    }
  });

  return (
    <div className="border-4 border-castle-stone bg-castle-stone-dark p-3 stone-pattern">
      <h3 className="text-castle-gold text-center mb-3 uppercase text-xs">Inventory</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(animalCounts).map(([animal, counts]) => {
          const remaining = counts.total - counts.used;
          const isSelected = selectedAnimal === animal;
          const canSelect = remaining > 0 && !disabled;

          return (
            <button
              key={animal}
              onClick={() => canSelect && onSelectAnimal(isSelected ? null : animal)}
              disabled={!canSelect}
              className={`
                relative w-16 h-16 border-3 flex flex-col items-center justify-center
                transition-all
                ${isSelected 
                  ? 'bg-castle-gold border-castle-gold scale-110' 
                  : canSelect 
                    ? 'bg-castle-brown border-castle-brown-dark hover:scale-105 cursor-pointer' 
                    : 'bg-castle-stone border-castle-stone-dark opacity-50 cursor-not-allowed'}
              `}
              style={{
                boxShadow: isSelected 
                  ? '2px 2px 0px rgba(0,0,0,0.5), inset -1px -1px 0px rgba(0,0,0,0.3), inset 1px 1px 0px rgba(255,255,255,0.3)'
                  : '2px 2px 0px rgba(0,0,0,0.5)'
              }}
            >
              <div className="text-2xl">{ANIMAL_EMOJIS[animal as AnimalType]}</div>
              <div className={`text-xs ${remaining > 0 ? 'text-parchment' : 'text-castle-stone-light'}`}>
                x{remaining}
              </div>
            </button>
          );
        })}
      </div>
      {Object.keys(animalCounts).length === 0 && (
        <p className="text-center text-parchment-dark text-xs">NO ANIMALS AVAILABLE</p>
      )}
    </div>
  );
}
