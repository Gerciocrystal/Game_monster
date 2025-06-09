import {
  Button,
  useDisclosure,
  Box,
  Flex,
  Heading,
  Text,
  Divider,
  Stack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import background from "../assets/background.jpg";
import { useState } from "react";
import AddMonster from "../components/modals/AddMonster";
import type {
  battleResult,
  battleRound,
  monster,
} from "../components/interfaces/monster";
import { simulateBattle } from "../components/logic/simulateBattle";
import CardMonster from "../components/misselation/CardMonster";

export default function BattleSimulator() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [battlePhase, setBattlePhase] = useState<"start" | "battle" | "end">(
    "start"
  );
  const [currentRound, setCurrentRound] = useState(0);
  const [battleLog, setBattleLog] = useState<battleResult | null>(null);
  const toast = useToast();

  const monsterA: monster = {
    name: "Dragão",
    attack: 80,
    defense: 60,
    speed: 70,
    hp: 150,
    image_url: "https://i.imgur.com/JR6oD3a.png",
  };

  const monsterB: monster = {
    name: "Goblin",
    attack: 50,
    defense: 30,
    speed: 65,
    hp: 100,
    image_url: "https://i.imgur.com/3ZQ2W9y.png",
  };

  const startBattle = () => {
    setBattlePhase("start");
    setCurrentRound(0);
    const result = simulateBattle(monsterA, monsterB);
    setBattleLog(result);

    // Simula a progressão da batalha
    setTimeout(() => {
      setBattlePhase("battle");
      if (result.rounds.length > 0) {
        animateBattle(result.rounds, 0);
      }
    }, 2000);
  };

  const animateBattle = (rounds: battleRound[], index: number) => {
    if (index >= rounds.length) {
      setTimeout(() => {
        setBattlePhase("end");
        toast({
          title: "Batalha concluída!",
          description: `${battleLog?.winner.name} venceu a batalha!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }, 1000);
      return;
    }

    setCurrentRound(index);
    setTimeout(() => animateBattle(rounds, index + 1), 1500);
  };

  const renderBattleLog = () => {
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

  return (
    <Box
      p={6}
      backgroundImage={`url(${background})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      height="100dvh"
    >
      <Heading mb={6} textAlign="center" color="purple.600">
        Simulador de Batalha de Monstros
      </Heading>

      <Flex justify="center" gap={6} mb={8}>
        <Button
          colorScheme="blue"
          onClick={startBattle}
          leftIcon={<LuSwords />}
          size="lg"
        >
          Iniciar Batalha
        </Button>
        <Button colorScheme="purple" onClick={onOpen} size="lg">
          Criar Novo Monstro
        </Button>
      </Flex>

      {battlePhase === "start" && (
        <Box textAlign="center" my={12}>
          <Heading size="lg" mb={4}>
            A batalha vai começar!
          </Heading>
          <Text fontSize="xl">
            {monsterA.name} vs {monsterB.name}
          </Text>
          <Flex justify="center" gap={8} mt={8}>
            <CardMonster
              monster={monsterA}
              isOpponent={false}
              battleLog={battleLog}
              battlePhase={battlePhase}
              currentRound={currentRound}
            />

            <Box alignSelf="center">
              <Icon as={LuSwords} boxSize={8} color="red.500" />
            </Box>
            <CardMonster
              monster={monsterB}
              isOpponent={true}
              battleLog={battleLog}
              battlePhase={battlePhase}
              currentRound={currentRound}
            />
          </Flex>
        </Box>
      )}

      {battlePhase === "battle" && battleLog && (
        <Box>
          <Flex justify="center" gap={8} mb={6}>
            <CardMonster
              monster={monsterA}
              isOpponent={false}
              battleLog={battleLog}
              battlePhase={battlePhase}
              currentRound={currentRound}
            />

            <CardMonster
              monster={monsterB}
              isOpponent={true}
              battleLog={battleLog}
              battlePhase={battlePhase}
              currentRound={currentRound}
            />
          </Flex>
          {renderBattleLog()}
        </Box>
      )}

      {battlePhase === "end" && battleLog && (
        <Box textAlign="center" my={12}>
          <Flex justify="center" gap={8} mb={8}>
            <CardMonster
              monster={battleLog.winner}
              isOpponent={false}
              battleLog={battleLog}
              battlePhase={battlePhase}
              currentRound={currentRound}
            />
            <CardMonster
              monster={battleLog.loser}
              isOpponent={true}
              battleLog={battleLog}
              battlePhase={battlePhase}
              currentRound={currentRound}
            />
          </Flex>

          <Box
            bg="yellow.50"
            p={6}
            borderRadius="lg"
            border="2px solid"
            borderColor="yellow.200"
            maxW="600px"
            mx="auto"
          >
            <Flex align="center" justify="center" gap={3} mb={4}>
              <Icon as={FaTrophy} boxSize={8} color="yellow.500" />
              <Heading size="xl" color="yellow.700">
                {battleLog.winner.name} venceu a batalha!
              </Heading>
            </Flex>

            <Divider my={4} />

            <Stack spacing={3} textAlign="left">
              <Text>
                <strong>Total de rounds:</strong> {battleLog.rounds.length}
              </Text>
              <Text>
                <strong>HP restante do vencedor:</strong> {battleLog.winner.hp}
              </Text>
              <Text>
                <strong>Último ataque:</strong>{" "}
                {battleLog.rounds[battleLog.rounds.length - 1].attacker} causou{" "}
                {battleLog.rounds[battleLog.rounds.length - 1].damage} de dano.
              </Text>
            </Stack>
          </Box>
        </Box>
      )}

      {isOpen && <AddMonster isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
}
