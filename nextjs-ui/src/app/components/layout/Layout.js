// components/Layout.js or pages/_app.js

import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-64 p-10">
          {children}
        </main>
      </div>
    );
  };
  
  export default Layout;
