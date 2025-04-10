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
        <main className="pb-20"> {/* Add padding to bottom */}
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
