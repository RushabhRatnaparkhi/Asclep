'use client';

import { useState, useEffect } from 'react';

export default function MedicationReminder() {
  const checkMedications = async () => {
    try {
      const response = await fetch('/api/medications', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch medications');
      const medications = await response.json();

      const now = new Date();
      
      for (const medication of medications) {
        if (!medication.nextDoseTime) continue;
        
        const nextDose = new Date(medication.nextDoseTime);
        const timeDiff = Math.abs(now - nextDose);
        
        if (timeDiff <= 60000) {
          const confirmTaken = window.confirm(
            `Time to take ${medication.name}\nDosage: ${medication.dosage}\n\nClick OK if you've taken this medication.`
          );

          if (confirmTaken) {
            const updateResponse = await fetch(`/api/medications/${medication._id}/taken`, {
              method: 'POST',
              credentials: 'include'
            });

            if (updateResponse.ok) {
              // Force a complete page refresh to update all UI elements
              window.location.reload();
              return; // Stop checking other medications after refresh
            }
          }
        }
      }
    } catch (error) {
      console.error('Medication check error:', error);
    }
  };

  useEffect(() => {
    // Check immediately when component mounts
    checkMedications();

    // Set up interval to check every minute
    const timer = setInterval(checkMedications, 60000);

    return () => clearInterval(timer);
  }, []);

  return null;
}