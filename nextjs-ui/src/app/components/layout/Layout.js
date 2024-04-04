'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex">
      <Sidebar isVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
      <main className={`${sidebarVisible ? 'pl-64' : 'pl-0'} flex-1 p-10 transition-padding duration-300`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;