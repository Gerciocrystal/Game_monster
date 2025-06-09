import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Icon,
  Image,
} from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

import type { monster, battleResult } from "../interfaces/monster";

interface cardMonster {
  isOpponent: boolean;
  monster: monster;
  battleLog: battleResult | null;
  currentRound: number;
  battlePhase: string;
}

const CardMonster: React.FC<cardMonster> = ({
  monster,
  isOpponent = false,
  battleLog,
  currentRound,
  battlePhase,
}) => {
  const currentHp = battleLog?.rounds[currentRound]
    ? monster.name === battleLog.rounds[currentRound].defender
      ? battleLog.rounds[currentRound].remainingHP
      : monster.name === battleLog.rounds[currentRound].attacker
      ? monster.hp
      : monster.hp
    : monster.hp;
  return (
    <Card
      w="300px"
      border="2px solid"
      borderColor={isOpponent ? "red.200" : "blue.200"}
      boxShadow="lg"
    >
      <CardHeader bg={isOpponent ? "red.50" : "blue.50"} pb={0}>
        <Flex align="center" justify="space-between">
          <Heading size="md">{monster.name}</Heading>
          {battlePhase === "end" && battleLog?.winner.name === monster.name && (
            <Icon as={FaTrophy} color="yellow.500" />
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap={3}>
          <Box textAlign="center">
            <Image
              src={
                "https://t4.ftcdn.net/jpg/14/60/50/89/360_F_1460508965_jsGEgXnXu31S6nSxLGkGQIVxJ0cT6hEU.jpg"
              }
              alt={monster.name}
              borderRadius="md"
              boxSize="150px"
              objectFit="cover"
              mx="auto"
              border="3px solid"
              borderColor={isOpponent ? "red.200" : "blue.200"}
            />
          </Box>

          <Box>
            <Text fontWeight="bold">HP</Text>
            <Progress
              value={(currentHp / monster.hp) * 100}
              colorScheme={currentHp < monster.hp * 0.3 ? "red" : "green"}
              size="lg"
              borderRadius="full"
            />
            <Text textAlign="right">
              {currentHp}/{monster.hp}
            </Text>
          </Box>

          <Flex justify="space-between">
            <Box>
              <Text fontWeight="bold">Ataque</Text>
              <Text>{monster.attack}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Defesa</Text>
              <Text>{monster.defense}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Velocidade</Text>
              <Text>{monster.speed}</Text>
            </Box>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CardMonster;
