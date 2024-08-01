import Link from 'next/link';
import React from 'react';


export default function InitialPage() {
  const linkStyles = "underline text-cyan-600 hover:text-cyan-300";

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">WELCOME TO TASK QUEST</h1>
        <Link href="/ProfilePage">
          <button className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-600">
            Earn TQ NOW!
          </button>
        </Link>
      </div>
    </main>
  );
}