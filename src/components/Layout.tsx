// src/components/Layout.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationBar } from '../components/navigationBar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>
            <NavigationBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flex: 1,
        padding: 16,
    },
});