import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Bottom Tabs import
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // İkonlar için import

// Ekranları import et
import LoginPage from '../components/LoginPage';
import MainScreen from '../components/MainScreen'; // Bu bizim Stajlar listesi ekranımız
import SignUpPage from '../components/SingUpPage';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from '../components/ProfileScreen'; // Yeni eklenen profil ekranı
import SettingsScreen from '../components/SettingsScreen'; // Yeni eklenen ayarlar ekranı

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator(); // Tab Navigator oluşturucu

// --- Bottom Tab Navigator Tanımı ---
function MainBottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Her tab ekranında ayrıca header istemiyoruz (MainScreen'de kendi header'ı var)
        tabBarIcon: ({ focused, color, size }) => { // İkonları ayarlama
          let iconName;
          let IconComponent = Ionicons; // Varsayılan ikon kütüphanesi

          if (route.name === 'Stajlar') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Profilim') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Ayarlar') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // İkonu render et
          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea', // Aktif sekme rengi
        tabBarInactiveTintColor: 'gray', // Pasif sekme rengi
        tabBarStyle: { // Tab bar stil ayarları
          backgroundColor: '#ffffff', // Arka plan rengi
          // paddingBottom: 5,
          // height: 60,
        },
        // tabBarLabelStyle: { // Yazı stilleri (isteğe bağlı)
        //   fontSize: 12,
        // },
      })}
    >
      {/* Tab Ekranları */}
      <Tab.Screen name="Stajlar" component={MainScreen} />
      <Tab.Screen name="Profilim" component={ProfileScreen} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// --- Drawer Navigator Tanımı (İçinde Tab Navigator'ı barındıracak) ---
function MainAppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
          drawerPosition: 'right',
          headerShown: false, // Drawer'ın kendi header'ını yine istemiyoruz
          drawerStyle: {
             backgroundColor: '#f4f4f4',
             width: 240,
             marginTop: Platform.OS === 'android' ? 0 : 20,
          }
      }}
    >
      {/* Drawer'ın ana ekranı olarak Tab Navigator'ı belirliyoruz */}
      <Drawer.Screen
         name="MainTabs" // Drawer listesindeki ismi
         component={MainBottomTabNavigator} // Yukarıda tanımladığımız Tab Navigator component'i
         options={{ title: 'Uygulama' }} // Drawer menüsünde görünecek başlık
      />
      {/* İleride Drawer'a özel başka ekranlar eklenirse buraya gelebilir */}
      {/* Örn: <Drawer.Screen name="Hakkinda" component={AboutScreen} /> */}
    </Drawer.Navigator>
  );
}

// --- Ana Stack Navigator (Değişiklik yok) ---
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        {/* Giriş yapınca Drawer'a (ve dolayısıyla içindeki Tabs'a) yönlendir */}
        <Stack.Screen
          name="MainApp" // Bu isim aynı kalıyor
          component={MainAppDrawer} // Drawer'ı gösteren component hala bu
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;