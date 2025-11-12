import { Stack } from 'expo-router';

export default function ClientsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="membersList" 
        options={{ title: 'Miembros' }} 
      />
      <Stack.Screen 
        name="newMember" 
        options={{ title: 'Nuevo Miembro' }} 
      />
      <Stack.Screen 
        name="editMember" 
        options={{ title: 'Editar Miembro' }} 
      />
    </Stack>
  );
}