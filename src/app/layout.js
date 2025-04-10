'use client';

import './globals.css'
import Navigation from '@/components/Navigation'
import { Toaster } from 'react-hot-toast'
import MedicationReminder from '@/components/MedicationReminder'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <MedicationReminder />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
