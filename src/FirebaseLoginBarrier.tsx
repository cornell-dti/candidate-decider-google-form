import React, { ReactElement, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import { handleClientLoad, SCOPES } from './gapi';
import { toAppUser, cacheAppUser } from './firebase-auth';

type Props = {
  readonly signedInRenderer: () => ReactElement;
};

const provider = new firebase.auth.GoogleAuthProvider().addScope(SCOPES);

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
  });
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
