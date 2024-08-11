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
  apiKey: "AIzaSyDjXB8gTUQ33510-JqfZveFsz84zQtu0uI",
  authDomain: "ai-customer-support-d34fe.firebaseapp.com",
  projectId: "ai-customer-support-d34fe",
  storageBucket: "ai-customer-support-d34fe.appspot.com",
  messagingSenderId: "955040321821",
  appId: "1:955040321821:web:31c92c1bde665f63a151f4",
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
