import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
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
        var _user = userCredential.user;
        router.push('/');
        // ...
      })
      .catch((error) => {
        var _errorCode = error.code;
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
      <Container class="email-register">
        <h1>Login</h1>
        <p>Choose an option to Log In.</p>
        <hr />

        <label for="email">
          <b>Email</b>
        </label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label for="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          id="psw"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button onClick={() => signIn(email, password)} class="registerbtn">
          Log In
        </button>
      </Container>

      <Container class="email-register signin">
        <p>
          Forgot your password?{' '}
          <a className="already-have-account" href="#">
            Recover password
          </a>
          .
        </p>
      </Container>

      <StyledFirebaseAuth
        className="registerUI"
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
}
