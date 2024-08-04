import React from "react";
import Link from "next/link";

const Header = () => (
  <header className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold">Task Quest</h1>
    <Link href="/ProfilePage">
      <button className="bg-red-500 text-white p-3 rounded-full text-xl">DU</button>
    </Link>
  </header>
);

export default Header;
