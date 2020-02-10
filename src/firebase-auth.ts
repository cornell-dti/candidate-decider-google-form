import firebase from 'firebase/app';
import 'firebase/auth';

export type AppUser = {
  readonly displayName: string;
  readonly email: string;
};

/**
 * Returns the promise of an app user from the given raw firebase user.
 *
 * @param firebaseUser a raw firebase user or null.
 * @return the promise of an app user or null if there is no such user..
 */
export function toAppUser(firebaseUser: firebase.User | null): AppUser | null {
  if (firebaseUser == null) {
    return null;
  }
  const { displayName, email } = firebaseUser;
  if (typeof displayName !== 'string' || typeof email !== 'string') {
    throw new Error('Bad user!');
  }
  return { displayName, email };
}

let appUser: AppUser | null = null;

export function cacheAppUser(user: AppUser): void {
  appUser = user;
}

/**
 * Returns the global app user.
 *
 * If the user is not cached yet, it will not try to get one from firebase.
 * Instead, it will throw an error.
 */
export function getAppUser(): AppUser {
  const user = appUser;
  if (user == null) {
    throw new Error('App is not initialized.');
  }
  return user;
}
