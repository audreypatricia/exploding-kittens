import firebaseConfig from './firebase.config';
import firebase from "firebase";

const app = firebase.initializeApp(firebaseConfig);

export default app;
