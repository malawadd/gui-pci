"use client"
import React, { useState } from 'react';
import AddGenerator from './components/AddGenerator';
import SubnetCreator from './components/SubnetCreator';

function SubnetManagementUI() {
  const [subnets, setSubnets] = useState([]);

  const handleAddSubnet = () => {
    setSubnets([
      ...subnets, 
      { 
          id: `subnet-${subnets.length + 1}`, 
          nodes: [] // Initialize with an empty nodes array
      }
  ]);  };

  const handleRemoveSubnet = (subnetId) => {
    const newSubnets = subnets.filter((subnet) => subnet.id !== subnetId);
    setSubnets(newSubnets);
  };

  const handleAddNode = (subnetId) => {
    setSubnets(subnets.map(subnet => {
      if (subnet.id === subnetId) {
        if (subnet.nodes.length < 4) { // Check if there's space for a node
          return {
            ...subnet,
            nodes: [
              ...subnet.nodes, 
              `subnet${subnetId.split('-')[1]}-node${subnet.nodes.length + 1}`
            ]
          };
        } else {
          return subnet; // No changes if already 4 nodes
        }
      } else {
        return subnet; // No changes for other subnets
      }
    }));
  };

  return (
    <div className="container">
      <div className="mainnet-circle">Mainnet</div>
      <div className="subnets">
        {subnets.map((subnet) => (
          <div className="subnet-circle" key={subnet.id} >
            {subnet.id}
            <span className="remove-icon" onClick={() => handleRemoveSubnet(subnet.id)}>×</span> 
            <div className="nodes-container">
              {subnet.nodes.map((node) => (
                <div className="node" key={node}>
                  {node}
                </div>
              ))}
              {/* Add Node Button */}
              <div className="add-node" onClick={() => handleAddNode(subnet.id)}>
                +
              </div>
            </div> 

          </div>
        ))}
        
        <div className="subnet-circle add-circle" onClick={handleAddSubnet}>
          +
        </div>
      </div>
      <AddGenerator />
      <SubnetCreator />
    </div>
  );
}

export default SubnetManagementUI;


