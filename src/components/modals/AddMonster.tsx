import React, { useState } from "react";
import type { modal } from "../interfaces/modal";
import {
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useToast,
  Progress,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { monster } from "../interfaces/monster";
import InputField from "../form/InputField";

const MAX_TOTAL_POINTS = 300; // Pontos totais que podem ser distribuídos
const INITIAL_VALUES = {
  name: "",
  attack: 50,
  defense: 50,
  speed: 50,
  hp: 50,
  image_url: "",
};

const AddMonster: React.FC<modal> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [pointsUsed, setPointsUsed] = useState(0);
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<monster>({
    defaultValues: INITIAL_VALUES,
    mode: "onChange",
  });

  const stats = watch();

  React.useEffect(() => {
    const total = stats.attack + stats.defense + stats.speed + stats.hp;
    setPointsUsed(total);
  }, [stats.attack, stats.defense, stats.speed, stats.hp]);

  const handleStatChange = (stat: keyof monster, value: number) => {
    const newTotal = pointsUsed - (stats[stat] as number) + value;

    if (newTotal <= MAX_TOTAL_POINTS) {
      setValue(stat, value);
    } else {
      toast({
        title: "Pontos excedidos",
        description: `Você só pode usar no máximo ${MAX_TOTAL_POINTS} pontos no total.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveMonster: SubmitHandler<monster> = (data: monster) => {
    try {
      console.log(data);
      toast({
        title: "Monstro criado!",
        description: `${data.name} foi registrado com sucesso.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      reset();
      setPreviewImage("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(saveMonster)}>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Flex direction="column" gap={4}>
              <Box textAlign="center">
                <Heading size="lg" color="purple.600" mb={2}>
                  Criar Novo Monstro
                </Heading>
                <Text color="gray.600">
                  Distribua os pontos de atributo cuidadosamente
                </Text>
              </Box>

              <Divider />

              {/* Seção de imagem e nome */}
              <Box flex={2}>
                <InputField
                  register={register}
                  name="name"
                  maxLength={60}
                  error={errors.name}
                  type="text"
                  placeholder="Ex: Dragão Flamejante"
                  required={true}
                  title="Nome do Monstro"
                />
              </Box>
              <Box flex={1}>
                <FormControl>
                  <FormLabel>Avatar do Monstro</FormLabel>
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      borderRadius="md"
                      mb={2}
                      maxH="200px"
                      objectFit="cover"
                    />
                  ) : (
                    <Box
                      border="2px dashed"
                      borderColor="gray.200"
                      p={10}
                      textAlign="center"
                      borderRadius="md"
                      mb={2}
                    >
                      <Text color="gray.500">Nenhuma imagem selecionada</Text>
                    </Box>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image_url", { required: true })}
                    onChange={handleImageChange}
                  />
                </FormControl>
              </Box>

              {/* Barra de progresso dos pontos */}
              <Box bg="gray.100" p={4} borderRadius="md">
                <Flex justify="space-between" mb={2}>
                  <Text fontWeight="bold">Pontos disponíveis</Text>
                  <Text>
                    {MAX_TOTAL_POINTS - pointsUsed} / {MAX_TOTAL_POINTS}
                  </Text>
                </Flex>
                <Progress
                  value={(pointsUsed / MAX_TOTAL_POINTS) * 100}
                  colorScheme={pointsUsed > MAX_TOTAL_POINTS ? "red" : "green"}
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              {/* Seção de atributos */}
              <Box>
                <Heading size="md" mb={4} color="purple.600">
                  Atributos
                </Heading>

                {(["attack", "defense", "speed", "hp"] as const).map((stat) => (
                  <Box key={stat} mb={4}>
                    <Flex justify="space-between" mb={2}>
                      <Text fontWeight="bold" textTransform="capitalize">
                        {stat === "hp"
                          ? "Vida"
                          : stat === "attack"
                          ? "Ataque"
                          : stat === "defense"
                          ? "Defesa"
                          : "Velocidade"}
                      </Text>
                      <Text>{stats[stat]}</Text>
                    </Flex>
                    <Slider
                      value={stats[stat]}
                      min={10}
                      max={100}
                      onChange={(val) => handleStatChange(stat, val)}
                    >
                      <SliderTrack bg="gray.200">
                        <SliderFilledTrack
                          bg={
                            stat === "attack"
                              ? "red.400"
                              : stat === "defense"
                              ? "blue.400"
                              : stat === "speed"
                              ? "yellow.400"
                              : "green.400"
                          }
                        />
                      </SliderTrack>
                      <SliderThumb boxSize={6} />
                    </Slider>
                  </Box>
                ))}
              </Box>

              {/* Botão de submit */}
              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                mt={4}
                isDisabled={
                  pointsUsed > MAX_TOTAL_POINTS || !stats.name || !previewImage
                }
              >
                Criar Monstro
              </Button>
            </Flex>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddMonster;
