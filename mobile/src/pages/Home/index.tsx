import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import axios from "axios";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import PickerSelect from "react-native-picker-select";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUF, setSelectedUF] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [isLoadding, setIsLoadding] = useState(false);

  const navigation = useNavigation();

  // Buscar todos os estados
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  // Buscar as cidade com base no estado selecionado
  useEffect(() => {
    if (selectedUF === "0") return;
    setIsLoadding(true);

    function loddingCities() {
      axios
        .get<IBGECityResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
        )
        .then((response) => {
          const cityName = response.data.map((city) => city.nome);
          setCities(cityName);
        });
    }

    loddingCities();
    setIsLoadding(false);
  }, [selectedUF]);

  function handleNavigateToPoints() {
    navigation.navigate("Points", { selectedUF, selectedCity });
  }

  console.log(cities);

  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === "ios"}
      style={{ flex: 1 }}
      behavior="padding"
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        imageStyle={{ width: 274, height: 368 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu Marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrar pontos de coletas eficientes.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <PickerSelect
            useNativeAndroidPickerStyle={false}
            placeholder={{
              label: "Selecione um Estado...",
              value: null,
              color: "#34CB79",
            }}
            onValueChange={(value) => setSelectedUF(value)}
            style={{
              ...pickerStyle,
              iconContainer: {
                top: 20,
                right: 10,
              },
            }}
            items={ufs.map((uf) => ({ label: uf, value: uf }))}
            Icon={() => {
              return <Icon name="chevron-down" size={24} color="gray" />;
            }}
          />
          <PickerSelect
            placeholder={{
              label: "Selecione uma cidade...",
              color: "#34CB79",
            }}
            onValueChange={(value) => setSelectedCity(value)}
            style={{
              ...pickerStyle,
              iconContainer: {
                top: 20,
                right: 10,
              },
            }}
            items={cities.map((citie) => ({ label: citie, value: citie }))}
            Icon={() => {
              return <Icon name="chevron-down" size={24} color="gray" />;
            }}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            value={uf}
            onChangeText={setUf}
          />
          <TextInput
            style={styles.input}
            autoCorrect={false}
            placeholder="Digite a Cidade"
            value={city}
            onChangeText={setCity}
          /> */}

          <RectButton
            enabled={selectedCity === "0" && selectedUF === "0" ? false : true}
            style={[styles.button]}
            onPress={handleNavigateToPoints}
          >
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerStyle = {
  inputIOS: {
    color: "34CB79",
    paddingTop: 13,
    paddingBottom: 12,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    color: "#34CB79",
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  placeholderColor: "white",
  underline: { borderTopWidth: 0 },
  icon: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 5,
    borderTopColor: "#00000099",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
};
export default Home;
