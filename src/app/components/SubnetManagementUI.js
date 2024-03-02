"use client"
import React, { useState, useRef, useEffect } from 'react';

function SubnetManagementUI({ containerRef }) {
  const [subnets, setSubnets] = useState([]);
  const svgRef = useRef(null);

  const handleAddSubnet = () => {
    const newSubnet = {
      id: `subnet-${subnets.length + 1}`,
      angle: (360 / (subnets.length + 1)) * subnets.length
    };
    setSubnets([
        ...subnets, 
        { 
            id: `subnet-${subnets.length + 1}`, 
            nodes: [] // Initialize with an empty nodes array
        }
    ]);
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

  const getCirclePosition = (angle, radius, containerRef) => {
    const container = containerRef.current;
    if (!container) return { top: 0, left: 0 }; 

    const centerX = container.offsetLeft + container.offsetWidth / 2;
    const centerY = container.offsetTop + container.offsetHeight / 2;

    return {
      left: centerX + radius * Math.cos(angle * Math.PI / 180) - 40,
      top: centerY + radius * Math.sin(angle * Math.PI / 180) - 40
    };
  };

  useEffect(() => {
    const svg = svgRef.current;
    svg.innerHTML = ''; 

    subnets.forEach((subnet) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const mainnetCenter = getCircleCenter('.mainnet-circle', containerRef);
      const subnetCenter = getCircleCenter(`.subnet-circle[key="${subnet.id}"]`, containerRef);

      line.setAttribute('x1', mainnetCenter.x);
      line.setAttribute('y1', mainnetCenter.y);
      line.setAttribute('x2', subnetCenter.x);
      line.setAttribute('y2', subnetCenter.y);
      line.setAttribute('stroke', 'gray');
      line.setAttribute('stroke-width', '2'); 

      svg.appendChild(line);
    });
  }, [subnets]); 

  return (
    <div className="container" ref={containerRef}>
      <svg className="svg-lines" ref={svgRef}></svg>  
      <div className="mainnet-circle">Mainnet</div>
      <div className="subnets">
        {subnets.map((subnet) => {
          const position = getCirclePosition(subnet.angle, 120, containerRef);
          return ( 
            <div 
              className="subnet-circle" 
              key={subnet.id} 
              style={{ left: position.left, top: position.top }}
            >
              {subnet.id}
            </div>
          );
        })}
        <div className="subnet-circle add-circle" onClick={handleAddSubnet}>
          +
        </div>
      </div>
    </div>
  );
}

const getCircleCenter = (selector, containerRef) => {
  const container = containerRef.current;
  const el = container.querySelector(selector);
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + container.offsetLeft + rect.width / 2,
    y: rect.top + container.offsetTop + rect.height / 2,
  };
};

export default SubnetManagementUI;
