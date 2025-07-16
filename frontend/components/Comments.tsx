"use client";

import { useState, useEffect, useCallback } from 'react';

interface Comment {
    id: string;
    author_name: string;
    author_email: string;
    body: string;
    created_at: string;
}

interface CommentsProps {
    postSlug: string;
}

export default function Comments({ postSlug }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        author_name: '',
        author_email: '',
        body: ''
    });

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postSlug}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    }, [postSlug]);

    useEffect(() => {
        fetchComments();
    }, [postSlug, fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`http://localhost:8080/posts/${postSlug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({ author_name: '', author_email: '', body: '' });
                await fetchComments(); // Refresh comments
            } else {
                alert('Error posting comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Error posting comment');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-8">
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h4 className="font-heading font-semibold text-lg text-gray-900 mb-4">
                    Leave a Comment
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="author_name"
                                required
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="author_email"
                                value={formData.author_email}
                                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                            Comment *
                        </label>
                        <textarea
                            id="body"
                            required
                            rows={4}
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent"
                            placeholder="Share your thoughts..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="text-gray-500">Loading comments...</div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-500">No comments yet. Be the first to comment!</div>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-medium text-gray-900">{comment.author_name}</div>
                                <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
                            </div>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {comment.body}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 