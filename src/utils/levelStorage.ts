import { EditorLevel } from '../components/LevelEditor';

const STORAGE_KEY = 'castle-mouse-custom-levels';

export function saveCustomLevels(levels: EditorLevel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
  } catch (error) {
    console.error('Failed to save custom levels:', error);
  }
}

export function loadCustomLevels(): EditorLevel[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load custom levels:', error);
    return [];
  }
}

export function addCustomLevel(level: EditorLevel): EditorLevel[] {
  const levels = loadCustomLevels();
  const existingIndex = levels.findIndex(l => l.id === level.id);
  
  if (existingIndex >= 0) {
    // Update existing level
    levels[existingIndex] = level;
  } else {
    // Add new level
    levels.push(level);
  }
  
  saveCustomLevels(levels);
  return levels;
}

export function deleteCustomLevel(levelId: string): EditorLevel[] {
  const levels = loadCustomLevels();
  const filtered = levels.filter(l => l.id !== levelId);
  saveCustomLevels(filtered);
  return filtered;
}
