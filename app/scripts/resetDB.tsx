'use client';

import { useState } from 'react';
import { resetDatabase } from '../utils/resetDatabase';

export default function ResetDB() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleReset = async () => {
    setLoading(true);
    try {
      const result = await resetDatabase();
      setResult(result.message);
      if (result.success) {
        alert('Database reset successfully! Products have been added.');
      } else {
        alert('Failed to reset database: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Error: ' + error.message);
      alert('Error resetting database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg z-50 border border-orange-500">
      <h2 className="text-lg font-bold mb-3 text-orange-600">Database Reset Tool</h2>
      <button
        onClick={handleReset}
        disabled={loading}
        className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? 'Resetting...' : 'Reset Database'}
      </button>
      {result && <p className="mt-2 text-sm">{result}</p>}
    </div>
  );
}
