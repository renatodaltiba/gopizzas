import React from "react";
import { Alert, Platform, ScrollView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ButtonBack } from "../../components/ButtonBack";
import { Photo } from "../../components/Photo";
import * as ImagePicker from "expo-image-picker";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  InputGroup,
  Label,
  InputGroupHeader,
  MaxCharacters,
} from "./styles";
import { InputPrice } from "../../components/InputPrice";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ProductNavigationProps } from "../../@types/navigation";
import { ProductProps } from "../../components/ProductCard";

type PizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

export function Product() {
  const [photoPath, setPhotoPath] = React.useState("");
  const [image, setImage] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priceP, setPriceP] = React.useState("");
  const [priceM, setPriceM] = React.useState("");
  const [priceG, setPriceG] = React.useState("");

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as ProductNavigationProps;

  const [isLoading, setIsLoading] = React.useState(false);

  const handlePickerImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });

      if (!result.cancelled) {
        const { uri } = result as ImageInfo;

        setImage(uri);
      }
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      return Alert.alert("Oops!", "Por favor, preencha o nome do produto.");
    }
    if (!description.trim()) {
      return Alert.alert(
        "Oops!",
        "Por favor, preencha a descrição do produto."
      );
    }
    if (!image) {
      return Alert.alert("Oops!", "Por favor, selecione uma imagem.");
    }
    if (!priceP || !priceM || !priceG) {
      return Alert.alert("Oops!", "Por favor, preencha os preços.");
    }

    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}`);

    await reference.putFile(image);

    const photo_url = await reference.getDownloadURL();

    firestore()
      .collection("pizzas")
      .add({
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        prices_sizes: {
          p: priceP,
          m: priceM,
          g: priceG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })
      .then(() => {
        navigation.navigate("home");
      })
      .catch((error) => {
        Alert.alert("Oops!", error.message);

        setIsLoading(false);
      });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDelete = async () => {
    firestore()
      .collection("pizzas")
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() => navigation.navigate("home"));
      });
  };

  React.useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((doc) => {
          const { name, description, photo_url, prices_sizes, photo_path } =
            doc.data() as PizzaResponse;

          setName(name);
          setDescription(description);
          setImage(photo_url);
          setPriceP(prices_sizes.p);

          setPriceM(prices_sizes.m);
          setPriceG(prices_sizes.g);
          setPhotoPath(photo_path);
        });
    }
  }, []);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack} />
          <Title>Produtos</Title>
          {id ? (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Deletar</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 35 }} />
          )}
        </Header>

        <Upload>
          <Photo uri={image} />
          {!id && (
            <PickImageButton
              title="Carregar"
              type="secondary"
              onPress={handlePickerImage}
            />
          )}
        </Upload>

        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>
          <InputGroup>
            <InputGroupHeader>
              <Label>Descricão</Label>
              <MaxCharacters>0 de 60 caracteres</MaxCharacters>
            </InputGroupHeader>
            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>
          <InputGroup>
            <Label>Tamanho e preços</Label>
            <InputPrice size="P" onChangeText={setPriceP} value={priceP} />
            <InputPrice size="M" onChangeText={setPriceM} value={priceM} />
            <InputPrice size="G" onChangeText={setPriceG} value={priceG} />
          </InputGroup>

          {!id && (
            <Button
              title="Cadastrar pizza"
              type="primary"
              isLoading={isLoading}
              onPress={handleAdd}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  );
}
