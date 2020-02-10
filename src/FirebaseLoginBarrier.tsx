import React, { ReactElement, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import { handleClientLoad, SCOPES } from './apis/gapi';
import { toAppUser, cacheAppUser } from './apis/firebase-auth';

type Props = {
  readonly signedInRenderer: () => ReactElement;
};

const provider = new firebase.auth.GoogleAuthProvider().addScope(SCOPES);

const getAccessToken = (): string | null => {
  const token = localStorage.getItem('access-token');
  if (token == null) {
    return null;
  }
  const expireString = localStorage.getItem('access-token-expire');
  if (expireString == null) {
    return null;
  }
  const expireDate = new Date(parseInt(expireString, 10));
  if (expireDate < new Date()) {
    return null;
  }
  return token;
};

const cacheAccessToken = (token: string): void => {
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 30);
  localStorage.setItem('access-token', token);
  localStorage.setItem('access-token-expire', String(expireDate.getTime()));
};

export default ({ signedInRenderer }: Props): ReactElement => {
  const [isSignedIn, setInSignedIn] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser == null) {
        setInSignedIn(false);
      } else {
        const appUser = toAppUser(firebaseUser);
        if (appUser != null) {
          cacheAppUser(appUser);
        }
      }
    });
    const accessToken = getAccessToken();
    if (accessToken != null) {
      handleClientLoad(accessToken, () => {
        setInSignedIn(true);
      });
    }
  }, []);
  if (isSignedIn) {
    return signedInRenderer();
  }
  const signInAsync = () =>
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async result => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const accessToken: string | null = result.credential?.accessToken ?? null;
        if (accessToken == null) {
          return;
        }
        cacheAccessToken(accessToken);
        const appUser = toAppUser(result.user);
        if (appUser != null) {
          handleClientLoad(accessToken, () => {
            setInSignedIn(true);
          });
        }
      });
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={signInAsync}
      style={{ width: '500px', height: '300px', fontSize: '64px' }}
    >
      Sign In
    </Button>
  );
};
