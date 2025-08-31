import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MacBookAir39 from '../home1/MacBookAir39';
import Chat from '../chat/Chat';
import SellPopup from '../chat/SellPopup';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={MacBookAir39}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Chat" 
          component={Chat}
          options={{ title: 'Messages' }}
        />
        <Stack.Screen 
          name="SellPopup" 
          component={SellPopup}
          options={{ title: 'Create Listing' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
