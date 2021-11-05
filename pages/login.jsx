import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import firebase from '../firebase/clientApp';

toast.configure();
export default function SignInScreen() {
  // Configure FirebaseUI.
  const uiConfig = {
    // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signIn = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        router.push('/');
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  return (
    <div className="log-in-app">
      <div>
        <h4>Choose an option to Log In</h4>
        <input
          type="email"
          className="input_text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          className="input_text"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={() => signIn(email, password)}>Log In</button>
      </div>

      <StyledFirebaseAuth
        className="registerUI"
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
}
