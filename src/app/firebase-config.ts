import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from './environments/environment';

const firebaseConfig = environment.firebaseConfig;

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;

export const initializeFirebase = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log('Firebase initialized');
    } else {
      firebaseApp = getApps()[0];
      console.log('Firebase already initialized');
    }

    firebaseAuth = getAuth(firebaseApp);
    resolve();
  });
};

export { firebaseAuth };
