'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    allergies: [],
    conditions: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  // ... rest of the component
} 