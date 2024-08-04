"use client";

import React from 'react';
import { useUserAuth } from "../components/_utils/auth-context";
import ProfilePageComp from '../components/ProfilePageComp';

const ProfilePage = () => {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  async function handleSignIn() {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignOut() {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error(error);
    }
  }

  console.dir(user);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full md:w-1/2">
        {user ? (
          <div className="text-center">
            <ProfilePageComp />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Start Reaping Start Sowing</h1>
            <button
              onClick={handleSignIn}
              className="text-lg m-2 hover:underline bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
