import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const clientCredentials = {
  apiKey: "AIzaSyBb9bBvf_ulB5vNmX-geZ5cAbOuEH5Q19s",
  authDomain: "tennislive-ea360.firebaseapp.com",
  projectId: "tennislive-ea360",
  storageBucket: "tennislive-ea360.appspot.com",
  messagingSenderId: "124468918943",
  appId: "1:124468918943:web:f353d54de26b61f5c380aa",
  measurementId: "G-FNS9KN3NR4",
  //apiKey: process.env.FIREBASE_API_KEY,
  //authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  //projectId: process.env.FIREBASE_PROJECT_ID,
  //storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  //messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  //appId: process.env.FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials);
}
  
export default firebase;