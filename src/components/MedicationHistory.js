'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function MedicationHistory({ medicationId }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogs: 0,
    taken: 0,
    missed: 0,
    skipped: 0,
    adherenceRate: 0
  });

  useEffect(() => {
    fetchHistory();
  }, [medicationId]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/medications/${medicationId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch medication history');
      
      const data = await res.json();
      setLogs(data.logs);
      
      // Calculate statistics
      const total = data.logs.length;
      const taken = data.logs.filter(log => log.status === 'taken').length;
      const missed = data.logs.filter(log => log.status === 'missed').length;
      const skipped = data.logs.filter(log => log.status === 'skipped').length;
      
      setStats({
        totalLogs: total,
        taken,
        missed,
        skipped,
        adherenceRate: total > 0 ? Math.round((taken / total) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load medication history');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Adherence Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Total Logs</p>
          <p className="text-2xl font-bold text-blue-800">{stats.totalLogs}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Taken</p>
          <p className="text-2xl font-bold text-green-800">{stats.taken}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600">Missed</p>
          <p className="text-2xl font-bold text-red-800">{stats.missed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Skipped</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.skipped}</p>
        </div>
      </div>

      {/* Adherence Rate */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">Adherence Rate</p>
          <p className="text-lg font-bold">{stats.adherenceRate}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${stats.adherenceRate}%` }}
          />
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">History Log</h3>
        </div>
        <div className="divide-y">
          {logs.map((log) => (
            <div key={log._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${log.status === 'taken' ? 'bg-green-100 text-green-800' : 
                      log.status === 'missed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                  <p className="mt-1 text-sm text-gray-500">
                    Scheduled: {new Date(log.scheduledTime).toLocaleString()}
                  </p>
                  {log.takenTime && (
                    <p className="text-sm text-gray-500">
                      Taken: {new Date(log.takenTime).toLocaleString()}
                    </p>
                  )}
                </div>
                {log.notes && (
                  <p className="text-sm text-gray-500">{log.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 