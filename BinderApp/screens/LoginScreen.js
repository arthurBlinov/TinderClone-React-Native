import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn';
const LoginScreen = () => {
    const { signInWithGoogle, loading } = useAuth();
    const navigation = useNavigation();
    
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerShown: false,
        });
    }, [])

    return (
        <View style={tw('flex-1')}>
            <ImageBackground 
                resizeMode='cover'
                style={tw('flex-1')}
                source={{uri: 'https://tinder.com/static/tinder.png'}}
            >
                <TouchableOpacity 
                style={[
                    tw('absolute bottom-40 w-52 bg-white p-4 rounded-2xl'), 
                {marginHorizontal: '25%'}
                ]}
                onPress={signInWithGoogle}
                >
                    <Text style={tw('font-semibold text-center')}>
                        Sign in & get swiping
                        </Text>
                </TouchableOpacity>
            </ImageBackground>
            {/* <Text>{loading ? 'loading...' : 'Login To The app'}</Text>
            <Button title='login' onPress={ signInWithGoogle } /> */}

        </View>
    )
}

export default LoginScreen
