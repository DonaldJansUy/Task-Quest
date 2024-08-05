import Link from 'next/link';
import React from 'react';
import { FaRocket, FaTrophy, FaCoins } from 'react-icons/fa';

export default function InitialPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-red-500">
      <div className="text-center p-8 rounded-lg shadow-2xl transform hover:scale-150 transition-transform duration-300">
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">
          WELCOME TO TASK QUEST
        </h1>
        <p className="text-xl text-gray-600 mb-8 font-extrabold">
          Embark on an epic journey of productivity and rewards!
        </p>
        <div className="flex justify-center space-x-8 mb-8">
          <Feature icon={<FaRocket className="text-blue-800 font-extrabold" />} text="Complete Quests" />
          <Feature icon={<FaTrophy className="text-yellow-400" />} text="Earn Achievements" />
          <Feature icon={<FaCoins className="text-green-900" />} text="Collect TQ Points" />
        </div>
        <Link href="/ProfilePage">
          <button className="px-8 py-4 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white text-xl font-bold rounded-full hover:from-red-600 hover:via-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Start Your Quest Now!
          </button>
        </Link>
      </div>
    </main>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{text}</p>
    </div>
  );
}
