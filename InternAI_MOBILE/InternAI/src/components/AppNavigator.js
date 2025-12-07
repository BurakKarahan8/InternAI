// src/navigation/AppNavigator.js (veya component ise components klasöründe)
import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Ekranları import et
import LoginPage from '../components/LoginPage';
import MainScreen from '../components/MainScreen';
import SignUpPage from '../components/SingUpPage';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from '../components/ProfileScreen';
import SettingsScreen from '../components/SettingsScreen';
import JobApplicationScreen from '../components/JobApplicationScreen';
import MyApplicationsScreen from '../components/MyApplicationsScreen';
import AiAssistantScreen from '../components/AiAssistantScreen';
import CvAnalysisScreen from '../components/CvAnalysisScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// --- Bottom Tab Navigator Tanımı ---
function MainBottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = Ionicons;

          if (route.name === 'Stajlar') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Başvurularım') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'AI Asistan') {
            IconComponent = MaterialCommunityIcons; 
            iconName = focused ? 'robot-happy' : 'robot-happy-outline';
          } else if (route.name === 'Profilim') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Ayarlar') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'CV Analizi') { 
            iconName = focused ? 'bar-chart' : 'bar-chart-outline'; 
          }
          // Android için size'ı biraz küçültebiliriz, iOS'ta default iyi duruyor genelde
          const iconSize = Platform.OS === 'android' ? size * 0.9 : size;
          return <IconComponent name={iconName} size={size} color={color} />;

        },

        tabBarActiveTintColor: '#82E0AA',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1D2B4A', // Koyu tema için
          borderTopColor: '#3A506B', // Hafif bir ayırıcı
          // paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          // height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarLabelStyle: {
          // fontSize: 11,
          // paddingBottom: Platform.OS === 'ios' ? 0 : 5,
        },
      })}
    >
      <Tab.Screen name="Stajlar" component={MainScreen} options={{ title: "Stajlar" }} />
      <Tab.Screen name="Başvurularım" component={MyApplicationsScreen} options={{ title: "Başvurularım" }} />
      <Tab.Screen name="AI Asistan" component={AiAssistantScreen} options={{ title: "AI Asistan" }} />
      <Tab.Screen name="CV Analizi" component={CvAnalysisScreen} options={{ title: "CV Analizi" }} />
      <Tab.Screen name="Profilim" component={ProfileScreen} options={{ title: "Profilim" }} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} options={{ title: "Ayarlar" }} />
    </Tab.Navigator>
  );
}

// --- Drawer Navigator Tanımı (Değişiklik yok) ---
function MainAppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#f4f4f4',
          width: 240,
        }
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainBottomTabNavigator}
        options={{ title: 'Uygulama' }}
      />
    </Drawer.Navigator>
  );
}

// --- Ana Stack Navigator (Değişiklik yok) ---
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="MainApp" component={MainAppDrawer} />
        <Stack.Screen name="JobApplicationScreen" component={JobApplicationScreen} />
        <Stack.Screen name="CvAnalysis" component={CvAnalysisScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;