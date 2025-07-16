'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Send,
    Eye,
    Users,
    FileText,
    Settings,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Download
} from 'lucide-react';

interface NewsletterStats {
    total_subscribers: number;
    active_subscribers: number;
    last_sent: string | null;
    total_sent: number;
    open_rate: string;
}

interface NewsletterTemplate {
    id: string;
    name: string;
    description: string;
    subject_template: string;
    content_template: string;
}

const DEFAULT_TEMPLATES: NewsletterTemplate[] = [
    {
        id: 'welcome',
        name: 'Welcome Newsletter',
        description: 'Welcome new subscribers to your blog',
        subject_template: 'Welcome to Our Blog!',
        content_template: `# Welcome to Our Blog!

Thank you for subscribing to our newsletter. We're excited to have you as part of our community!

## What You Can Expect

- Weekly updates on the latest blog posts
- Exclusive content and insights
- Tips and tutorials from our experts
- Special announcements and offers

Stay tuned for amazing content coming your way!

Best regards,
The Blog Team`
    },
    {
        id: 'weekly',
        name: 'Weekly Digest',
        description: 'Weekly roundup of blog posts and updates',
        subject_template: 'Weekly Digest - Latest Updates',
        content_template: `# This Week's Highlights

Here are the latest updates from our blog:

## New Posts This Week

- 5 Essential Tips for First-Time Home Buyers
- Real Estate Market Trends in 2024
- How to Stage Your Home for a Quick Sale

## Community Highlights

Thank you to all our readers for your engagement and comments!

## Coming Next Week

Stay tuned for more exciting content about real estate and home buying tips.

Happy reading!`
    },
    {
        id: 'announcement',
        name: 'Important Announcement',
        description: 'Special announcements and updates',
        subject_template: 'Important Update from Our Blog',
        content_template: `# Important Announcement

We have some exciting news to share with you!

## What's New

[Add your announcement here]

## How This Affects You

[Explain the impact or benefits]

## Next Steps

[Include any action items or next steps]

Thank you for being part of our community!`
    },
    {
        id: 'seasonal',
        name: 'Seasonal Tips',
        description: 'Seasonal content and tips',
        subject_template: 'Seasonal Tips and Insights',
        content_template: `# Seasonal Tips and Insights

As the season changes, here are some timely tips for you:

## This Season's Focus

[Add seasonal content here]

## Tips and Tricks

- Tip 1: [Add relevant tip]
- Tip 2: [Add relevant tip]
- Tip 3: [Add relevant tip]

## Featured Content

Don't miss our latest seasonal guides and articles.

Stay informed and make the most of this season!`
    },
    {
        id: 'product',
        name: 'Product Spotlight',
        description: 'Showcase a single product to your subscribers',
        subject_template: 'Found something cozy for your living room 🛋️',
        content_template: `Hey [Subscriber Name],

Saw this and thought it might be perfect for your space.

### [Product Name]

![Product Image]([Image URL])

[Product Description]

**View it here:** [Product URL]

Let me know what you think!

– The Betadomot Team
https://betadomot.com`
    }
];

interface Subscriber {
    id: string;
    email: string;
    status: string;
    subscribed_at: string;
}

