import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './firebase';
import App from './App';
import FirebaseLoginBarrier from './FirebaseLoginBarrier';

// @ts-ignore
window.handleClientLoad = () => {
  ReactDOM.render(
    <FirebaseLoginBarrier signedInRenderer={() => <App />} />,
    document.getElementById('root')
  );
};
