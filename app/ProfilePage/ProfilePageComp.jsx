"use client"
import React from "react";
import SignInPage from "./SignIn";
import Link from "next/link";

const ProfilePageComponent = ({ user }) => {
  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Profile Page</h1>
      <SignInPage />
      {user && (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block font-bold mb-1">Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Name</label>
            <input
              type="text"
              value={user.name}
              className="w-full p-2 border rounded"
              onChange={(e) => (user.name = e.target.value)} // Update name on change
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Email</label>
            <input
              type="text"
              value={user.email}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Points Accumulated</label>
            <input
              type="text"
              value={user.points}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="mb-2">
              <Link href="/HomePage" className="text-lg text-blue-500 hover:underline">LET'S GO EARN SOME TQ POINTS!</Link>
            </p>
            <button
              onClick={SignInPage.handleSignOut}
              className="text-lg m-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePageComponent;
