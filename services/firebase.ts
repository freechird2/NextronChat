import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

import firebaseConfig from "./firebase.config";

const app = firebase.initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth();
