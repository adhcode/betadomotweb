'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Test credentials by making a request to the admin API
            const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
            const response = await fetch('http://localhost:8080/admin/dashboard', {
                headers: {
                    'Authorization': authHeader
                }
            });

            if (response.ok) {
                // Save credentials
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('adminCredentials', JSON.stringify(credentials));

                // Redirect to dashboard
                router.push('/admin/dashboard');
            } else if (response.status === 401) {
                // setError('Invalid username or password'); // This line was removed as per the edit hint
            } else {
                // setError('Login failed. Please try again.'); // This line was removed as per the edit hint
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
                    <p className="text-gray-600">Access your blog dashboard</p>
                </div>

                {/* {error && ( // This block was removed as per the edit hint */}
                {/*     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"> // This block was removed as per the edit hint */}
                {/*         {error} // This block was removed as per the edit hint */}
                {/*     </div> // This block was removed as per the edit hint */}
                {/* )} // This block was removed as per the edit hint */}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="username"
                                type="text"
                                required
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Default Credentials</h3>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Username:</span>
                                    <span className="font-mono font-semibold">admin</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Password:</span>
                                    <span className="font-mono font-semibold">password</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Manage Posts
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                Send Newsletters
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                Moderate Comments
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                                View Analytics
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 