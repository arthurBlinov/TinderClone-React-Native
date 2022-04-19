import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import Header from '../components/Header';
import ChatList from '../components/ChatList';
import ChatRow from '../components/ChatRow';
const ChatScreen = () => {
    return (
        <SafeAreaView>
            <Header title='Chat' />
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen
