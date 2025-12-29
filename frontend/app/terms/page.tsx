import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/DesignSystem';

export const metadata = {
    title: 'Terms of Service | BetaDomot',
    description: 'Terms and conditions for using BetaDomot website and services.',
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-24 pb-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-cormorant font-light text-gray-900 mb-4">Terms of Service</h1>
                        <p className="text-sm text-gray-500 mb-8 font-proza">Last updated: December 27, 2024</p>

                        <div className="prose prose-lg max-w-none font-proza">
                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Agreement to Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                By accessing and using BetaDomot, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Use License</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Permission is granted to temporarily access the materials on BetaDomot for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose</li>
                                <li>Remove any copyright or proprietary notations</li>
                                <li>Transfer the materials to another person</li>
                            </ul>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Content</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                All content on BetaDomot, including text, images, and graphics, is the property of BetaDomot and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">User Comments</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                By posting comments on our site, you grant BetaDomot a non-exclusive, royalty-free license to use, reproduce, and publish your comments. We reserve the right to remove any comments that we deem inappropriate or offensive.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Disclaimer</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                The materials on BetaDomot are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties. We do not warrant that the materials are accurate, reliable, or correct.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Limitations</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                BetaDomot shall not be held liable for any damages arising out of the use or inability to use the materials on our website.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                We reserve the right to revise these terms of service at any time. By using this website, you agree to be bound by the current version of these Terms of Service.
                            </p>

                            <h2 className="text-2xl font-gilroy font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                If you have any questions about these Terms of Service, please contact us at hello@betadomot.blog
                            </p>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </>
    );
}