export default function NewsletterPage() {
    const [stats, setStats] = useState<NewsletterStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Newsletter form state
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [testEmail, setTestEmail] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [sending, setSending] = useState(false);
    const [view, setView] = useState<'composer' | 'subscribers'>('composer');
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
    const [productDetails, setProductDetails] = useState({
        name: '',
        imageUrl: '',
        productUrl: '',
        description: '',
    });

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
                const text = await response.text();
                throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
            }

            // If 204 No Content
            if (response.status === 204) return {};
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    const loadStats = async () => {
        try {
            setError('');
            // Try to get newsletter stats, but provide fallback if endpoint doesn't exist
            try {
                const data = await makeAuthenticatedRequest('/admin/newsletter/stats');
                if (data) {
                    setStats(data);
                }
            } catch (error) {
                // Fallback: get subscriber count from main dashboard
                const dashboardData = await makeAuthenticatedRequest('/admin/dashboard');
                if (dashboardData) {
                    setStats({
                        total_subscribers: dashboardData.total_subscribers || 0,
                        active_subscribers: dashboardData.total_subscribers || 0,
                        last_sent: null,
                        total_sent: 0,
                        open_rate: 'N/A'
                    });
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (templateId: string) => {
        const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            if (template.id !== 'product') {
                setSubject(template.subject_template);
                setContent(template.content_template);
            }
        }
    };

    const handleSendTest = async () => {
        if (!testEmail || !subject || !content) {
            setError('Please fill in test email, subject, and content');
            return;
        }

        try {
            setSending(true);
            setError('');
            setSuccess('');

            const response = await makeAuthenticatedRequest('/admin/newsletter/send', {
                method: 'POST',
                body: JSON.stringify({
                    subject,
                    content,
                    test_email: testEmail
                })
            });

            if (response) {
                setSuccess(`Test newsletter sent to ${testEmail}`);
                setTestEmail('');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to send test newsletter');
        } finally {
            setSending(false);
        }
    };

    const handleSendToAll = async () => {
        if (!subject || !content) {
            setError('Please fill in subject and content');
            return;
        }

        if (!confirm(`Are you sure you want to send this newsletter to all ${stats?.total_subscribers || 0} subscribers?`)) {
            return;
        }

        try {
            setSending(true);
            setError('');
            setSuccess('');

            const response = await makeAuthenticatedRequest('/admin/newsletter/send', {
                method: 'POST',
                body: JSON.stringify({
                    subject,
                    content
                })
            });

            if (response) {
                setSuccess(`Newsletter sent to ${stats?.total_subscribers || 0} subscribers!`);
                setSubject('');
                setContent('');
                setSelectedTemplate('');
                loadStats(); // Refresh stats
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to send newsletter');
        } finally {
            setSending(false);
        }
    };

    const handlePreview = () => {
        setPreviewMode(true);
    };

    useEffect(() => {
        if (selectedTemplate === 'product') {
            const template = DEFAULT_TEMPLATES.find(t => t.id === 'product');
            if (template) {
                let newContent = template.content_template;
                // Replace placeholders with product details or default text
                newContent = newContent.replace('Hey [Subscriber Name],', 'Hey there,');
                newContent = newContent.replace('[Product Name]', productDetails.name || 'Product Name');
                newContent = newContent.replace('[Image URL]', productDetails.imageUrl || 'https://via.placeholder.com/300');
                newContent = newContent.replace('[Product Description]', productDetails.description || 'A brief description of this amazing product.');
                newContent = newContent.replace('[Product URL]', productDetails.productUrl || '#');

                setContent(newContent);
                setSubject(template.subject_template);
            }
        }
    }, [productDetails, selectedTemplate]);

    const loadSubscribers = async () => {
        try {
            setError('');
            const data = await makeAuthenticatedRequest('/admin/subscribers');
            if (data) {
                setSubscribers(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load subscribers');
        }
    };

    const handleAddSubscriber = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubscriberEmail) {
            setError('Please enter an email address.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            // Using the public endpoint, which is fine for admin use
            await makeAuthenticatedRequest('/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email: newSubscriberEmail })
            });
            setSuccess(`Successfully subscribed ${newSubscriberEmail}.`);
            setNewSubscriberEmail('');
            loadSubscribers(); // Refresh the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to subscribe');
        }
    };

    useEffect(() => {
        loadStats();
        loadSubscribers();
    }, []);

    const StatCard = ({ title, value, icon: Icon }: any) => (
        <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setView('composer')}
                            className={`${view === 'composer' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Composer
                        </button>
                        <button
                            onClick={() => setView('subscribers')}
                            className={`${view === 'subscribers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Subscribers ({subscribers.length})
                        </button>
                    </nav>
                </div>
                <button
                    onClick={loadStats}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Error/Success Messages */}
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

            {/* Stats */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Subscribers"
                        value={stats?.total_subscribers || 0}
                        icon={Users}
                    />
                    <StatCard
                        title="Active Subscribers"
                        value={stats?.active_subscribers || 0}
                        icon={Mail}
                    />
                    <StatCard
                        title="Total Sent"
                        value={stats?.total_sent || 0}
                        icon={Send}
                    />
                    <StatCard
                        title="Open Rate"
                        value={stats?.open_rate || 'N/A'}
                        icon={Eye}
                    />
                </div>
            )}

            {view === 'composer' && (
                <div className="bg-white rounded-xl ring-1 ring-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            Compose Newsletter
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Template Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Choose Template
                            </label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => handleTemplateSelect(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a template...</option>
                                {DEFAULT_TEMPLATES.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name} - {template.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTemplate === 'product' && (
                            <div className="p-6 my-4 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={productDetails.name}
                                        onChange={e => setProductDetails({ ...productDetails, name: e.target.value })}
                                        placeholder="e.g., The Cozy Lamp"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product URL</label>
                                    <input
                                        type="url"
                                        value={productDetails.productUrl}
                                        onChange={e => setProductDetails({ ...productDetails, productUrl: e.target.value })}
                                        placeholder="https://yourstore.com/product/..."
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={productDetails.imageUrl}
                                        onChange={e => setProductDetails({ ...productDetails, imageUrl: e.target.value })}
                                        placeholder="https://yourcdn.com/image.jpg"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                                    <textarea
                                        value={productDetails.description}
                                        onChange={e => setProductDetails({ ...productDetails, description: e.target.value })}
                                        rows={3}
                                        placeholder="A short, catchy description of the product."
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter newsletter subject..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content (Markdown supported)
                            </label>
                            <textarea
                                readOnly={selectedTemplate === 'product'}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your newsletter content here..."
                                rows={12}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                You can use Markdown formatting: **bold**, *italic*, # headers, - lists, etc.
                            </p>
                        </div>

                        {/* Preview Mode */}
                        {previewMode && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium text-gray-900">Preview</h3>
                                    <button
                                        onClick={() => setPreviewMode(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="bg-white p-4 rounded border">
                                    <h4 className="font-bold text-lg mb-4">{subject}</h4>
                                    <div className="prose prose-sm max-w-none">
                                        {content.split('\n').map((line, i) => {
                                            if (line.startsWith('# ')) {
                                                return <h1 key={i} className="text-xl font-bold mb-2">{line.slice(2)}</h1>;
                                            }
                                            if (line.startsWith('## ')) {
                                                return <h2 key={i} className="text-lg font-semibold mb-2">{line.slice(3)}</h2>;
                                            }
                                            if (line.startsWith('- ')) {
                                                return <li key={i} className="ml-4">{line.slice(2)}</li>;
                                            }
                                            if (line.trim() === '') {
                                                return <br key={i} />;
                                            }
                                            return <p key={i} className="mb-2">{line}</p>;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handlePreview}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Preview</span>
                            </button>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="test@example.com"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    onClick={handleSendTest}
                                    disabled={sending}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{sending ? 'Sending...' : 'Send Test'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleSendToAll}
                                disabled={sending}
                                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Users className="w-5 h-5" />
                                <span>{sending ? 'Sending to All...' : `Send to ${stats?.total_subscribers || 0} Subscribers`}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'subscribers' && (
                <div className="bg-white rounded-xl ring-1 ring-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Manage Subscribers</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleAddSubscriber} className="flex items-center gap-2 mb-4">
                            <input
                                type="email"
                                value={newSubscriberEmail}
                                onChange={e => setNewSubscriberEmail(e.target.value)}
                                placeholder="Add new subscriber email..."
                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Add</button>
                        </form>
                        <div className="divide-y divide-gray-200">
                            {subscribers.map(sub => (
                                <div key={sub.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{sub.email}</p>
                                        <p className="text-sm text-gray-500">Subscribed on {new Date(sub.subscribed_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${sub.status === 'subscribed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {sub.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 