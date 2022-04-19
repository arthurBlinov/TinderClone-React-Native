// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2cPTkLazB2oi5TFu_yMPbNFqZ_DKoEAM",
  authDomain: "binderapp-a6a88.firebaseapp.com",
  projectId: "binderapp-a6a88",
  storageBucket: "binderapp-a6a88.appspot.com",
  messagingSenderId: "303588889069",
  appId: "1:303588889069:web:0c3c70c446503b9b1117e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db};
