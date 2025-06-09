export interface monster {
  name: string;
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  image_url?: string;
}
export interface battleRound {
  attacker: string;
  defender: string;
  damage: number;
  remainingHP: number;
}

export interface battleResult {
  winner: monster;
  loser: monster;
  rounds: battleRound[];
}
