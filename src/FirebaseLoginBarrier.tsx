import React, { ReactElement, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import { handleClientLoad, SCOPES } from './gapi';
import { toAppUser, cacheAppUser, hasUser } from './firebase-auth';

type Props = {
  readonly signedInRenderer: () => ReactElement;
};

const provider = new firebase.auth.GoogleAuthProvider().addScope(SCOPES);

export default ({ signedInRenderer }: Props): ReactElement => {
  const [isSignedIn, setInSignedIn] = useState(hasUser());
  useEffect(() => {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser == null) {
        setInSignedIn(false);
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
        const appUser = await toAppUser(result.user, accessToken);
        if (appUser != null) {
          cacheAppUser(appUser);
          handleClientLoad(appUser.accessToken, () => {
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
