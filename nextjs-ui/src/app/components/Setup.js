import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const Setup = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const performSetupStep = async (endpoint, successMessage, errorMessage, progressValue) => {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        setStatus((prevStatus) => prevStatus + successMessage + '\n');
        setProgress(progressValue);
      } else {
        throw new Error(errorMessage);
      }
    } catch (error) {
      setStatus((prevStatus) => prevStatus + error.message + '\n');
    }
  };

  const startSetupProcess = async () => {
    await performSetupStep('http://localhost:3100/add-wasm-target', 'Added wasm target', 'Error adding wasm target', 25);
    await performSetupStep('http://localhost:3100/clone-repo', 'Cloned the repo', 'Error cloning repo', 50);
    await performSetupStep('http://localhost:3100/generate-contracts', 'Generated contracts', 'Error generating contracts', 75);
    await performSetupStep('http://localhost:3100/create-releases', 'Created releases', 'Error creating releases', 100);
  };

  return (
    <div>
      <Button onClick={startSetupProcess}>Start Setup</Button>
      <div className="w-full bg-gray-200">
        <div className="bg-purple-600" style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
      <pre>{status}</pre>
    </div>
  );
};

export default Setup;
