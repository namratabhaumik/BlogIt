import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDLSCG_AO_XsCc4JMdHqyKsyyMlUyCg4jY",
    authDomain: "blogit-group12.firebaseapp.com",
    projectId: "blogit-group12",
    storageBucket: "blogit-group12.appspot.com",
    messagingSenderId: "355206153713",
    appId: "1:355206153713:web:df6089e5fe7a4a96297050",
    measurementId: "G-GNBRQ88G1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };
