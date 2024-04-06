import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {  List, ListItem } from './CustomList';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableFooter,
    TableHead,
    TableRow,
  } from "@/components/ui/table";
  import { Input } from "@/components/ui/input"
  import { useAddresses } from '../contexts/AddressContext';

const AddGenerator = () => {
  const [addresses, setAddresses] = useState([]);
  const { addressData, setAddressData } = useAddresses();
  const [publicKeyCache, setPublicKeyCache] = useState({});
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);


  const generateAddress = async () => {
    setLoading(true);

    const response = await fetch('http://localhost:3100/generate-eth-address');
    const  addressWithQuotes  = await response.text();
    const trimmedAddress = addressWithQuotes.trim();
  const address = trimmedAddress.replace(/^"|"$/g, '');
    // setAddresses([...addresses, address]);
    setAddressData([
        ...addressData, 
        { address, publicKey: null } // Add address with empty key placeholder 
      ]);
      setLoading(false);

  };

  const handleManualAddition = (newAddress) => {
    setAddressData([
      ...addressData,
      { address: newAddress, publicKey: null } // Initialize publicKey to null
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
      const publicKeyWithQuotes = await response.text(); // Get the response as text
      const publicKey = publicKeyWithQuotes.replace(/^"|"$/g, ''); // Remove quotes at the start and end

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
    <Button onClick={generateAddress} disabled={loading} > 
    {loading ? 'Generating Address...' : 'Generate Address'}
    </Button>
    <div className="flex w-full max-w-sm items-center space-x-2">
    <Input
          type="text"
          placeholder="Enter address"
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <Button onClick={() => handleManualAddition(newAddress)}>Add Address</Button>
        </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Public Key</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addressData.map(({ address, publicKey }) => (
          <TableRow key={address}>
            <TableCell>{address}</TableCell>
            <TableCell className="break-words max-w-xs" >{publicKey && <p>{publicKey}</p>}</TableCell>
            <TableCell>
              <Button onClick={() => togglePublicKey(address)}>
                {publicKey ? "Hide Public Key" : "Show Public Key"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
  );
};

export default AddGenerator;