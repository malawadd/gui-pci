// components/Sidebar.js

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="h-screen fixed z-10 bg-gray-800 shadow-lg w-64">
      <div className="flex flex-col items-center mt-10 mb-10">
        <span className="text-white text-2xl font-semibold">
          My Application
        </span>
      </div>
      <nav className="flex flex-col space-y-1">
        <Link href="/setup"  legacyBehavior>
          <a className="w-full text-lg text-white rounded-md p-2 hover:bg-gray-700">Setup</a>
        </Link>
        <Link href="/deployment" legacyBehavior>
          <a className="w-full text-lg text-white rounded-md p-2 hover:bg-gray-700">Deployment</a>
        </Link>
        <Link href="/management" legacyBehavior>
          <a className="w-full text-lg text-white rounded-md p-2 hover:bg-gray-700">Management</a>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
