import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import MyDogsScreen from '@/screens/dogs/MyDogsScreen';
import DogFormScreen from '@/screens/dogs/DogFormScreen';
import DogDetailScreen from '@/screens/dogs/DogDetailScreen';

// Stores
import { useAuthStore } from '@/stores/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '注册' }} />
    </Stack.Navigator>
  );
}

function DogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyDogs"
        component={MyDogsScreen}
        options={{ title: '我的狗狗' }}
      />
      <Stack.Screen
        name="DogForm"
        component={DogFormScreen}
        options={{ title: '狗狗信息' }}
      />
      <Stack.Screen
        name="DogDetail"
        component={DogDetailScreen}
        options={{ title: '狗狗详情' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
      }}
    >
      <Tab.Screen
        name="Dogs"
        component={DogStack}
        options={{ tabBarLabel: '我的' }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth().then(() => setIsChecking(false));
  }, []);

  if (isChecking || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="Auth" component={AuthStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
