import firebase from 'firebase/app';
import "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyCTd1tgIaygRyi6sKCWoyOxu9wfTjb-iJs",
    authDomain: "texteditor-e891f.firebaseapp.com",
    projectId: "texteditor-e891f",
    storageBucket: "texteditor-e891f.appspot.com",
    messagingSenderId: "599879625553",
    appId: "1:599879625553:web:3465354dd63a547a874170",
    measurementId: "G-F3GQC08QRS"
};
// Initialize Firebase
firebase?.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();