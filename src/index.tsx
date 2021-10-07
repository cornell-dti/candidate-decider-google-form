import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './apis/firebase';
import App from './App';
import FirebaseLoginBarrier from './FirebaseLoginBarrier';

// @ts-expect-error: Unfortunate compromise to adapt to the global gapi library.
window.handleClientLoad = () => {
  ReactDOM.render(
    <FirebaseLoginBarrier signedInRenderer={() => <App />} />,
    document.getElementById('root')
  );
};
