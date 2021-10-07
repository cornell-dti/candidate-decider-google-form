import firebase from 'firebase/app';

import 'firebase/firestore';
import { UserVote, SheetVotes, Ratings, Comments } from '../types';
import { getAppUser } from './firebase-auth';

export const listen = (spreadsheetId: string, onSnapshot: (votes: SheetVotes) => void): void => {
  firebase
    .firestore()
    .collection(spreadsheetId)
    .onSnapshot((snapshot) => {
      const votes: { [email: string]: UserVote } = {};
      snapshot.docs.forEach((document) => {
        const owner = document.id;
        const { displayName, ratings = {}, comments = {} } = document.data() as UserVote;
        votes[owner] = { displayName, ratings, comments };
      });
      onSnapshot(votes);
    });
};

export const update = (spreadsheetId: string, ratings: Ratings, comments: Comments): void => {
  const { displayName, email } = getAppUser();
  const vote: UserVote = { displayName, ratings, comments };
  firebase.firestore().collection(spreadsheetId).doc(email).set(vote);
};
