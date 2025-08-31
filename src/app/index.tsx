import { Lato_400Regular, useFonts } from '@expo-google-fonts/lato'
import React from 'react'
import { Text, View } from 'react-native'

    const Main = () => {
        const [fontsLoaded] = useFonts({ 
            Lato_400Regular })
    return (
        <View
            style={{ flex: 1, // Take up the entire screen 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'black'
            }}>
        <Text
        style={{ color: 'white', 
            fontSize: 24,
            fontFamily: 'Lato_400Regular'
        }}
        
        >Main</Text>,
        
        </View>
        
    )
    }

export default Main