"use client";

import { useState, useEffect, useCallback } from 'react';
import { H3, Body, MonoText } from '@/components/ui/DesignSystem';

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

const STORAGE_KEY = 'betadomot_commenter';

export default function Comments({ postSlug }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showNameField, setShowNameField] = useState(false);
    const [userName, setUserName] = useState('');
    const [savedName, setSavedName] = useState('');

    // Load saved name from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setSavedName(saved);
            setUserName(saved);
        }
    }, []);

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

    const handleCommentFocus = () => {
        if (!savedName && !showNameField) {
            setShowNameField(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) return;

        setSubmitting(true);

        // Generate a unique BetaDomot guest name if no name provided
        const finalName = userName.trim() || savedName || `BetaGuest${Math.floor(1000 + Math.random() * 9000)}`;

        try {
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/posts/${postSlug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author_name: finalName,
                    author_email: '',
                    body: commentText.trim()
                }),
            });

            if (response.ok) {
                // Save name to localStorage only if user provided one
                if (userName.trim()) {
                    localStorage.setItem(STORAGE_KEY, userName.trim());
                    setSavedName(userName.trim());
                }

                setCommentText('');
                setShowNameField(false);
                await fetchComments();
            } else {
                alert('Error posting comment. Please try again.');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Error posting comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join('');

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-gilroy font-medium text-gray-900 mb-2">
                    Share your thoughts
                </h3>
                <p className="font-proza text-sm text-gray-500">
                    {comments.length === 0
                        ? "Be the first to share your perspective."
                        : `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`
                    }
                </p>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-10">
                <div className="space-y-3">
                    {/* Comment Textarea */}
                    <div className="relative">
                        <textarea
                            placeholder={savedName ? `What do you think, ${savedName.split(' ')[0]}?` : "Add your comment..."}
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onFocus={handleCommentFocus}
                            className="w-full px-4 py-3 font-proza text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 resize-none placeholder-gray-400"
                            maxLength={500}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-proza">
                            {commentText.length}/500
                        </div>
                    </div>

                    {/* Name Field - Shows after typing or if no saved name */}
                    {showNameField && !savedName && (
                        <div className="animate-fade-in-up">
                            <label className="block mb-1.5">
                                <span className="font-proza text-xs font-medium text-gray-600">
                                    Your name (optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-2.5 font-proza text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 placeholder-gray-400"
                                maxLength={50}
                            />
                            <p className="mt-1.5 text-xs text-gray-400 font-proza">
                                We'll remember this for next time
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center justify-between pt-1">
                        <p className="text-[11px] text-gray-400 font-proza">
                            {savedName && (
                                <span>
                                    Posting as <span className="font-medium text-gray-500">{savedName}</span>
                                    {' • '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem(STORAGE_KEY);
                                            setSavedName('');
                                            setUserName('');
                                            setShowNameField(true);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 underline"
                                    >
                                        change
                                    </button>
                                </span>
                            )}
                        </p>
                        <button
                            type="submit"
                            disabled={submitting || !commentText.trim()}
                            className="px-5 py-2 bg-black font-proza text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ color: '#ffffff' }}
                        >
                            {submitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="space-y-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
                                <div className="w-full h-2.5 bg-gray-200 rounded animate-pulse" />
                                <div className="w-2/3 h-2.5 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="font-proza text-sm text-gray-400">
                        No comments yet
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0">
                                <span className="font-gilroy font-medium text-gray-700 text-xs">
                                    {initials(comment.author_name || 'A')}
                                </span>
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-gilroy font-medium text-sm text-gray-900">
                                        {comment.author_name || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-proza">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                                <p className="font-proza text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {comment.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 