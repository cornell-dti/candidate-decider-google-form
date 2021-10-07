import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './apis/firebase';
import App from './App';
import FirebaseLoginBarrier from './FirebaseLoginBarrier';

ReactDOM.render(<FirebaseLoginBarrier signedInRenderer={App} />, document.getElementById('root'));
