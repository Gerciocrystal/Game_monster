import type React from "react";
import type { monsterItem } from "../interfaces/monster";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { LuSwords } from "react-icons/lu";

/** Momentos da luta */
const RenderBattleLog: React.FC<monsterItem> = ({
  battleLog,
  currentRound,
}) => {
  if (!battleLog || currentRound >= battleLog.rounds.length) return null;
  const round = battleLog.rounds[currentRound];
  return (
    <Box
      bg="gray.50"
      p={4}
      borderRadius="md"
      textAlign="center"
      border="1px solid"
      borderColor="gray.200"
      my={4}
    >
      <Flex align="center" justify="center" gap={2}>
        <Icon as={LuSwords} color="red.500" />
        <Text fontWeight="bold">Round {currentRound + 1}</Text>
      </Flex>
      <Text>
        <strong>{round.attacker}</strong> atacou{" "}
        <strong>{round.defender}</strong> causando{" "}
        <strong color="red.500">{round.damage}</strong> de dano!
      </Text>
      <Text>
        {round.defender} agora tem {round.remainingHP} de HP restante.
      </Text>
    </Box>
  );
};
export default RenderBattleLog;
