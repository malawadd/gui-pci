import React from 'react';
import { Button } from "@/components/ui/Button";

const MetaMaskNetworkButton = ({ subnetId, rpcUrl, chainId }) => {
  const addNetwork = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) throw new Error('MetaMask is not installed');

      // Trim the subnet ID to the first 10 characters
      const networkName = `subnet ${subnetId.substring(10, 20)}`;

      // Convert chainId to hexadecimal (if it's a number)
      const hexChainId = `0x${(Number(chainId)).toString(16)}`;
      const hmm = rpcUrl.replace(/^http:/, 'https:')
      // MetaMask network parameters
      const params = {
        chainId: hexChainId, // A 0x-prefixed hexadecimal string
        chainName: networkName,
        nativeCurrency: {
          name: 'FIL', // Replace with the correct currency name
          symbol: 'FIL', // Replace with the correct currency symbol
          decimals: 18,
        },
        rpcUrls: [hmm],
       
      };

      // Request MetaMask to add the new network
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    } catch (error) {
      console.error('Error adding network to MetaMask:', error);
      alert(error.message);
    }
  };

  return (
    <Button onClick={addNetwork} className="button-class">Add to MetaMask</Button>
  );
};

export default MetaMaskNetworkButton;
