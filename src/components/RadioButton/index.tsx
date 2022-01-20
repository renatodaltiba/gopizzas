import { TouchableOpacityProps } from "react-native";

import { Container, Radio, Selected, RadioButtonProps, Title } from "./styles";

type Props = TouchableOpacityProps &
  RadioButtonProps & {
    title: string;
  };

export function RadioButton({ title, selected = false, ...rest }: Props) {
  return (
    <Container selected={selected} {...rest}>
      <Radio>{selected && <Selected />}</Radio>
      <Title>{title}</Title>
    </Container>
  );
}
