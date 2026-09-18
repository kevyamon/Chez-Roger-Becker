/**
 * Configuration et initialisation du SDK Firebase Client pour l'application Web PWA.
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let messagingInstance = null;

/**
 * Récupère l'instance Firebase Messaging si le navigateur supporte Web Push.
 */
export const getFirebaseMessaging = async () => {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  if (supported && !messagingInstance) {
    messagingInstance = getMessaging(app);
  }
  return messagingInstance;
};
