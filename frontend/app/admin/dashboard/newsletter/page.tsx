'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Users, Mail, Image, Eye, Plus, Trash2, Edit3 } from 'lucide-react';
import { H1, H2, H3, Body, MonoText, Container, Grid, MinimalCard, GhostButton, FadeInUp } from '@/components/ui/DesignSystem';

interface NewsletterCampaign {
    id: string;
    subject: string;
    content: string;
    featured_image?: string;
    sent_at?: string;
    recipient_count?: number;
    open_rate?: number;
    click_rate?: number;
}

interface NewsletterStats {
    total_subscribers: number;
    total_campaigns: number;
    avg_open_rate: number;
    avg_click_rate: number;
}

export default function NewsletterPage() {
    const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
    const [stats, setStats] = useState<NewsletterStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<NewsletterCampaign | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        featured_image: '',
        preview_text: ''
    });
    const router = useRouter();

    const getAuthHeader = () => {
        const credentials = JSON.parse(
            localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials') ||
            '{}'
        );

        if (!credentials.username || !credentials.password) {
            router.push('/admin/login');
            return null;
        }

        return 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const authHeader = getAuthHeader();
                if (!authHeader) return;

                const base = process.env.NODE_ENV === 'production'
                    ? 'https://betadomotweb-production.up.railway.app'
                    : 'http://localhost:8080';

                // Load newsletter stats
                const statsRes = await fetch(`${base}/admin/newsletter/stats`, {
                    headers: { Authorization: authHeader }
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                // Load campaigns
                const campaignsRes = await fetch(`${base}/admin/newsletter/campaigns`, {
                    headers: { Authorization: authHeader }
                });
                if (campaignsRes.ok) {
                    const campaignsData = await campaignsRes.json();
                    setCampaigns(campaignsData);
                }
            } catch (error) {
                console.error('Error loading newsletter data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [router]);

    const handleCreateCampaign = async () => {
        if (!formData.subject || !formData.content) {
            alert('Subject and content are required');
            return;
        }

        try {
            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';

            const response = await fetch(`${base}/admin/newsletter/campaigns`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowCreateForm(false);
                setFormData({ subject: '', content: '', featured_image: '', preview_text: '' });
                // Reload campaigns
                window.location.reload();
            } else {
                alert('Failed to create campaign');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Failed to create campaign');
        }
    };

    const handleSendCampaign = async (campaignId: string) => {
        if (!confirm('Are you sure you want to send this campaign to all subscribers?')) {
            return;
        }

        try {
            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';

            const response = await fetch(`${base}/admin/newsletter/campaigns/${campaignId}/send`, {
                method: 'POST',
                headers: { Authorization: authHeader }
            });

            if (response.ok) {
                alert('Campaign sent successfully!');
                window.location.reload();
            } else {
                alert('Failed to send campaign');
            }
        } catch (error) {
            console.error('Error sending campaign:', error);
            alert('Failed to send campaign');
        }
    };

    if (loading) {
        return (
            <Container>
                <div className="flex items-center justify-center h-64">
                    <Body>Loading newsletter data...</Body>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <FadeInUp>
                <div className="mb-8">
                    <H1 className="mb-2">Newsletter</H1>
                    <Body className="text-gray-600">Manage your email campaigns and subscribers</Body>
                </div>
            </FadeInUp>

            {/* Stats */}
            <FadeInUp delay={100}>
                <Grid className="mb-12">
                    <MinimalCard className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-sm bg-blue-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <MonoText className="text-xs text-gray-500 mb-1">SUBSCRIBERS</MonoText>
                                <H3>{stats?.total_subscribers || 0}</H3>
                            </div>
                        </div>
                    </MinimalCard>

                    <MinimalCard className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-sm bg-green-100 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <MonoText className="text-xs text-gray-500 mb-1">CAMPAIGNS</MonoText>
                                <H3>{stats?.total_campaigns || 0}</H3>
                            </div>
                        </div>
                    </MinimalCard>

                    <MinimalCard className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-sm bg-purple-100 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <MonoText className="text-xs text-gray-500 mb-1">AVG OPEN RATE</MonoText>
                                <H3>{stats?.avg_open_rate ? `${stats.avg_open_rate}%` : '0%'}</H3>
                            </div>
                        </div>
                    </MinimalCard>
                </Grid>
            </FadeInUp>

            {/* Create Campaign Button */}
            <FadeInUp delay={200}>
                <div className="mb-8">
                    <GhostButton
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Campaign
                    </GhostButton>
                </div>
            </FadeInUp>

            {/* Create Campaign Form */}
            {showCreateForm && (
                <FadeInUp delay={300}>
                    <MinimalCard className="p-6 mb-8">
                        <H2 className="mb-6">Create Newsletter Campaign</H2>
                        
                        <div className="space-y-6">
                            <div>
                                <MonoText className="text-xs text-gray-700 mb-2">SUBJECT LINE</MonoText>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="Your newsletter subject line..."
                                />
                            </div>

                            <div>
                                <MonoText className="text-xs text-gray-700 mb-2">PREVIEW TEXT</MonoText>
                                <input
                                    type="text"
                                    value={formData.preview_text}
                                    onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="Preview text that appears in email clients..."
                                />
                            </div>

                            <div>
                                <MonoText className="text-xs text-gray-700 mb-2">FEATURED IMAGE URL</MonoText>
                                <input
                                    type="url"
                                    value={formData.featured_image}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div>
                                <MonoText className="text-xs text-gray-700 mb-2">CONTENT</MonoText>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={12}
                                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-mono text-sm resize-none"
                                    placeholder="Write your newsletter content here... Supports **bold**, *italic*, ### headings, and bullet points with -"
                                />
                                <MonoText className="text-xs text-gray-500 mt-2">
                                    Supports: **bold**, *italic*, ### headings, bullet points with -, links with [text](url)
                                </MonoText>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <GhostButton onClick={() => setShowCreateForm(false)}>
                                    Cancel
                                </GhostButton>
                                <GhostButton onClick={handleCreateCampaign}>
                                    Create Campaign
                                </GhostButton>
                            </div>
                        </div>
                    </MinimalCard>
                </FadeInUp>
            )}

            {/* Campaigns List */}
            <FadeInUp delay={400}>
                <MinimalCard className="p-6">
                    <H2 className="mb-6">Campaigns</H2>
                    
                    {campaigns.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <Body className="text-gray-500">No campaigns yet. Create your first newsletter!</Body>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="border border-gray-100 p-4 rounded">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <H3 className="mb-2">{campaign.subject}</H3>
                                            <Body className="text-gray-600 mb-3 line-clamp-2">
                                                {campaign.content.substring(0, 150)}...
                                            </Body>
                                            <div className="flex items-center gap-4 text-sm">
                                                {campaign.sent_at ? (
                                                    <>
                                                        <MonoText className="text-xs text-gray-500">
                                                            Sent {new Date(campaign.sent_at).toLocaleDateString()}
                                                        </MonoText>
                                                        <MonoText className="text-xs text-gray-500">
                                                            {campaign.recipient_count} recipients
                                                        </MonoText>
                                                        {campaign.open_rate && (
                                                            <MonoText className="text-xs text-gray-500">
                                                                {campaign.open_rate}% open rate
                                                            </MonoText>
                                                        )}
                                                    </>
                                                ) : (
                                                    <MonoText className="text-xs text-gray-500">Draft</MonoText>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            {!campaign.sent_at && (
                                                <GhostButton
                                                    onClick={() => handleSendCampaign(campaign.id)}
                                                    className="text-sm px-3 py-1"
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Send
                                                </GhostButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </MinimalCard>
            </FadeInUp>
        </Container>
    );
}