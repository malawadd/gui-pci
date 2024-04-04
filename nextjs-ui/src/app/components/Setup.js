import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SetupMessages } from "./SetupMessages";

const Setup = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const performSetupStep = async (endpoint, processingMessage, successMessage, errorMessage, progressValue) => {
    setStatus((prevStatus) => prevStatus + `${processingMessage} `);

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        setStatus((prevStatus) => prevStatus.replace(processingMessage, successMessage + '\n'));
        setProgress(progressValue);
      } else {
        throw new Error(errorMessage);
      }
    } catch (error) {
      setStatus((prevStatus) => prevStatus.replace(processingMessage, errorMessage + '\n'));
    }
  };

  const startSetupProcess = async () => {
    setIsProcessing(true); // Indicate the process has started
    // Example setup steps, adjust according to your actual setup steps
    await performSetupStep('http://localhost:3100/add-wasm-target', 'Adding wasm target', 'Added wasm target', 'Error adding wasm target', 25);
    await performSetupStep('http://localhost:3100/clone-repo', 'Clonning the repo', 'Cloned the repo', 'Error cloning repo', 50);
    await performSetupStep('http://localhost:3100/generate-contracts', 'Generating contracts', 'Generated contracts', 'Error generating contracts', 75);
    await performSetupStep('http://localhost:3100/create-releases', 'Creating releases', 'Created releases', 'Error creating releases', 100);
    setIsProcessing(false); // Process has ended
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <SetupMessages />
      <Button onClick={!isProcessing ? startSetupProcess : null} disabled={isProcessing}>
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
            Working...  {isProcessing && <div className="spinner"></div>}
          </>
        ) : (
          "Start Setup"
        )}
      </Button>
      <div className="w-full bg-gray-200 mt-4">
        <div className="bg-purple-600" style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
      <pre className="mt-4">{status}</pre>
    </div>
  );
};

export default Setup;
