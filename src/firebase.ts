import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { env } from "@/lib/env";

const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
  measurementId: env.measurementId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
