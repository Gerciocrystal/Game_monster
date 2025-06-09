import type { monster } from "../interfaces/monster";
import type { battleResult, battleRound } from "../interfaces/monster";

/** Loigca da luta */
export function simulateBattle(
  monster1: monster,
  monster2: monster
): battleResult {
  const rounds: battleRound[] = [];
  let attacker: monster;
  let defender: monster;

  const m1 = { ...monster1 };
  const m2 = { ...monster2 };

  if (m1.speed > m2.speed) {
    attacker = m1;
    defender = m2;
  } else if (m2.speed > m1.speed) {
    attacker = m2;
    defender = m1;
  } else {
    attacker = m1.attack > m2.attack ? m1 : m2;
    defender = attacker === m1 ? m2 : m1;
  }

  while (m1.hp > 0 && m2.hp > 0) {
    let damage = attacker.attack - defender.defense;
    damage = damage <= 0 ? 1 : damage;

    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;

    rounds.push({
      attacker: attacker.name,
      defender: defender.name,
      damage,
      remainingHP: defender.hp,
    });

    if (defender.hp <= 0) break;
    [attacker, defender] = [defender, attacker];
  }
  //Vencedor é aquele que termina a luta com mais HP
  return {
    winner: m1.hp > 0 ? m1 : m2,
    loser: m1.hp > 0 ? m2 : m1,
    rounds,
  };
}
