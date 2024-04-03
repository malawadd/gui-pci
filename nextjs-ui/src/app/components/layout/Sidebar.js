'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen fixed bg-gray-800 shadow-lg w-64">
      <div className="flex flex-col items-center mt-10 mb-10">
        <span className="text-white text-2xl font-semibold">
          My Application
        </span>
      </div>
      <nav className="flex flex-col space-y-1">
        <Link legacyBehavior href="/setup">
          <a className={`w-full text-lg rounded-md p-2 hover:bg-gray-700 ${pathname === '/setup' ? 'bg-purple-700 text-white' : 'text-gray-400'}`}>
            Setup
          </a>
        </Link>
        <Link legacyBehavior href="/deployment">
          <a className={`w-full text-lg rounded-md p-2 hover:bg-gray-700 ${pathname === '/deployment' ? 'bg-purple-700 text-white' : 'text-gray-400'}`}>
            Deployment
          </a>
        </Link>
        <Link legacyBehavior href="/management">
          <a className={`w-full text-lg rounded-md p-2 hover:bg-gray-700 ${pathname === '/management' ? 'bg-purple-700 text-white' : 'text-gray-400'}`}>
            Management
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
