import firebase from 'firebase/app';
import 'firebase/firestore';
import { UserVote, SheetVotes, Ratings } from './types';
import { getAppUser } from './firebase-auth';

export const listen = (spreadsheetId: string, onSnapshot: (votes: SheetVotes) => void): void => {
  firebase
    .firestore()
    .collection(spreadsheetId)
    .onSnapshot(snapshot => {
      const votes: { [email: string]: UserVote } = {};
      snapshot.docs.forEach(document => {
        const owner = document.id;
        const { displayName, ratings } = document.data() as UserVote;
        votes[owner] = { displayName, ratings };
      });
      onSnapshot(votes);
    });
};

export const update = (spreadsheetId: string, ratings: Ratings): void => {
  const { displayName, email } = getAppUser();
  const vote: UserVote = { displayName, ratings };
  firebase
    .firestore()
    .collection(spreadsheetId)
    .doc(email)
    .set(vote);
};
