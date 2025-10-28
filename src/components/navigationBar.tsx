// src/components/NavigationBar.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const NavigationBar: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.navBar}>
            <TouchableOpacity 
                style={styles.navItem}
                onPress={() => navigation.navigate('Dashboard' as never)}
            >
                <Text style={styles.navText}>🏠 Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.navItem}
                onPress={() => navigation.navigate('Members' as never)}
            >
                <Text style={styles.navText}>👥 Miembros</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.navItem}
                onPress={() => navigation.navigate('Payments' as never)}
            >
                <Text style={styles.navText}>💳 Pagos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.navItem}
                onPress={() => navigation.navigate('Settings' as never)}
            >
                <Text style={styles.navText}>⚙️ Ajustes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        backgroundColor: '#1E40AF',
        paddingVertical: 12,
        paddingHorizontal: 8,
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#374151',
    },
    navItem: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    navText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});