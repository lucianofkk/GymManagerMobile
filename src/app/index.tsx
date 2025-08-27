import React from 'react'
import { Text, View } from 'react-native'

    const Main = () => {
    return (
        <View
            style={{ flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'black'
            }}>
        <Text
        style={{ color: 'white', fontSize: 24 }}
        
        >Main</Text>
        </View>
    )
    }

export default Main