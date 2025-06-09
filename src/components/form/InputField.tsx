import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import type { inputField } from "../interfaces/input";

const InputField: React.FC<inputField> = ({
  name,
  title,
  type,
  register,
  error,
  placeholder,
  required,
  maxLength,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <FormControl isInvalid={error}>
      <FormLabel>{title}</FormLabel>

      <Input
        height="50px"
        minW="220px"
        step="any"
        type={type}
        maxLength={maxLength || 50}
        placeholder={placeholder}
        {...register(name, {
          required: required ? "Campo Necessario" : false,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        transition="background-color 0.3s, border-color 0.3s, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
        _hover={{
          bg: isHovered ? "gray.100" : "white",
          transform: "scale(1.01)",
          boxShadow: "base",
        }}
        _focus={{
          borderColor: isFocused ? "gray.100" : "gray.300",
        }}
      />

      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
