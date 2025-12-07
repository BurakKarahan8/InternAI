import React from "react";
import { StatusBar, Platform } from "react-native";
import { UserProvider } from "./src/components/UserContext"; // UserContext dosyanızı import edin
import AppNavigator from "./src/components/AppNavigator"; // Navigation dosyanız

const App = () => {
  return (
    <>
      {Platform.OS !== "web" && <StatusBar barStyle="light-content" />}
      <UserProvider>
        <StatusBar
          barStyle="light-content" // Yazı rengini ayarlar (light-content veya dark-content)
          backgroundColor="#283958" // Android için arka plan rengi
          translucent={false} // Status bar'ın şeffaf olup olmadığını ayarlar
        />
        <AppNavigator />
      </UserProvider>
    </>
  );
};

export default App;
