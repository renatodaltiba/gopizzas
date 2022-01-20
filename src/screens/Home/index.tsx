import React, { useState, useCallback } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
  MenuHeader,
  MenuItemsNumber,
  NewProductButton,
  Title,
} from "./styles";
import happyEmoji from "../../assets/happy.png";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { useTheme } from "styled-components/native";
import { Search } from "../../components/Search";
import { ProductCard, ProductProps } from "../../components/ProductCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";
export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState("");
  const { COLORS } = useTheme();

  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection("pizzas")
      .orderBy("name_insensitive")
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then((response) => {
        const data = response.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ProductProps[];

        setPizzas(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleSearch() {
    fetchPizzas(search);
  }

  function handleSearchClear() {
    setSearch("");
    fetchPizzas("");
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? "product" : "order";

    navigation.navigate(route, { id });
  }

  function handleAdd() {
    navigation.navigate("product", {});
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas("");
    }, [])
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, {user.name}</GreetingText>
        </Greeting>

        <TouchableOpacity onPress={signOut}>
          <MaterialIcons name="logout" size={24} color={COLORS.TITLE} />
        </TouchableOpacity>
      </Header>
      <Search
        value={search}
        onChangeText={setSearch}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />
      {user?.isAdmin && (
        <NewProductButton
          title="Cadastrar pizza"
          type="secondary"
          onPress={handleAdd}
        />
      )}
    </Container>
  );
}
