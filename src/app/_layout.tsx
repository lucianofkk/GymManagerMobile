// src/app/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// ═══════════════════════════════════════════════════════════════════════════
// CONTENIDO PRINCIPAL - MANEJA EL ENRUTAMIENTO
// ═══════════════════════════════════════════════════════════════════════════
function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

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
    <AuthProvider>
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
  );
}