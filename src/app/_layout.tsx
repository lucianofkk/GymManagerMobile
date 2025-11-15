// src/app/_layout.tsx - STATUSBAR + NAVIGATIONBAR AZUL
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// ═══════════════════════════════════════════════════════════════════════════
// CONTENIDO PRINCIPAL - MANEJA EL ENRUTAMIENTO
// ═══════════════════════════════════════════════════════════════════════════
function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // ═══════════════════════════════════════════════════════════════════════
  // ✅ CONFIGURAR STATUS BAR Y NAVIGATION BAR AL MONTAR
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    // 📌 BARRA SUPERIOR (Status Bar) - Android + iOS
    StatusBar.setBarStyle('light-content'); // Iconos blancos
    StatusBar.setBackgroundColor('#1E40AF'); // Fondo azul
    StatusBar.setTranslucent(false); // Fondo sólido, no transparente

    // 📌 BARRA INFERIOR (Navigation Bar) - Android solamente
    NavigationBar.setBackgroundColorAsync('#1E40AF'); // Fondo azul
    NavigationBar.setButtonStyleAsync('light'); // Botones/iconos blancos

    console.log('✅ StatusBar y NavigationBar configuradas a azul (#1E40AF)');
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // REDIRIGIR AUTOMÁTICAMENTE SEGÚN AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        console.log('✅ Usuario autenticado → Ir a (tabs)');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('🔒 Usuario no autenticado → Ir a login');
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // No retornar nada - expo-router maneja la navegación automáticamente
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTAR CON PROVEEDOR DE AUTENTICACIÓN
// Todos los componentes hijos pueden usar useAuth()
// ═══════════════════════════════════════════════════════════════════════════
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* ✅ StatusBar global - visible en toda la app */}
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="#1E40AF"
          translucent={false}
        />

        <RootLayoutContent />

        <Stack screenOptions={{ headerShown: false }}>
          {/* Stack de autenticación */}
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />

          {/* Stack de tabs protegido */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          {/* Stack de clientes */}
          <Stack.Screen
            name="(clients)"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}