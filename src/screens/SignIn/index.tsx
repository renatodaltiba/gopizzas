import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { KeyboardAvoidingView, Platform } from "react-native";
import brandImg from "../../assets/brand.png";

import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPassword,
  ForgotPasswordLabel,
  Divider,
} from "./styles";
import { SocialLoginButton } from "../../components/SocialLoginButton";
import { useAuth } from "../../hooks/auth";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    SignInEmailAndPassword,
    isLoading,
    SignInWithGoogle,
    forgotPassword,
  } = useAuth();

  const handleSignIn = async () => {
    SignInEmailAndPassword(email, password);
  };

  const handleSignInWithGoogle = async () => {
    forgotPassword(email);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Content>
          <Brand source={brandImg} />
          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <Input
            placeholder="Password"
            type="secondary"
            secureTextEntry
            onChangeText={setPassword}
          />
          <ForgotPassword onPress={handleSignInWithGoogle}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPassword>

          <Button
            title="Entrar"
            type="secondary"
            isLoading={isLoading}
            onPress={handleSignIn}
          />
          <Divider />
          <SocialLoginButton onPress={SignInWithGoogle} />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
