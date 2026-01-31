// Lazy-loading Firebase module to reduce initial bundle size
// Firebase is only loaded when authentication is actually needed

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDatabase = null;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

export const initializeFirebase = async () => {
  if (firebaseApp) {
    return { app: firebaseApp, auth: firebaseAuth, database: firebaseDatabase };
  }

  const [{ initializeApp }, { getAuth }, { getDatabase }] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/database'),
  ]);

  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDatabase = getDatabase(firebaseApp);

  return { app: firebaseApp, auth: firebaseAuth, database: firebaseDatabase };
};

export const getAuthInstance = async () => {
  const { auth } = await initializeFirebase();
  return auth;
};

export const getDatabaseInstance = async () => {
  const { database } = await initializeFirebase();
  return database;
};
