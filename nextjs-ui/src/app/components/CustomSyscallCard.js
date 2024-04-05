
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/Button";
const CustomSyscallCard = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      // Call the /copy-customcall API
      const copyResponse = await fetch('http://localhost:3100/copy-customcall');
      if (!copyResponse.ok) throw new Error('Failed to copy customcall.');

      // Then call the /fendermint-build API
      const buildResponse = await fetch('http://localhost:3100/fendermint-build');
      if (!buildResponse.ok) throw new Error('Failed to build Fendermint.');

      setSuccess(true);
    } catch (err) {
      setError('Failed to apply custom syscall. Please try again.');
      console.error('API call error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Custom Syscall Subnet</CardTitle>
        <CardDescription>Creating a simple syscall which accesses the filesystem.</CardDescription>
      </CardHeader>
      <CardContent>
      <p className="text-sm font-medium leading-none">
      Inside syscalls, you can run external processes, link to rust libraries, access network, call other syscalls, etc.
      </p>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={handleApply} disabled={loading || success}>
          {loading ? 'Applying...' : success ? 'Applied' : 'Apply'}
        </Button>
      </CardFooter>
      {success && <p className="text-green-500">Syscall applied successfully!</p>}
      {error && <p className="text-red-500">{error}</p>}
    </Card>
  );
}
export default CustomSyscallCard;