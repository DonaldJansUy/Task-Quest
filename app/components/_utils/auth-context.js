"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "./firebase"; // Import Firestore instance
import { doc, setDoc, getDoc, collection } from "firebase/firestore"; // Import Firestore functions

const AuthContext = createContext();

const initialCategories = ['Friends', 'Work', 'Fitness', 'Food'];

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const gitHubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const newUser = result.user;

      const userDoc = doc(db, 'users', newUser.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // User is new, initialize their profile with default categories
        await setDoc(userDoc, {
          email: newUser.email,
          accumulatedPoints: 0,
          categories: initialCategories.reduce((acc, category) => {
            acc[category] = [];
            return acc;
          }, {}),
        });
      }

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
          const data = userSnapshot.data();
          setUser({ ...currentUser, accumulatedPoints: data.accumulatedPoints || 0 });
        } else {
          await setDoc(userDoc, {
            email: currentUser.email,
            accumulatedPoints: 0,
            categories: initialCategories.reduce((acc, category) => {
              acc[category] = [];
              return acc;
            }, {}),
          });
          setUser({ ...currentUser, accumulatedPoints: 0 });
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
      setUser((prevUser) => ({ ...prevUser, displayName: name }));
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
