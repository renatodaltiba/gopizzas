import React from "react";

import { Container } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import { TouchableOpacityProps } from "react-native";

export function ButtonBack({ ...rest }: TouchableOpacityProps) {
  const { COLORS } = useTheme();

  return (
    <Container {...rest}>
      <MaterialIcons name="arrow-back" size={24} color={COLORS.TITLE} />
    </Container>
  );
}
