"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './_utils/firebase';
import { useUserAuth } from '../components/_utils/auth-context';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaStar, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { GiTrophyCup } from 'react-icons/gi';

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
    <main className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 via-green-500 to-red-500">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-16 text-center m-4 border border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">USER PROFILE</h1>
        <div className="flex items-center justify-center mb-7">
          <Image
            src="" // Add your image path here
            alt=""
            width={128}
            height={128}
            className="rounded-full border-4 border-gray-300"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="flex items-center mb-4">
              <FaUser className="text-gray-700 mr-2" />
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
                  <button onClick={() => setEditing(true)} className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded flex items-center">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-gray-700 mr-2" />
              <p className="font-bold text-gray-700 w-48">Email:</p>
              <span className="text-gray-600">{userData.email}</span>
            </div>
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-500 mr-2" />
              <p className="font-bold text-gray-700 w-48">Accumulated Points:</p>
              <span className="text-gray-600">{userData.accumulatedPoints || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6">
          <p className="mb-4">
            <Link href="/HomePage" legacyBehavior>
              <a className="text-2xl text-blue-500 hover:underline flex items-center font-extrabold hover:bg-green-200">
                <GiTrophyCup className="mr-2" /> LET&apos;S GO EARN SOME TQ POINTS!
              </a>
            </Link>
          </p>
          <button
            onClick={firebaseSignOut}
            className="text-lg m-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePageComp;