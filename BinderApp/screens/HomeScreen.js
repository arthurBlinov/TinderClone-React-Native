import { TwitterAuthProvider } from '@firebase/auth';
import { useNavigation } from '@react-navigation/core'
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { AsyncStorageStatic } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react/cjs/react.development';
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn';
import {AntDesign, Entypo, Ionicons} from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { onSnapshot, doc, getFirestore, collection, setDoc, where, getDocs, query, getDoc, serverTimestamp} from '@firebase/firestore';
import { LogBox } from 'react-native';
import generateId from '../lib/generateId';

//import AsyncStorage from '@react-native-community/async-storage'; 
LogBox.ignoreLogs(['Setting a timer']);
// const DUMMY_DATA =[
//     {
//         firstName:'Arthur',
//         lastName:'Blinov',
//         job: 'Web Developer',
//         photoURL: 'https://scontent.fhfa1-1.fna.fbcdn.net/v/t1.6435-9/184838281_1706940332827252_1846433977919153951_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=8bHDhM811_0AX9NGZ8v&_nc_ht=scontent.fhfa1-1.fna&oh=00_AT_cNfqo3r6J9wBhV1AIZQsFxR3W4uSRmHMTIpm4OWOOGg&oe=61DAF28B',
//         age: 36,
//         id: 123
//     },
//     {
//         firstName:'Stella',
//         lastName:'Knyazeva',
//         job: 'Yoga Trainer',
//         photoURL: 'https://scontent.fhfa1-1.fna.fbcdn.net/v/t1.6435-9/49419744_1506598599471964_6477437000268906496_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=43IhAwnkeoUAX9Z3-wc&_nc_ht=scontent.fhfa1-1.fna&oh=00_AT-f6_NVgjr-2FUgocLkfxDgIqYb0MgygekSSE5EkP1EXw&oe=61D92F49',
//         age: 56,
//         id: 456
//     },
//     {
//         firstName:'Solomon',
//         lastName:'Grig',
//         job: 'Manager',
//         photoURL: 'https://scontent.fhfa1-1.fna.fbcdn.net/v/t1.6435-9/cp0/e15/q65/s851x315/163300608_1574726036251171_6785927127239958236_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=85a577&efg=eyJpIjoidCJ9&_nc_ohc=lS-H8D5RT0YAX_yJBa7&_nc_ht=scontent.fhfa1-1.fna&oh=00_AT-HESE74SFVxQ6E2ylIq1jljfcd1_2epop83M5-5eCAiw&oe=61DA9379',
//         age: 55,
//         id: 789
//     },
// ]
const db = getFirestore();
const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    useLayoutEffect (
     () => 
        onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
            if(!snapshot.exists()){
                navigation.navigate('Modal');
            }
        }), []
        
   );
    useEffect(() => {
         let unsub;
         const fetchCards = () => {
             const passes = getDocs(collection(db, 'users', user.uid, 'passes')).then(
                 (snapshot) => snapshot.docs.map((doc) => doc.id)
             );
             const swipes = getDocs(collection(db, 'users', user.uid, 'swipes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );
             const passedUsersId = passes.length > 0 ? passes : ['test'];
             const swipedUsersId = swipes.length > 0 ? swipes : ['test'];
         unsub = onSnapshot(query(collection(db, 'users'), where ('id', 'not-in', [...passedUsersId, ...swipedUsersId])), (snapshot) => {
              setProfiles(
                    snapshot.docs.filter(doc => (doc.id !== user.uid)).map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                   }))
               );
           });
       };
      
     fetchCards();
     return unsub;
    }, [db]);
    const swipeLeft = (cardIndex) => {
        if(!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log(`U Swiped Pass on ${userSwiped.displayName}`);
        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
    }
    const swipeRight = async (cardIndex) => {
        //here not
        if(!profiles[cardIndex]) return;
        //here not
        const userSwiped = profiles[cardIndex];
        //here not
        const loggedInProfile = await (await getDoc(doc(db, 'users', user.uid))).data();
        
        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then((documentSnapshot) =>
            {       
                    if (documentSnapshot.exists) {
                        console.log(`Hooray, U Matched with ${userSwiped.displayName}`);

                        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
                        //CREATE A MATCH
                        setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), 
                        {
                            users: {
                                [user.uid]: loggedInProfile,
                                [userSwiped.id]: userSwiped,
                            },
                            userMatched: [user.uid, userSwiped.id],
                            timestamp: serverTimestamp(),
                        });
                        navigation.navigate('Match', {
                            loggedInProfile, 
                            userSwiped,
                        });
                    } else {
                        console.log(`U swiped on ${userSwiped.displayName} ${userSwiped.job}`);
                    }
            })

        console.log(`U Swiped Pass on ${userSwiped.displayName} (${userSwiped.job})`);
        
    }
    return (
        <SafeAreaView style={tw('flex-1')}>
            <View style={tw('flex-row items-center justify-between px-5')}>
                <TouchableOpacity onPress={logout}>
                    <Image style={tw('h-10 w-10 rounded-full')} source={{ uri:user.photoURL }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                <Image style={tw('h-14 w-14')} source={require('../logo.png')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                <Ionicons name='chatbubbles-sharp' size={30} color='#FF5864'/>
            </TouchableOpacity>
            </View>
            <View style={tw('flex-1 -mt-6')}>
            <Swiper 
            ref={swipeRef}
            containerStyle={{backgroundColor: 'transparent'}} 
            cards={profiles}
            stackSize={5}
            cardIndex={0}
            animateCardOpacity
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => {
                console.log('Swipe Pass');
                swipeLeft(cardIndex);
            }}
            onSwipedRight={(cardIndex) => {
                console.log('Swipe Match');
                swipeRight(cardIndex)
            }}
            backgroundColor={'#4FD0E9'}
            overlayLabels={{
                left:{
                    title: 'NOPE',
                    style: {
                        label: {
                            textAlign: 'left',
                            color: 'red',
                        },
                    },
                },
                right:{
                    title: 'MATCH',
                    style: {
                        label: {
                            color: '#4DED30',
                        },
                    },
                },
            }}
            renderCard={(card) => card ? (
                <View key={card.id} style={tw('relative bg-white h-3/4 rounded-xl')}>
                    <Image style={tw('absolute top-0 h-full w-full rounded-xl')} source={{uri: card.photoURL}}/>
                    <View style={[tw('absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl'), styles.cardShadow,]}>
                        <View>
                            <Text style={tw('text-xl font-bold')}>{card.displayName}</Text>
                            <Text>{card.job}</Text>
                        </View>
                            <Text style={tw('text-2xl font-bold')}>{card.age}</Text>

                    </View>
                </View>
            ) : (
                <View 
                style={[tw('relative bg-white h-3/4 rounded-xl justify-center items-center'), 
            styles.cardShadow,
        ]}
        >
            <Text style={tw('font-bold pb-5')}>No more profiles</Text>
            <Image
                style={tw('h-80 w-full')}
                height={100}
                width={100}
                source={({uri: 'https://links.papareact.com/6gb'})}
                
                />
            </View>
            )}
            />
            </View>
           
           <View style={tw('flex flex-row justify-evenly')}>
               <TouchableOpacity 
                   onPress={() => swipeRef.current.swipeLeft()}
                   style={tw('items-center justify-center rounded-full w-16 h-16 bg-red-200')}>
                   <Entypo name='cross' size={24} color='red'/>
               </TouchableOpacity>
               <TouchableOpacity 
                   onPress={() => swipeRef.current.swipeRight()}
                   style={tw('items-center justify-center rounded-full w-16 h-16 bg-green-200')}>
                   <AntDesign name='heart' size={24} color='green'/>
               </TouchableOpacity>
           </View>
        </SafeAreaView>
    )
}

export default HomeScreen


const styles = StyleSheet.create({
    cardShadow:{
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
})