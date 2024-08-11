// components/FirebaseAuth.js
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { Button, Avatar, Typography, Box } from "@mui/material";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function FirebaseAuth() {
  const [user, setUser] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error signing in with Google", error);
    });
  };

  const signOutUser = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out", error);
    });
  };

  if (!user) {
    return (
      <Button variant="contained" color="primary" onClick={signIn}>
        {translations[language].signIn}
      </Button>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar src={user.photoURL} alt={user.displayName} />
      <Typography variant="subtitle1" color="primary.main">
        {user.displayName.split(" ")[0]}
      </Typography>
      <Button variant="outlined" color="primary" onClick={signOutUser}>
        {translations[language].signOut}
      </Button>
    </Box>
  );
}
