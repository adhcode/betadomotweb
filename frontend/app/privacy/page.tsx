import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/DesignSystem';

export const metadata = {
    title: 'Privacy Policy | BetaDomot',
    description: 'Learn how BetaDomot collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-24 pb-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-cormorant font-light text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-sm text-gray-500 mb-8 font-proza">Last updated: December 27, 2024</p>

                        <div className="prose prose-lg max-w-none font-proza">
                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                At BetaDomot, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                                <li>Email address when you subscribe to our newsletter</li>
                                <li>Name and comments when you engage with our content</li>
                                <li>Usage data and analytics through cookies</li>
                            </ul>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                                <li>Send you our newsletter and updates</li>
                                <li>Respond to your comments and questions</li>
                                <li>Improve our website and content</li>
                                <li>Analyze how visitors use our site</li>
                            </ul>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                                <li>Access the personal information we hold about you</li>
                                <li>Request correction of your personal information</li>
                                <li>Request deletion of your personal information</li>
                                <li>Unsubscribe from our newsletter at any time</li>
                            </ul>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                If you have any questions about this Privacy Policy, please contact us at hello@betadomot.blog
                            </p>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </>
    );
}
