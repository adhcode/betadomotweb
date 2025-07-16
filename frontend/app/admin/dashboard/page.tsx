'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    BarChart2,
    Users,
    FileText,
    MessageSquare,
    Send,
    Plus,
    Settings,
    TrendingUp,
    RefreshCw
} from 'lucide-react';

interface DashboardStats {
    total_posts: number;
    total_views: number;
    total_comments: number;
    total_subscribers: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
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

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (response.status === 401) {
                router.push('/admin/login');
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await makeAuthenticatedRequest('/admin/dashboard');
            if (data) {
                setStats(data);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        change = null
    }: {
        title: string;
        value: number | string;
        icon: any;
        change?: string | null;
    }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/80">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>
            </div>
            {change && (
                <p className="text-sm text-green-600 mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {change}
                </p>
            )}
        </div>
    );

    const QuickAction = ({
        title,
        icon: Icon,
        onClick,
    }: {
        title: string;
        icon: any;
        onClick: () => void;
    }) => (
        <button
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/80 text-center flex flex-col items-center justify-center gap-2 group hover:border-gray-400 transition-colors"
        >
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Icon className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mt-2">
                {title}
            </h3>
        </button>
    );

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="text-lg font-medium text-gray-600">Loading dashboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">!</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Dashboard Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                        <div className="ml-auto">
                            <button
                                onClick={loadDashboardStats}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Posts"
                    value={stats?.total_posts || 0}
                    icon={FileText}
                    change="+2 this week"
                />
                <StatCard
                    title="Total Views"
                    value={stats?.total_views || 0}
                    icon={TrendingUp}
                    change="+12% from last month"
                />
                <StatCard
                    title="Comments"
                    value={stats?.total_comments || 0}
                    icon={MessageSquare}
                    change="+5 this week"
                />
                <StatCard
                    title="Subscribers"
                    value={stats?.total_subscribers || 0}
                    icon={Users}
                    change="+8% this month"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                        <QuickAction
                            title="New Post"
                            icon={Plus}
                            onClick={() => router.push('/admin/dashboard/posts?action=create')}
                        />
                        <QuickAction
                            title="Newsletter"
                            icon={Send}
                            onClick={() => router.push('/admin/dashboard/newsletter')}
                        />
                        <QuickAction
                            title="Manage Posts"
                            icon={FileText}
                            onClick={() => router.push('/admin/dashboard/posts')}
                        />
                        <QuickAction
                            title="Analytics"
                            icon={BarChart2}
                            onClick={() => router.push('/admin/dashboard/analytics')}
                        />
                        <QuickAction
                            title="Comments"
                            icon={MessageSquare}
                            onClick={() => router.push('/admin/dashboard/comments')}
                        />
                        <QuickAction
                            title="Settings"
                            icon={Settings}
                            onClick={() => alert('Settings coming soon!')}
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
                        <div className="space-y-2 p-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">New post published</p>
                                    <p className="text-sm text-gray-500">5 Essential Tips for First-Time Home Buyers</p>
                                </div>
                                <div className="text-sm text-gray-400">2h ago</div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">New newsletter subscriber</p>
                                    <p className="text-sm text-gray-500">user@example.com joined</p>
                                </div>
                                <div className="text-sm text-gray-400">1d ago</div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">New comment received</p>
                                    <p className="text-sm text-gray-500">On "Real Estate Market Trends"</p>
                                </div>
                                <div className="text-sm text-gray-400">2d ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 