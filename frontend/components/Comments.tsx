"use client";

import { useState, useEffect, useCallback } from 'react';
import { H3, Body, MonoText, GhostButton } from '@/components/ui/DesignSystem';

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
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/posts/${postSlug}/comments`);
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
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/posts/${postSlug}/comments`, {
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

    const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join('');

    return (
        <div>
            <div className="mb-8">
                <H3 className="mb-4">Comments ({comments.length})</H3>
                <Body className="text-gray-600 max-w-2xl">
                    Share your thoughts, ask questions, or add your own tips. We love hearing from our community.
                </Body>
            </div>

            {/* Comment Form */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-12">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Your name *"
                            required
                            value={formData.author_name}
                            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors"
                        />
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={formData.author_email}
                            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors"
                        />
                    </div>
                    <textarea
                        placeholder="Write your comment..."
                        required
                        rows={4}
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <MonoText className="text-xs text-gray-500">
                            By commenting, you agree to our community guidelines.
                        </MonoText>
                        <GhostButton
                            type="submit"
                            disabled={submitting}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </GhostButton>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                                <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
                                <div className="w-2/3 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12">
                    <Body className="text-gray-500">No comments yet. Be the first to share your thoughts!</Body>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                    <MonoText className="text-xs text-gray-600">
                                        {initials(comment.author_name || 'Guest')}
                                    </MonoText>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Body className="font-medium text-gray-900">
                                            {comment.author_name || 'Guest'}
                                        </Body>
                                        <MonoText className="text-xs text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </MonoText>
                                    </div>
                                    <Body className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {comment.body}
                                    </Body>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 