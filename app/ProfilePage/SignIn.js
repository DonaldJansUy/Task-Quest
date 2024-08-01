"use client"

import Link from "next/link";
import { useUserAuth } from "../components/_utils/auth-context";

export default function SignInPage() {
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
    <main>
      {user ? (
        <div>

        </div>
      ) : (
        <div>
          <button onClick={handleSignIn} className="text-lg m-2 hover:underline">
            Sign In
          </button>
        </div>
      )}
    </main>
  );
}
