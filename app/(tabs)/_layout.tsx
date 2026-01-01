import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  const primaryBlue = '#3498db'; // Biru Utama
  const pastelBackground = '#EBF5FF'; //bg all tab

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryBlue,
        tabBarInactiveTintColor: '#bdc3c7',
        headerShown: false,
        sceneContainerStyle: { backgroundColor: pastelBackground },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: primaryBlue,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="medical" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Keranjang',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}