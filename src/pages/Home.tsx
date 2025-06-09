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
  Select,
  Grid,
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
import RenderBattleLog from "../components/misselation/RenderBattleLog";
import { getMonstersFromLocalStorage } from "../components/logic/handleSave";

export default function BattleSimulator() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [battlePhase, setBattlePhase] = useState<
    "selection" | "start" | "battle" | "end"
  >("selection");
  const [currentRound, setCurrentRound] = useState(0);
  const [battleLog, setBattleLog] = useState<battleResult | null>(null);
  const [selectedMonsters, setSelectedMonsters] = useState<{
    monster1: monster | null;
    monster2: monster | null;
  }>({ monster1: null, monster2: null });
  const toast = useToast();

  const monsters = getMonstersFromLocalStorage();

  const handleMonsterSelect = (monsterId: string, position: 1 | 2) => {
    const selected = monsters.find((m) => m.name === monsterId);
    if (selected) {
      setSelectedMonsters((prev) => ({
        ...prev,
        [`monster${position}`]: selected,
      }));
    }
  };

  const startBattle = () => {
    if (!selectedMonsters.monster1 || !selectedMonsters.monster2) {
      toast({
        title: "Selecione dois monstros",
        description:
          "Você precisa selecionar dois monstros para começar a batalha",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setBattlePhase("start");
    setCurrentRound(0);
    const result = simulateBattle(
      selectedMonsters.monster1,
      selectedMonsters.monster2
    );
    setBattleLog(result);

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

  const resetSelection = () => {
    setSelectedMonsters({ monster1: null, monster2: null });
    setBattlePhase("selection");
    setBattleLog(null);
  };

  return (
    <Box
      p={6}
      backgroundImage={`url(${background})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minHeight="100dvh"
    >
      <Heading mb={6} textAlign="center" color="purple.600">
        Simulador de Batalha de Monstros
      </Heading>

      {battlePhase === "selection" && (
        <Box maxW="800px" mx="auto" bg="whiteAlpha.800" p={6} borderRadius="lg">
          <Heading size="md" mb={6} textAlign="center">
            Selecione os monstros para a batalha
          </Heading>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Monstro 1
              </Text>
              <Select
                placeholder="Selecione um monstro"
                onChange={(e) => handleMonsterSelect(e.target.value, 1)}
              >
                {monsters.map((monster) => (
                  <option key={monster.name} value={monster.name}>
                    {monster.name}
                  </option>
                ))}
              </Select>
              {selectedMonsters.monster1 && (
                <Box mt={4}>
                  <CardMonster
                    currentRound={currentRound}
                    battleLog={battleLog}
                    battlePhase={battlePhase}
                    monster={selectedMonsters.monster1}
                    isOpponent={false}
                  />
                </Box>
              )}
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Monstro 2
              </Text>
              <Select
                placeholder="Selecione um monstro"
                onChange={(e) => handleMonsterSelect(e.target.value, 2)}
              >
                {monsters.map((monster) => (
                  <option
                    key={monster.name}
                    value={monster.name}
                    disabled={monster.name === selectedMonsters.monster1?.name}
                  >
                    {monster.name}
                  </option>
                ))}
              </Select>
              {selectedMonsters.monster2 && (
                <Box mt={4}>
                  <CardMonster
                    currentRound={currentRound}
                    battleLog={battleLog}
                    battlePhase={battlePhase}
                    monster={selectedMonsters.monster2}
                    isOpponent={true}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          <Flex justify="center" gap={6}>
            <Button
              colorScheme="blue"
              onClick={startBattle}
              leftIcon={<LuSwords />}
              size="lg"
              isDisabled={
                !selectedMonsters.monster1 || !selectedMonsters.monster2
              }
            >
              Iniciar Batalha
            </Button>
            <Button colorScheme="purple" onClick={onOpen} size="lg">
              Criar Novo Monstro
            </Button>
          </Flex>
        </Box>
      )}

      {battlePhase === "start" &&
        selectedMonsters.monster1 &&
        selectedMonsters.monster2 && (
          <Box textAlign="center" my={12}>
            <Heading size="lg" mb={4}>
              A batalha vai começar!
            </Heading>
            <Text fontSize="xl">
              {selectedMonsters.monster1.name} vs{" "}
              {selectedMonsters.monster2.name}
            </Text>
            <Flex justify="center" gap={8} mt={8}>
              <CardMonster
                monster={selectedMonsters.monster1}
                isOpponent={false}
                battleLog={battleLog}
                battlePhase={battlePhase}
                currentRound={currentRound}
              />

              <Box alignSelf="center">
                <Icon as={LuSwords} boxSize={8} color="red.500" />
              </Box>
              <CardMonster
                monster={selectedMonsters.monster2}
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
          <RenderBattleLog battleLog={battleLog} currentRound={currentRound} />
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

            <Button mt={6} colorScheme="blue" onClick={resetSelection}>
              Nova Batalha
            </Button>
          </Box>
        </Box>
      )}

      {isOpen && <AddMonster isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
}
