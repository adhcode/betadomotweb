'use client';

export default function DebugInfo() {
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://betadomotweb-production.up.railway.app'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded z-50">
      <div>ENV: {process.env.NODE_ENV}</div>
      <div>API: {apiUrl}</div>
      <div>Build: {process.env.BUILD_TIME}</div>
    </div>
  );
}