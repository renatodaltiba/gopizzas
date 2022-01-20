import React, { useEffect } from "react";

import { Alert, Platform, ScrollView } from "react-native";
import { ButtonBack } from "../../components/ButtonBack";
import { RadioButton } from "../../components/RadioButton";
import {
  Container,
  Header,
  Photo,
  Sizes,
  Form,
  FormRow,
  InputGroup,
  Label,
  Title,
  Price,
  ContentScroll,
} from "./styles";
import { PIZZA_TYPES } from "../../utils/pizzaTypes";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import {
  OrderNavigationProps,
  ProductNavigationProps,
} from "../../@types/navigation";
import { ProductProps } from "../../components/ProductCard";
import { useAuth } from "../../hooks/auth";

type PizzaResponse = ProductProps & {
  prices_sizes: {
    [key: string]: number;
  };
};

export function Order() {
  const [size, setSize] = React.useState("");
  const [pizza, setPizza] = React.useState<PizzaResponse>({} as PizzaResponse);
  const [quantity, setQuantity] = React.useState(0);
  const [tableNumber, setTableNumber] = React.useState("");
  const [sendingOrder, setSendingOrder] = React.useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data() as PizzaResponse;
          setPizza(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  const amount = size ? pizza.prices_sizes[size] * quantity : "0,00";

  function handleOrder() {
    if (!size) {
      return Alert.alert("Selecione o tamanho da pizza");
    }

    if (!tableNumber) {
      return Alert.alert("Informe o número da mesa");
    }
    if (!quantity) {
      return Alert.alert("Informe a quantidade");
    }

    setSendingOrder(true);

    firestore()
      .collection("orders")
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: tableNumber,
        status: "Preparando",
        waiter_id: user?.id,
        image: pizza.photo_url,
      })
      .then(() => {
        navigation.navigate("home");
      })
      .catch((error) => {
        console.log(error);
        setSendingOrder(false);
      });
  }

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack
            onPress={() => navigation.goBack()}
            style={{
              marginBottom: 108,
            }}
          />
        </Header>

        <Photo source={{ uri: pizza.photo_url }} />
        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {PIZZA_TYPES.map((item) => {
              return (
                <RadioButton
                  key={item.id}
                  title={item.name}
                  selected={size === item.id}
                  onPress={() => setSize(item.id)}
                />
              );
            })}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType="numeric" onChangeText={setTableNumber} />
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ {amount}</Price>

          <Button
            onPress={handleOrder}
            isLoading={sendingOrder}
            title="Confirmar pedido"
            type="secondary"
          />
        </Form>
      </ContentScroll>
    </Container>
  );
}
