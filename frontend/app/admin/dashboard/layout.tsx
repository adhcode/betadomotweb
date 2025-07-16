'use client';

import { useState, useEffect } from 'react';
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
    User,
    ChevronDown,
    Package
} from 'lucide-react';

interface AdminCredentials {
    username: string;
    password: string;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<AdminCredentials | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check authentication
        const savedCredentials = localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials');

        if (!savedCredentials) {
            router.push('/admin/login');
            return;
        }

        try {
            const credentials = JSON.parse(savedCredentials);
            setUser(credentials);
        } catch {
            router.push('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminCredentials');
        sessionStorage.removeItem('adminCredentials');
        router.push('/admin/login');
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            current: pathname === '/admin/dashboard'
        },
        {
            name: 'Posts',
            href: '/admin/dashboard/posts',
            icon: FileText,
            current: pathname === '/admin/dashboard/posts'
        },
        {
            name: 'Products',
            href: '/admin/dashboard/products',
            icon: Package,
            current: pathname === '/admin/dashboard/products'
        },
        {
            name: 'Comments',
            href: '/admin/dashboard/comments',
            icon: MessageSquare,
            current: pathname === '/admin/dashboard/comments'
        },
        {
            name: 'Newsletter',
            href: '/admin/dashboard/newsletter',
            icon: Send,
            current: pathname === '/admin/dashboard/newsletter'
        },
        {
            name: 'Analytics',
            href: '/admin/dashboard/analytics',
            icon: BarChart2,
            current: pathname === '/admin/dashboard/analytics'
        },
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100/50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-900 shadow-xl text-white">
                    <div className="flex h-16 shrink-0 items-center justify-between px-6">
                        <h2 className="text-xl font-bold text-white">
                            Dashboard
                        </h2>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`${item.current
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    } group flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors`}
                            >
                                <item.icon
                                    className="mr-3 flex-shrink-0 h-6 w-6"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-gray-900 text-white">
                <div className="flex h-16 shrink-0 items-center px-6">
                    <h2 className="text-xl font-bold text-white">
                        Dashboard
                    </h2>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto">
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${item.current
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    } group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors`}
                            >
                                <item.icon
                                    className="mr-3 flex-shrink-0 h-5 w-5"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1 text-lg font-semibold leading-6 text-gray-900">
                        {navigation.find(item => item.current)?.name || 'Dashboard'}
                    </div>

                    <div className="relative">
                        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-x-2">
                            <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <span className="hidden lg:flex lg:items-center">
                                <span className="text-sm font-semibold leading-6 text-gray-900">
                                    {user.username}
                                </span>
                                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                            </span>
                        </button>
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page content */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 