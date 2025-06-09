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

  const tempmonster1 = { ...monster1 };
  const tempmonster2 = { ...monster2 };

  // a) O monstro com a maior velocidade faz o primeiro ataque; se ambas as velocidades
  // forem iguais, o monstro com o maior ataque vai primeiro.
  if (tempmonster1.speed > tempmonster2.speed) {
    attacker = tempmonster1;
    defender = tempmonster2;
  } else if (tempmonster2.speed > tempmonster1.speed) {
    attacker = tempmonster2;
    defender = tempmonster1;
  } else {
    attacker =
      tempmonster1.attack > tempmonster2.attack ? tempmonster1 : tempmonster2;
    defender = attacker === tempmonster1 ? tempmonster2 : tempmonster1;
  }
  // sistema de rounds
  while (tempmonster1.hp > 0 && tempmonster2.hp > 0) {
    // B)Para calcular o dano (damage), subtraia a defesa do ataque (atack - defense); a
    // diferença é o dano; se o ataque for igual ou menor que a defesa, o dano é 1.
    let damage = attacker.attack - defender.defense;
    damage = damage <= 0 ? 1 : damage; //se o damo for menor ou igual a 0 tire 1 caso não some o dano

    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;

    rounds.push({
      attacker: attacker.name,
      defender: defender.name,
      damage,
      remainingHP: defender.hp,
    });
    //inversão de papaies, o atacante vira defensor e o defensor vira atacante a cada round
    if (defender.hp <= 0) break;
    [attacker, defender] = [defender, attacker];
  }
  //Vencedor é aquele que termina a luta com HP maior que 0
  return {
    winner: tempmonster1.hp > 0 ? tempmonster1 : tempmonster2,
    loser: tempmonster1.hp > 0 ? tempmonster2 : tempmonster1,
    rounds,
  };
}
