import React, { useState } from 'react';
import AddGenerator from './AddGenerator';
import SubnetCreator from './SubnetCreator';
import JoinSubnet from "./JoinSubnet"
import DeploySubnet from "./DeploySubnet"

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('address');

  // A function to render the note based on the active tab
  const renderNote = () => {
    switch (activeTab) {
      case 'address':
        return (
            <>
              <p>Add or generate IPC address to use with the subnets.</p>
              <p>
                Fund your address from the{' '}
                <a
                  href="https://faucet.calibnet.chainsafe-fil.io/funds.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  faucet
                </a>.
              </p>
            </>
          );
      case 'subnet':
        return 'Create subnet by choosing the primary wallet that will connect to the subnet.';
        case 'join':
        return 'Choose an address to join a subnet as a validator';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex p-2 space-x-4 bg-gray-900">
        <button
          className={`px-4 py-2 font-semibold text-white rounded-md ${
            activeTab === 'address' ? 'bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('address')}
        >
          Address
        </button>
        <button
          className={`px-4 py-2 font-semibold text-white rounded-md ${
            activeTab === 'subnet' ? 'bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('subnet')}
        >
          Subnets
        </button>
        <button
          className={`px-4 py-2 font-semibold text-white rounded-md ${
            activeTab === 'join' ? 'bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('join')}
        >
          Join Subnet
        </button>
        <button
          className={`px-4 py-2 font-semibold text-white rounded-md ${
            activeTab === 'deploy' ? 'bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('deploy')}
        >
          Deploy Subnet
        </button>
      </div>

      {/* Note bubble right under the tabs */}
      <div className="px-6 py-3 text-white bg-purple-600">
        {renderNote()}
      </div>

      <div className="mt-4">
        {activeTab === 'address' && <AddGenerator />}
        {activeTab === 'subnet' && <SubnetCreator />}
        {activeTab === 'join' && <JoinSubnet />}
        {activeTab === 'deploy' && <DeploySubnet />}
      </div>
    </div>
  );
};

export default Tabs;
