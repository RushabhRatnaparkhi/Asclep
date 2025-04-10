import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Asclep
          </h1>
          <p className="text-2xl font-medium text-blue-800 mb-4">
            Smart Medication Management
          </p>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Keep track of your medications, get timely reminders, and manage your prescriptions 
            all in one secure place.
          </p>
          <div className="space-x-6">
            <Link 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
            >
              Register
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Smart Reminders</h3>
              <p className="text-gray-600">Never miss a dose with customizable medication reminders</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Prescription Management</h3>
              <p className="text-gray-600">Upload and store your prescriptions securely</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Easy Tracking</h3>
              <p className="text-gray-600">Monitor your medication schedule and history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}