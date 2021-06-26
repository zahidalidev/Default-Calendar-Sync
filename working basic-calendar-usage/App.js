import React from 'react';
import { LogBox } from "react-native"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// screens
import HomeScreen from './app/screens/HomeScreen';
import CreateEventScreen from './app/screens/CreateEventScreen';

LogBox.ignoreAllLogs()

const Stack = createStackNavigator();

export default function App() {

  // navigation animation configuration
  const config = {
    animation: 'timing',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        transitionSpec: {
          open: config,
          close: config,
        },
      }} initialRouteName="HomeScreen" >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
