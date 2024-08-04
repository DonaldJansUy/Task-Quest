"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './_utils/firebase';
import { useUserAuth } from '../components/_utils/auth-context';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component

const ProfilePageComp = () => {
  const { user, updateUserProfile, firebaseSignOut } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData(data);
          setName(data.name || '');
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleNameChange = (e) => setName(e.target.value);

  const handleUpdateName = async () => {
    await updateUserProfile(name);
    setEditing(false);
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile Page</h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="" // link path here
            alt=""
            width={128} // Specify the width
            height={128} // Specify the height
            className="rounded-full border-4 border-gray-300"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="flex items-center mb-4">
              <p className="font-bold text-gray-700 w-48">Name:</p>
              {editing ? (
                <div className="flex items-center flex-grow">
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="p-2 border rounded flex-grow"
                  />
                  <button onClick={handleUpdateName} className="text-sm ml-2 text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded">
                    Update
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-grow">
                  <span className="text-gray-600">{userData.name || 'Not set'}</span>
                  <button onClick={() => setEditing(true)} className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded">
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center mb-4">
              <p className="font-bold text-gray-700 w-48">Email:</p>
              <span className="text-gray-600">{userData.email}</span>
            </div>
            <div className="flex items-center mb-4">
              <p className="font-bold text-gray-700 w-48">Accumulated Points:</p>
              <span className="text-gray-600">{userData.accumulatedPoints || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6">
          <p className="mb-4">
            <Link href="/HomePage" className="text-lg text-blue-500 hover:underline">
              LET&apos;S GO EARN SOME TQ POINTS!
            </Link>
          </p>
          <button
            onClick={firebaseSignOut}
            className="text-lg m-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageComp;