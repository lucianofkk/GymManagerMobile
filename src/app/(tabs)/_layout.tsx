// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A', // Color azul cuando está activo
        tabBarInactiveTintColor: '#6B7280', // Color gris cuando está inactivo
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen 
        name="(clients)" 
        options={{ 
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          )
        }} 
      />
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

// Algunos iconos útiles para un gym manager:
  // <Ionicons name="people" />          // 👥 Para clientes/miembros
  // <Ionicons name="bar-chart" />       // 📊 Para dashboard/estadísticas
  // <Ionicons name="information-circle" /> // ℹ️ Para información/acerca
  // <Ionicons name="add-circle" />      // ➕ Para agregar nuevo
  // <Ionicons name="settings" />        // ⚙️ Para configuraciones
  // <Ionicons name="calendar" />        // 📅 Para calendario
  // <Ionicons name="card" />            // 💳 Para pagos
  // <Ionicons name="fitness" />         // 💪 Para ejercicios
  // <Ionicons name="stats-chart" />     // 📈 Para estadísticas
  // <Ionicons name="person" />          // 👤 Para perfil