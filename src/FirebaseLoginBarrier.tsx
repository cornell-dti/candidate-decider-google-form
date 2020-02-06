import React, { ReactElement, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { handleClientLoad, signIn, isSignedIn as checkIsSignedIn, SCOPES } from './gapi';
import firebase from 'firebase/app';
import { toAppUser, cacheAppUser, hasUser } from './firebase-auth';

type Props = {
  readonly signedInRenderer: () => ReactElement;
};

const provider = new firebase.auth.GoogleAuthProvider().addScope(SCOPES);

export default ({ signedInRenderer }: Props): ReactElement => {
  const [isSignedIn, setInSignedIn] = useState(hasUser());
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      const appUser = await toAppUser(firebaseUser);
      if (appUser != null) {
        cacheAppUser(appUser);
        handleClientLoad(async () => {
          if (!checkIsSignedIn()) {
            await signIn();
          }
          setInSignedIn(true);
        });
      }
    })
  });
  if (isSignedIn) {
    return signedInRenderer();
  }
  const signInAsync = () => firebase.auth().signInWithPopup(provider);
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
