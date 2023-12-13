import { StyleSheet, Text, View } from "react-native";
import Home from "./views/Home";

export default function App() {
  return <Home />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100vw",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
