// src/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

// ═══════════════════════════════════════════════════════════════════════════
// BOTTOM TAB NAVIGATION - GYM MANAGER
// Orden: Dashboard | Pagos | Clientes | Cuotas | Acerca
// ═══════════════════════════════════════════════════════════════════════════

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        // ═══════════════════════════════════════════════════════════════
        // OCULTAR HEADER POR DEFECTO
        // ═══════════════════════════════════════════════════════════════
        headerShown: false,

        // ═══════════════════════════════════════════════════════════════
        // COLOR ACTIVO - Azul principal del app
        // Aplicado a iconos y texto cuando pestaña está seleccionada
        // ═══════════════════════════════════════════════════════════════
        tabBarActiveTintColor: '#1E40AF',

        // ═══════════════════════════════════════════════════════════════
        // COLOR INACTIVO - Gris neutro
        // Aplicado cuando la pestaña NO está seleccionada
        // ═══════════════════════════════════════════════════════════════
        tabBarInactiveTintColor: '#6B7280',

        // ═══════════════════════════════════════════════════════════════
        // ESTILOS DE LA BARRA DE NAVEGACIÓN
        // Fondo blanco, borde superior suave
        // ═══════════════════════════════════════════════════════════════
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PESTAÑA 1: DASHBOARD */}
      {/* Icono: home (casa) - Panel de control principal */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }} 
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PESTAÑA 2: PAGOS */}
      {/* Icono: card (tarjeta de crédito) - Registro de pagos */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Tabs.Screen 
        name="paymetsHistory" 
        options={{ 
          title: 'Pagos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          )
        }} 
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PESTAÑA 3: CLIENTES - LISTA DE MIEMBROS */}
      {/* Icono: people (personas) - Lista de clientes/socios */}
      {/* Esta es la lista completa de miembros del gimnasio */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Tabs.Screen 
        name="membersList" 
        options={{ 
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          )
        }} 
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PESTAÑA 4: CUOTAS / PLANES */}
      {/* Icono: receipt (recibo) - Control de cuotas y planes */}
      {/* Nombre real: plansScreen */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Tabs.Screen 
        name="plansScreen" 
        options={{ 
          title: 'Cuotas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags" size={size} color={color} />
          )
        }} 
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PESTAÑA 5: ACERCA DE */}
      {/* Icono: information-circle (información) - Detalles de la app */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Tabs.Screen 
        name="about" 
        options={{ 
          title: 'Acerca',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}
