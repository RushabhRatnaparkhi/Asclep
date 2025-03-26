import './globals.css'
import Navigation from '@/components/Navigation'
import { Toaster } from 'react-hot-toast'
import { Suspense } from 'react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
        </Suspense>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
        <footer className="bg-blue-800 text-white py-8 mt-auto">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About Asclep</h3>
                <p className="text-blue-100">
                  Your personal health companion for managing medications and tracking nutrition.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-blue-100 hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="text-blue-100 hover:text-white">Contact</a></li>
                  <li><a href="/privacy" className="text-blue-100 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p className="text-blue-100">
                  Email: support@asclep.com<br />
                  Phone: (555) 123-4567
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-blue-700 text-center text-blue-100">
              <p>&copy; {new Date().getFullYear()} Asclep. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
