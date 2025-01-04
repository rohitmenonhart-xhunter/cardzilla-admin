import { useState, useEffect } from 'react';
import { onValue } from 'firebase/database';
import { cardRequestsRef } from '../lib/database';
import { CardRequest } from '../types';

export const useCardRequests = () => {
  const [requests, setRequests] = useState<Record<string, CardRequest>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Firebase listener...');
    
    const unsubscribe = onValue(cardRequestsRef, 
      (snapshot) => {
        console.log('Received Firebase update');
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Received data:', data);
          setRequests(data);
        } else {
          console.log('No data available in snapshot');
          setRequests({});
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);

  return { requests, loading, error };
};