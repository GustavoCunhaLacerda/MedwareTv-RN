import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Platform,
  Button,
  Alert,
} from "react-native";
import Home from "./views/Home";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [CodTv, setCodTv] = useState("0");

  const storeKey = "@medwaretv";
  const setData = async (value: string) => {
    try {
      await AsyncStorage.setItem(storeKey, value);
      setCodTv(value);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(storeKey);
      if (value !== null) {
        console.log(value);
        setCodTv(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const showAlert = () => 
 
    Alert.alert("Medware TV", "Selecione a TV", [
      {
        text: "TV 1",
        onPress: () => {
          setData("1");
        },
      },
      {
        text: "TV 2",
        onPress: () => {
          setData("2");
        },
      },
      {
        text: "TV 3",
        onPress: () => {
          setData("3");
        },
      },

    ]
    );

  return (
    <View>
      <View>
        <Pressable onPress={showAlert}>
          <View
            style={{
              width: "100%",
              height: "100%",
              padding: 10,
            }}
          >
            <Home codTv={CodTv} showAlert={showAlert} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
