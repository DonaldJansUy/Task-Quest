"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { db } from './firebase'; // Import Firestore instance
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const gitHubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const newUser = result.user;

      // Create user document in Firestore if it doesn't exist
      const userDoc = doc(db, 'users', newUser.uid);
      await setDoc(userDoc, {
        email: newUser.email,
        accumulatedPoints: 0 // Initialize accumulated points for new users
      }, { merge: true });

      // Set user state with the new user data
      setUser({ ...newUser, accumulatedPoints: 0 });
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          // Load user data from Firestore
          const data = userSnapshot.data();
          setUser({ ...currentUser, accumulatedPoints: data.accumulatedPoints || 0 }); // Use existing points
        } else {
          // Create user document in Firestore if it doesn't exist
          await setDoc(userDoc, {
            email: currentUser.email,
            accumulatedPoints: 0 // Initialize accumulated points for new users
          }, { merge: true });
          
          setUser({ ...currentUser, accumulatedPoints: 0 }); // Set initial points
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (name) => {
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        name: name,
      }, { merge: true });
      setUser((prevUser) => ({ ...prevUser, displayName: name })); // Update local user state
    }
  };

  return (
    <AuthContext.Provider value={{ user, gitHubSignIn, firebaseSignOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
