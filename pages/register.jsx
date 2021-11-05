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

      <div className="emailRegister" style={{ display: showEmail }}>
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
        <input
          type="password"
          className="input_text"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button onClick={() => createUser(email, password, confirmPassword)}>Register</button>
      </div>
    </div>
  );
}
