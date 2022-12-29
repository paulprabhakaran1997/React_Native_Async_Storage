import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Login from './src/views/Login';
import Home from './src/views/Home';
import Signup from './src/views/Signup';
import { DataProvider } from './src/context/DataContext';

const Stack = createStackNavigator();


const App = () =>{

  const [userName , setUserName] = useState("Paul S")

  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          // screenOptions={{
          //   header: () => null
          // }}
          screenOptions={{
            headerShown : false
          }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{ User: 'Paul' }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options = {{
              headerShown : true
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  )
}

export default App;
