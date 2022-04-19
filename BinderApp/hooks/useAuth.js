import React, { createContext, useContext, useState } from 'react'
import * as Google from 'expo-google-app-auth';
import { useEffect, useMemo } from 'react';
import { 
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut
 } from '@firebase/auth';
import { auth, db } from '../firebase';
const AuthContext = createContext({});

const config = {
    androidClientId: '303588889069-v9jk8fgc4kv66n3tm720ho5332ale75e.apps.googleusercontent.com',
    iosClientId: '303588889069-rbo6r5pmb7pjd3cn6tvorvkd68asfoii.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    permissions: ['public_profile', 'email', 'gender', 'location'],
}

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(
        () => 
           onAuthStateChanged(auth, (user) => {
           if (user) {
                setUser(user)
           } else {
               setUser(null)
           }
           setLoadingInitial(false);
       }),
       
     []
);
    const logout = () => {
            setLoading(true);
            signOut(auth)
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }
    const signInWithGoogle = async () => {
        setLoading(true);
        await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === 'success') {
                const {idToken, accessToken} = logInResult;
                const credential =GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential);
            }
            return Promise.reject();
        }).catch(error => setError(error))
        .finally(() => setLoading(false));
    }

    const memoedValue = useMemo (() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
    }), [user, loading, error]);

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}
