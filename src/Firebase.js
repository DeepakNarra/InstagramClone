import firebase from "firebase/app";
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCRvnZF5Sb5kSBzl-w6HdAtUzmMA8SWPfY",
    authDomain: "instagram-clone-93abf.firebaseapp.com",
    projectId: "instagram-clone-93abf",
    storageBucket: "instagram-clone-93abf.appspot.com",
    messagingSenderId: "144068146298",
    appId: "1:144068146298:web:bfc0c5a0fa47ab70fe37c3",
    measurementId: "G-CJ2F93D7W8"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db, auth, storage, firebase};