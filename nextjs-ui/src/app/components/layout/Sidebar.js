'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ isVisible, toggleSidebar }) => {
  const pathname = usePathname();

  const toggleButton = (
    <button
      onClick={toggleSidebar}
      className="absolute top-0 right-full p-2"
    >
      {/* This is a simple text arrow, replace with an icon if you have one */}
      {isVisible ? '<' : '>'}
    </button>
  );

  return (
    <div className={`fixed inset-y-0   bg-gray-800 ${isVisible ? 'w-0' : 'w-0 '} transition-all duration-300 z-30`}>
      <div className={`flex flex-col ${isVisible ? '' : 'hidden'}`}>
    <div className="h-screen fixed bg-gray-800 shadow-lg w-64">
      <div className="flex flex-col items-center mt-10 mb-10">
        <span className="text-white text-2xl font-semibold">
          IPC-UI
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
        <Link legacyBehavior href="/blueprints">
          <a className={`w-full text-lg rounded-md p-2 hover:bg-gray-700 ${pathname === '/blueprints' ? 'bg-purple-700 text-white' : 'text-gray-400'}`}>
            Blueprints
          </a>
        </Link>
        {toggleButton}
      </nav>
      
    </div>
    </div>
    <button
        onClick={toggleSidebar}
        className="absolute top-0 -right-50 p-2 bg-gray-800 text-white border-l border-gray-800"
      >
        {isVisible ? '→' : '←'} {/* Adjust icons accordingly */}
      </button>
    </div>
  );
};

export default Sidebar;
