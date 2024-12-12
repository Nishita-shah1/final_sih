'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function Navbar() {
  const { data: session } = useSession(); // Access session data
  const user = session?.user; // Safely get user from session

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* App Logo */}
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Aquanidhi
        </a>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <Link href="/" className="text-white hover:text-slate-100">Home</Link>
          <Link href="/AdminDashboard" className="text-white hover:text-slate-100">Dashboard</Link>
          <Link href="/fileUpload" className="text-white hover:text-slate-100">PFZ</Link>

          <Link href="/village" className="text-white hover:text-slate-100">villagedata</Link>
          <Link href="/table3" className="text-white hover:text-slate-100">capacity</Link>
          <Link href="/gallery" className="text-white hover:text-slate-100">Gallery</Link>
          <Link href="/maps" className="text-white hover:text-slate-100">Maps</Link>
          <Link href="/community" className="text-white hover:text-slate-100">Community</Link>



        </div>

        {/* Conditional rendering for session state */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {/* Display username or email */}
              <span className="mr-4">
                Welcome, {user?.name || user?.email || 'User'}
              </span>
              {/* Logout button */}
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            // Login button if no session exists
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Get Started button (always visible) */}
          <Link href="/fileUpload">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
