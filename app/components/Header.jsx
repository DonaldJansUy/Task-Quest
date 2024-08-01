// components/Header.jsx
import React from "react";
import Link from "next/link";

const Header = () => (
  <header className="flex justify-between items-center mb-4">
    <h1 className="text-xl font-bold">Task Quest</h1>
    <Link href="/ProfilePage">
      <button className="bg-red-500 text-white p-2 rounded-full">DU</button>
    </Link>
  </header>
);

export default Header;
