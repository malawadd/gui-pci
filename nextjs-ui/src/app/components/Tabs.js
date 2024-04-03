import React, { useState } from 'react';
import AddGenerator from './AddGenerator';
import SubnetCreator from './SubnetCreator';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('address');

  // A function to render the note based on the active tab
  const renderNote = () => {
    switch (activeTab) {
      case 'address':
        return 'Add or generate IPC address to use with the subnets.';
      case 'subnet':
        return 'Create subnet by choosing the primary wallet that will connect to the subnet.';
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
      </div>

      {/* Note bubble right under the tabs */}
      <div className="px-6 py-3 text-white bg-purple-600">
        {renderNote()}
      </div>

      <div className="mt-4">
        {activeTab === 'address' && <AddGenerator />}
        {activeTab === 'subnet' && <SubnetCreator />}
      </div>
    </div>
  );
};

export default Tabs;
