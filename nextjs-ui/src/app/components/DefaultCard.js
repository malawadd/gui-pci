
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/Button";

const DefaultCard = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const copyResponse = await fetch('http://localhost:3100/copy-default');
      if (!copyResponse.ok) throw new Error('Failed to copy default.');

      const buildResponse = await fetch('http://localhost:3100/fendermint-build');
      if (!buildResponse.ok) throw new Error('Failed to build Fendermint.');

      setSuccess(true);
    } catch (err) {
      setError('Failed to apply default values. Please try again.');
      console.error('API call error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Default Subnet</CardTitle>
        <CardDescription>Return everthing to default values.</CardDescription>
      </CardHeader>
      <CardContent>
      <p className="text-sm font-medium leading-none">
      Use this blueprint to return the subnet to its default values and undo anything done prev.
      </p>
      </CardContent>
      
      <CardFooter>
        <Button variant="destructive" className="w-full" onClick={handleApply} disabled={loading || success}>
          {loading ? 'Applying...' : success ? 'Applied' : 'Apply'}
        </Button>
      </CardFooter>
      {success && <p className="text-green-500">Syscall applied successfully!</p>}
      {error && <p className="text-red-500">{error}</p>}
    </Card>
  );
}
export default DefaultCard;