import type { monster } from "../interfaces/monster";

// Constants
const MONSTERS_STORAGE_KEY = "monsters";

export const getMonstersFromLocalStorage = (): monster[] => {
  try {
    const json = localStorage.getItem(MONSTERS_STORAGE_KEY);
    return json ? (JSON.parse(json) as monster[]) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const saveMonsterToLocalStorage = (monster: monster): void => {
  try {
    const monsters = getMonstersFromLocalStorage();
    monsters.push(monster);
    localStorage.setItem(MONSTERS_STORAGE_KEY, JSON.stringify(monsters));
  } catch (error) {
    console.error(error);
  }
};

export const updateAllMonstersInLocalStorage = (monsters: monster[]): void => {
  try {
    localStorage.setItem(MONSTERS_STORAGE_KEY, JSON.stringify(monsters));
  } catch (error) {
    console.error(error);
  }
};

export const clearMonstersFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(MONSTERS_STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
};
