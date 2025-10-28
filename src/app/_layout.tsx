    // app/_layout.tsx
    import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initializeClients, initializePayments } from '../services/storageService';

    export default function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
        try {
            console.log('📱 Inicializando app...');
            
            // Inicializar AsyncStorage con datos mock
            await initializeClients();
            await initializePayments();
            
            console.log('✅ App inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando app:', error);
        } finally {
            setIsLoading(false);
        }
        };

        initializeApp();
    }, []);

    if (isLoading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
            <ActivityIndicator size="large" color="#1E40AF" />
        </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
        {/* NO especifiques rutas específicas aquí */}
        </Stack>
    );
    }