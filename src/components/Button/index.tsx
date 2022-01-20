import React from "react";

import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Title, Load, TypeProps } from "./styles";

type Props = RectButtonProps & {
  title: string;
  type: TypeProps;
  isLoading?: boolean;
};

export function Button({ title = "primary", type, isLoading, ...rest }: Props) {
  return (
    <Container type={type} enabled={!isLoading} {...rest}>
      {isLoading ? <Load /> : <Title>{title}</Title>}
    </Container>
  );
}
