import React, { useState } from 'react';
import { useAddresses } from '../contexts/AddressContext';
import Select from './Select'; 
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

const SubnetCreator = () => {
const { addressData, subnetData, setSubnetData } = useAddresses(); 
  const [selectedAddress, setSelectedAddress] = useState('');
  const [minValidatorStake, setMinValidatorStake] = useState(1);
  const [minValidators, setMinValidators] = useState(1);
  const [manualSubnetId, setManualSubnetId] = useState(''); // State for manually added subnet ID


  const createSubnet = async () => {
    const response = await fetch('http://localhost:3100/create-subnet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        minValidatorStake: minValidators,
        minValidators: minValidatorStake,
        from: selectedAddress,
      }),
    });

    if (response.ok) {
      const subnetId = await response.text();
      setSubnetData([...subnetData, { address: selectedAddress, subnetId }]);
    } else {
      alert('Failed to create subnet');
    }
  };

  const handleManualAddition = () => {
    if (manualSubnetId && selectedAddress) {
      setSubnetData([...subnetData, { address: selectedAddress, subnetId: manualSubnetId }]);
      setManualSubnetId(''); // Clear the input after adding
    } else {
      alert('Please select an address and enter a subnet ID.');
    }
  };

  return (
    <>
        <div className="form-group">
        <label htmlFor="address-select">Address</label>
      <Select
      id="address-select"
        options={addressData.map(({ address }) => ({ value: address, label: address }))}
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
        placeholder="Select an Address"
      />
      </div>
      <div className="form-group">
        <label htmlFor="min-validator-stake">Min Validator Stake (tfil)</label>
        <Input
          id="min-validator-stake"
          type="number"
          min="1"
          max="10"
          value={minValidatorStake}
          onChange={(e) => setMinValidatorStake(Number(e.target.value))}
          placeholder="Min Validator Stake"
        />
      </div>

      <div className="form-group">
        <label htmlFor="min-validators">Min Validators  </label>
        <Input
          id="min-validators"
          type="number"
          min="1"
          max="10"
          value={minValidators}
          onChange={(e) => setMinValidators(Number(e.target.value))}
          placeholder="Min Validators"
        />
      </div>
      <Button onClick={createSubnet}>Create Subnet</Button>
      
      {/* Input for manual subnet ID addition */}
      <div>
        <Input
          type="text"
          value={manualSubnetId}
          onChange={(e) => setManualSubnetId(e.target.value)}
          placeholder="Manual Subnet ID"
        />
        <Button onClick={handleManualAddition}>Add Manual Subnet</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Subnet ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subnetData.map(({ address, subnetId }, index) => (
            <TableRow key={index}> {/* Using index as key due to potential duplicate subnet IDs */}
              <TableCell>{address}</TableCell>
              <TableCell>{subnetId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default SubnetCreator;
