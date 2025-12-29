'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Send,
    BarChart2,
    LogOut,
    Menu,
    X,
    Home,
    Lightbulb
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/dashboard/posts', icon: FileText },
    { name: 'Guides', href: '/admin/dashboard/guides', icon: Lightbulb },
    { name: 'Comments', href: '/admin/dashboard/comments', icon: MessageSquare },
    { name: 'Newsletter', href: '/admin/dashboard/newsletter', icon: Send },
    { name: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart2 },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('adminCredentials');
        sessionStorage.removeItem('adminCredentials');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-900">Blog Admin</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center w-full px-2 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            View Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-4 border-b border-gray-200">
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center w-full px-2 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 mb-2"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            View Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile menu button */}
                <div className="sticky top-0 z-40 lg:hidden bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {navigation.find(item => item.href === pathname)?.name || 'Admin'}
                        </h2>
                        <button
                            type="button"
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-8">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}