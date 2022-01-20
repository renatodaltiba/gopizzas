import styled, { css } from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

export const Container = styled(RectButton)`
  flex: 1;
  max-height: 56px;
  min-height: 56px;

  border-radius: 12px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS.PRIMARY_800};
`;

export const IconGoogle = styled(AntDesign)`
  margin-right: 20px;
`;

export const Wrapper = styled.View`
  align-items: center;

  flex-direction: row;
`;

export const Title = styled.Text`
  font-size: 14px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TEXT};
    color: ${theme.COLORS.TITLE};
  `}
`;
