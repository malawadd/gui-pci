import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {  List, ListItem } from './CustomList';

const AddGenerator = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressData, setAddressData] = useState([]); // Use an array for simplicity
  const [publicKeyCache, setPublicKeyCache] = useState({});

  const generateAddress = async () => {
    // if (addresses.length >= 10) return; // Limit to 3 addresses

    const response = await fetch('http://localhost:3100/generate-eth-address');
    const  address  = await response.text();
    // setAddresses([...addresses, address]);
    setAddressData([
        ...addressData, 
        { address, publicKey: null } // Add address with empty key placeholder 
      ]);

  };


const togglePublicKey = async (address) => {
    const targetIndex = addressData.findIndex(item => item.address === address);
    const cachedPublicKey = publicKeyCache[address];

    if (cachedPublicKey !== undefined) {
      // If the public key is cached, toggle visibility
      setAddressData(prevData => prevData.map((item, idx) => {
        if (idx === targetIndex) {
          return { ...item, publicKey: item.publicKey ? null : cachedPublicKey }; // Toggle visibility
        } else {
          return item;
        }
      }));
    } else {
      // If the public key is not cached, fetch it from the server
      const response = await fetch(`http://localhost:3100/generate-public-address?ethAddress=${address}`);
      const publicKey = await response.text();

      setAddressData(prevData => prevData.map((item, idx) => {
        if (idx === targetIndex) {
          return { ...item, publicKey }; // Set the fetched public key
        } else {
          return item;
        }
      }));

      // Cache the fetched public key
      setPublicKeyCache(prevCache => ({ ...prevCache, [address]: publicKey }));
    }
  };


  

  return (
    <>
      <Button onClick={generateAddress}>Generate Address</Button>
      {addresses.length >= 0 && (
        <List>
        {addressData.map(({ address, publicKey }) => ( 
  <ListItem key={address}> 
    {address} - Balance: {/* ... */}
    <Button onClick={() => togglePublicKey(address)}>
      {publicKey ? "Hide Public Key" : "Show Public Key"}
    </Button>
    {publicKey && <p>{publicKey}</p>} 
  </ListItem>
))} 
      </List>
      )}
    </>
  );
};

export default AddGenerator;