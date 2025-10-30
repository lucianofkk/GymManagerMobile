// app/_layout.tsx
import { Stack } from 'expo-router';

// 🔥 YA NO NECESITAMOS INICIALIZAR NADA
// Firebase se conecta automáticamente cuando hagas las consultas

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Las rutas se manejan automáticamente por expo-router */}
    </Stack>
  );
}