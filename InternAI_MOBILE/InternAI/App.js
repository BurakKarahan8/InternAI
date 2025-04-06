import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./src/components/AppNavigator"; // Navigation dosyanız

const App = () => {
  return (
    <>
      {/* Status Bar Ayarları */}
      <StatusBar
        barStyle="light-content" // Yazı rengini ayarlar (light-content veya dark-content)
        backgroundColor="#283958" // Android için arka plan rengi
        translucent={false} // Status bar'ın şeffaf olup olmadığını ayarlar
      />
      {/* Navigation */}
      <AppNavigator />
    </>
  );
};

export default App;
