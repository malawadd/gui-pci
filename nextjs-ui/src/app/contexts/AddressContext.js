"use client"
import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const useAddresses = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [addressData, setAddressData] = useState([]);
  const [subnetData, setSubnetData] = useState([]); 

  
  const contextValue = {
    addressData,
    setAddressData,
    subnetData,
    setSubnetData,
  };

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
};
