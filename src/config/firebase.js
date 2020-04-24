import * as firebase from "firebase";

import { firebaseConfig } from "./keys";
firebase.initializeApp(firebaseConfig);

const databaseRef = firebase.database().ref();
export const uiStateRef = databaseRef.child("uiState");
export const veggieCheckerRef = databaseRef.child("checks")