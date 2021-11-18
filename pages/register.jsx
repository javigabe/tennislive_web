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
    // Redirect to / after sign in is successful.
    signInSuccessUrl: '/',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOptions, setShowOptions] = useState('inline-block');
  const [showEmail, setShowEmail] = useState('none');

  const router = useRouter();

  const createUser = (email, password, confirmPassword) => {
    if (password != confirmPassword) {
      console.log('Contraseñas diferentes');
      toast.error("Password doesn't match", {
        position: toast.POSITION.TOP_CENTER,
      });
      return ' ';
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        user.sendEmailVerification();
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

  const registerEmail = () => {
    setShowOptions('none');
    setShowEmail('inline-block');
  };

  return (
    <div className="register-app">
      <div className="choose" style={{ display: showOptions }}>
        <h4>Choose an option to register</h4>
        <button className="email-register-button" onClick={() => registerEmail()}>
          <img
            className="email-img"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg"
          />
          <span classname="email-register-text"> Register with email </span>
        </button>
        <StyledFirebaseAuth
          className="registerUI"
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>

      <Container class="email-register" style={{ display: showEmail }}>
        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>
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

        <label for="psw-repeat">
          <b>Repeat Password</b>
        </label>
        <input
          type="password"
          placeholder="Repeat Password"
          name="psw-repeat"
          id="psw-repeat"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <hr />

        <button onClick={() => createUser(email, password, confirmPassword)} class="registerbtn">
          Register
        </button>
      </Container>

      <Container class="email-register signin">
        <p>
          Already have an account?{' '}
          <a className="already-have-account" href="/login">
            Sign in
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
