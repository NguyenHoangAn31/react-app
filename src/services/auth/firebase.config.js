// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBvGPOs-6jIuCLjw1lIpOANjiZmmFwFjYo",
  authDomain: "bookingapp-608b5.firebaseapp.com",
  projectId: "bookingapp-608b5",
  storageBucket: "bookingapp-608b5.appspot.com",
  messagingSenderId: "274561182035",
  appId: "1:274561182035:web:62eea61d5435eb3cb5d9a6",
  measurementId: "G-M5Z14D89JT"


  // apiKey: "AIzaSyDnGJISIVu_a14Nfhgf3p1ywkTGRn427hI",
  // authDomain: "otp-app-ecd6c.firebaseapp.com",
  // projectId: "otp-app-ecd6c",
  // storageBucket: "otp-app-ecd6c.appspot.com",
  // messagingSenderId: "272579368636",
  // appId: "1:272579368636:web:3b3514543204a93d6f62b9"

  
  // apiKey: "AIzaSyDV4DAxYmMjEePMORjaec6rjlI8rqOI8d8",
  // authDomain: "otp-app1-b8dc4.firebaseapp.com",
  // projectId: "otp-app1-b8dc4",
  // storageBucket: "otp-app1-b8dc4.appspot.com",
  // messagingSenderId: "785102873941",
  // appId: "1:785102873941:web:6e22f8ece829da900abbdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);