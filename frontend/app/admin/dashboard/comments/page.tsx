'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    RefreshCw,
    Trash2,
    MessageCircle,
    Search,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface Comment {
    id: string;
    post_slug: string;
    author: string;
    content: string;
    created_at: string;
}

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const makeAuthenticatedRequest = async (
        endpoint: string,
        options: RequestInit = {}
    ) => {
        const credentials = JSON.parse(
            localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials') ||
            '{}'
        );

        if (!credentials.username || !credentials.password) {
            router.push('/admin/login');
            return null;
        }

        const authHeader =
            'Basic ' + btoa(`${credentials.username}:${credentials.password}`);

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                ...options,
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (response.status === 401) {
                router.push('/admin/login');
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (err) {
            console.error('API Error:', err);
            throw err;
        }
    };

    const loadComments = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/admin/comments');
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();
            setComments(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load comments.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this comment?')) return;
        try {
            setError('');
            setSuccess('');
            await makeAuthenticatedRequest(`/admin/comments/${id}`, {
                method: 'DELETE'
            });
            setSuccess('Comment deleted.');
            setComments(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const safe = (val: unknown) => (typeof val === 'string' ? val.toLowerCase() : '');
    const filtered = comments.filter(c =>
        safe(c.content).includes(searchTerm.toLowerCase()) ||
        safe(c.author).includes(searchTerm.toLowerCase()) ||
        safe(c.post_slug).includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-end">
                <button
                    onClick={loadComments}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Feedback */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-green-700">{success}</span>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl ring-1 ring-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
                        placeholder="Search comments by text, author or slug..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Comments list */}
            <div className="bg-white rounded-xl ring-1 ring-gray-200 divide-y divide-gray-200">
                {loading ? (
                    <div className="p-8 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading comments...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No comments found.</p>
                    </div>
                ) : (
                    filtered.map(c => (
                        <div
                            key={c.id}
                            className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                                    {c.content}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 gap-4">
                                    <span>@{c.author}</span>
                                    <span>{new Date(c.created_at).toLocaleString()}</span>
                                    <span>on <span className="font-medium">{c.post_slug}</span></span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                title="Delete comment"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 