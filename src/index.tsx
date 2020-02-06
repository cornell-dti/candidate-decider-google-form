import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './firebase';
import App from './App';
import FirebaseLoginBarrier from './FirebaseLoginBarrier';

// Unfortunate compromise to adapt to the global gapi library.
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.handleClientLoad = () => {
  ReactDOM.render(
    <FirebaseLoginBarrier signedInRenderer={() => <App />} />,
    document.getElementById('root')
  );
};
