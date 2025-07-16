'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { RefreshCw } from 'lucide-react';

ChartJS.register(...registerables);

interface Stats {
    total_posts: number;
    total_views: number;
    total_comments: number;
    total_subscribers: number;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const router = useRouter();

    const makeAuthenticatedRequest = async (endpoint: string) => {
        const credentials = JSON.parse(
            localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials') ||
            '{}'
        );
        if (!credentials.username || !credentials.password) {
            router.push('/admin/login');
            return null;
        }
        const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
        const res = await fetch(`http://localhost:8080${endpoint}`, {
            headers: { Authorization: authHeader }
        });
        if (res.status === 401) {
            router.push('/admin/login');
            return null;
        }
        if (!res.ok) throw new Error('Failed');
        return res.json();
    };

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await makeAuthenticatedRequest('/admin/dashboard');
            if (data) setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
        } finally {
            setLoading(false);
        }
    }, [makeAuthenticatedRequest]);

    useEffect(() => {
        load();
    }, [load]);

    const barData = {
        labels: ['Posts', 'Views', 'Comments', 'Subscribers'],
        datasets: [
            {
                label: 'Totals',
                data: stats ? [stats.total_posts, stats.total_views, stats.total_comments, stats.total_subscribers] : [0, 0, 0, 0],
                backgroundColor: ['#2563eb', '#10b981', '#8b5cf6', '#f97316']
            }
        ]
    };

    const pieData = {
        labels: ['Posts', 'Comments', 'Subscribers'],
        datasets: [
            {
                data: stats ? [stats.total_posts, stats.total_comments, stats.total_subscribers] : [0, 0, 0],
                backgroundColor: ['#2563eb', '#8b5cf6', '#f97316']
            }
        ]
    };

    return (
        <div className="p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-end">
                <button
                    onClick={load}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {loading || !stats ? (
                <div className="p-20 text-center">
                    <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl ring-1 ring-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Overview Totals</h2>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                    <div className="bg-white rounded-xl ring-1 ring-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Distribution</h2>
                        <Pie data={pieData} />
                    </div>
                </div>
            )}
        </div>
    );
} 