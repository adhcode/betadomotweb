import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
    return (
        <>
            <Header />
            <main className="bg-white">
                {/* Hero Section */}
                <section className="pt-32 pb-16 bg-white">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8">
                        <div className="text-center mb-16">
                            <h1 className="font-cormorant font-normal text-6xl sm:text-7xl md:text-8xl text-primary-900 mb-8 leading-[0.85]">
                                About Betadomot
                            </h1>
                            <p className="font-proza text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto">
                                Your go-to destination for home inspiration that feels authentic, achievable, and uniquely you.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16 bg-neutral-50">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8">
                        <div className="prose prose-lg max-w-none">
                            <div className="grid md:grid-cols-2 gap-12 mb-16">
                                <div>
                                    <h2 className="font-cormorant font-bold text-2xl text-primary-900 mb-6">Our Mission</h2>
                                    <p className="font-proza text-neutral-700 leading-relaxed">
                                        We believe that creating a beautiful home shouldn't be overwhelming or expensive. 
                                        Betadomot exists to inspire and guide you through practical home solutions, 
                                        DIY projects, and design ideas that work for real life.
                                    </p>
                                </div>
                                <div>
                                    <h2 className="font-cormorant font-bold text-2xl text-primary-900 mb-6">What We Cover</h2>
                                    <ul className="font-proza text-neutral-700 space-y-3">
                                        <li>• DIY projects and home improvements</li>
                                        <li>• Home health and safety tips</li>
                                        <li>• Afrocentric design and cultural elements</li>
                                        <li>• Kitchen organization and daily living</li>
                                        <li>• Budget-friendly home solutions</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="text-center bg-white p-12 rounded-lg">
                                <h2 className="font-cormorant font-bold text-3xl text-primary-900 mb-6">
                                    Home Inspiration That Feels Like Home
                                </h2>
                                <p className="font-proza text-lg text-neutral-700 max-w-2xl mx-auto mb-8">
                                    Whether you're looking for weekend DIY projects, safety tips for your family, 
                                    or ways to incorporate your cultural heritage into your space, we're here to help 
                                    you create a home that truly reflects who you are.
                                </p>
                                <a 
                                    href="/blog" 
                                    className="inline-block px-8 py-4 bg-[#dca744] text-white font-medium text-sm tracking-[0.1em] uppercase rounded-lg hover:bg-[#c9963d] transition-all duration-300"
                                >
                                    Explore Our Blog
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}