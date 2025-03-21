import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBuQOqom6VxHJEc9eWQsJGGYH-NtVf4g-I",
    authDomain: "world-domination-af72e.firebaseapp.com",
    projectId: "world-domination-af72e",
    storageBucket: "world-domination-af72e.firebasestorage.app",
    messagingSenderId: "175026020359",
    appId: "1:175026020359:web:d6c795bb3255f6aede4aa2",
    measurementId: "G-0639D77HQW"
  };

export const app = initializeApp(firebaseConfig);


// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
