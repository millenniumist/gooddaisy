'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Pen } from 'lucide-react';

const AddressPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAddressInfo = async () => {
      try {
        const response = await fetch('/api/cart/address');
        const data = await response.json();
        const [fetchedName, fetchedPhone, fetchedAddress] = (data.address || '').split('|');
        setName(fetchedName || '');
        setPhone(fetchedPhone || '');
        setAddress(fetchedAddress || '');
      } catch (error) {
        console.error('Failed to fetch address info:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAddressInfo();
  }, []);

  const validateInputs = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('All fields are required');
      return false;
    }
    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setError('Invalid name format');
      return false;
    }
    
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('Invalid phone number');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateInputs()) return;
    
    setLoading(true);

    const combinedAddress = `${name}|${phone}|${address}`;

    try {
      const response = await fetch('/api/cart/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: combinedAddress }),
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Address Information</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pen className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full mb-2"
            disabled={!isEditing}
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full mb-2"
            disabled={!isEditing}
          />
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="w-full"
            disabled={!isEditing}
            rows={4}
          />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {isEditing && (
          <Button type="submit" disabled={loading} className="w-full mb-2">
            {loading ? 'Updating...' : 'Update Address'}
          </Button>
        )}
        <Button
          type="button"
          onClick={() => router.push('/checkout')}
          className="w-full"
        >
          Proceed to Checkout
        </Button>
      </form>
    </div>
  );
};

export default AddressPage;
