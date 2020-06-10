/* eslint-disable */
import * as firebase from 'firebase/app';
import 'firebase/messaging';

firebase.initializeApp(FIREBASE);

export const messaging = firebase.messaging();