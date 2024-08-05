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

  console.dir(user);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-red-500 ">
      <div>
        {user ? (
          <div className="text-center ">
            <ProfilePageComp />
          </div>
        ) : (
          <div className="text-center md:max-w-max p-40 bg-gray-">
            <h1 className=" font-extrabold text-6xl font- mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-700 to-orange-500 animate-pulse py-20">
              Start Reaping
              <br></br>
            </h1>
            <button
              onClick={handleSignIn}
              className="text-4xl bg-yellow-700 font-bold text-white px-6 py-3 rounded-lg shadow hover:bg-green-900 transition duration-300"
            >
              Sign In
            </button>
            <h1 className=" font-extrabold text-6xl font- mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-700 to-orange-500 animate-pulse py-20">

              Start Sowing
            </h1>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
