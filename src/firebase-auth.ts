import firebase from 'firebase/app';
import 'firebase/auth';

export type AppUser = {
  readonly displayName: string;
  readonly email: string;
  readonly idToken: string;
  readonly accessToken: string;
};

/**
 * Returns the promise of an app user from the given raw firebase user.
 *
 * @param firebaseUser a raw firebase user or null.
 * @param accessToken access token of the user.
 * @return the promise of an app user or null if there is no such user..
 */
export async function toAppUser(
  firebaseUser: firebase.User | null,
  accessToken: string | null
): Promise<AppUser | null> {
  if (firebaseUser == null || accessToken == null) {
    return null;
  }
  const { displayName, email } = firebaseUser;
  if (typeof displayName !== 'string' || typeof email !== 'string') {
    throw new Error('Bad user!');
  }
  const idToken: string = await firebaseUser.getIdToken(true);
  return { displayName, email, idToken, accessToken };
}

let appUser: AppUser | null = null;

export const hasUser = (): boolean => appUser != null;

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
