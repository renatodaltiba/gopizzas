import React from "react";
import { Alert, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { useAuth } from "../../hooks/auth";
import { ItemSeparator } from "../../components/ItemSeparator";
import { OrderCard, OrderProps } from "../../components/OrderCard";

import { Container, Header, Title } from "./styles";

export function Orders() {
  const [orders, setOrders] = React.useState<OrderProps[]>([]);
  const { user } = useAuth();
  React.useEffect(() => {
    const subscribe = firestore()
      .collection("orders")
      .where("waiter_id", "==", user?.id)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as OrderProps[];
        setOrders(data);
      });

    return () => subscribe();
  }, []);

  function handlePizzaDelivery(id: string) {
    Alert.alert("Pedido", "Confirmar que a pizza foi entregue?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: () => {
          firestore().collection("orders").doc(id).update({
            status: "Entregue",
          });
        },
      },
    ]);
  }
  return (
    <Container>
      <Header>
        <Title>Pedidos feitos</Title>
      </Header>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ index, item }) => (
          <OrderCard
            index={index}
            data={item}
            disabled={item.status === "Entregue"}
            onPress={() => {
              handlePizzaDelivery(item.id);
            }}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 125, paddingHorizontal: 24 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  );
}
