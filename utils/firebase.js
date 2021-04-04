import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDNeeFCGgfKEmsHNxeJGMasNiIPQMPVLUQ",
  authDomain: "revisapp-editor.firebaseapp.com",
  projectId: "revisapp-editor",
  storageBucket: "revisapp-editor.appspot.com",
  messagingSenderId: "1065446780394",
  appId: "1:1065446780394:web:d1e419d4051c32f9425693",
  measurementId: "G-R7EB32FRDX",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const firestore = firebase.firestore();

