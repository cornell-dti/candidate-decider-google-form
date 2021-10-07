import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDjq1ttH3qdmxtWk9qpH9o9K3FpYvLZcfc',
  authDomain: 'candidate-decider-form.firebaseapp.com',
  databaseURL: 'https://candidate-decider-form.firebaseio.com',
  projectId: 'candidate-decider--form',
  storageBucket: 'candidate-decider--form.appspot.com',
  messagingSenderId: '81814583566',
  appId: '1:81814583566:web:7dc3845fc29437066d3f5f',
};

firebase.initializeApp(firebaseConfig);
