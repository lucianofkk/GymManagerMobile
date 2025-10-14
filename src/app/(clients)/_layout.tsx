    import { Stack } from 'expo-router';

    export default function ClientsLayout() {
    return (
        <Stack>
        <Stack.Screen 
            name="membersList"  // ← Asegúrate que coincida con el nombre del archivo
            options={{ title: 'Lista de Miembros' }} 
        />
        <Stack.Screen 
            name="newMember"    // ← Y este también
            options={{ title: 'Nuevo Miembro' }} 
        />
        </Stack>
    );
    }