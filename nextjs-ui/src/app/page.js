"use client"
// pages/deployment.js

import React from 'react';
import Tabs from './components/Tabs';
import JoinSubnet from "./components/JoinSubnet"

const DeploymentPage = () => {
  return (
    <div className="container mx-auto">
      <JoinSubnet />
    </div>
  );
};

export default DeploymentPage;
