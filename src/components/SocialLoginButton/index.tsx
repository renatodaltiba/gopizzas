import React from "react";

import { Container, Title, IconGoogle, Wrapper } from "./styles";

import { RectButtonProps } from "react-native-gesture-handler";

type Props = RectButtonProps;

export function SocialLoginButton({ ...rest }: Props) {
  return (
    <Container {...rest}>
      <Wrapper>
        <IconGoogle name="google" size={24} color="white" />
        <Title>Login com google</Title>
      </Wrapper>
    </Container>
  );
}
