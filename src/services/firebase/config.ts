import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEon3bFk8y6I_oS1pYmLL5Ap3IxdIHvKI",
  authDomain: "suividestickets.firebaseapp.com",
  projectId: "suividestickets",
  storageBucket: "suividestickets.appspot.com",
  messagingSenderId: "595964409945",
  appId: "1:595964409945:web:cbd0957eb6c8da450c5948"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);