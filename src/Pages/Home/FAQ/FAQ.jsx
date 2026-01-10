import React, { useState } from 'react';
import { FaSearch, FaQuestionCircle, FaTrophy, FaUser, FaCreditCard, FaLock, FaFileAlt, FaClock, FaMedal, FaShieldAlt } from 'react-icons/fa';
import { MdOutlinePayments, MdSupportAgent } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const categories = [
        { id: 'all', name: 'All Questions', icon: <FaQuestionCircle />, count: 25 },
        { id: 'contests', name: 'Contest Participation', icon: <FaTrophy />, count: 8 },
        { id: 'account', name: 'Account & Profile', icon: <FaUser />, count: 5 },
        { id: 'payments', name: 'Payments & Prizes', icon: <FaCreditCard />, count: 6 },
        { id: 'security', name: 'Security & Privacy', icon: <FaLock />, count: 3 },
        { id: 'technical', name: 'Technical Support', icon: <MdSupportAgent />, count: 3 },
    ];

    const allFaqs = [
        {
            id: 1,
            category: 'contests',
            question: 'How do I participate in a contest?',
            answer: 'Browse available contests on our platform, click on "Participate Now" for the contest you\'re interested in, complete the registration process, pay the entry fee (if applicable), and submit your work before the deadline.'
        },
        {
            id: 2,
            category: 'contests',
            question: 'What are the contest submission guidelines?',
            answer: 'Each contest has specific submission requirements. Generally, submissions must be original work, follow the contest theme, and meet format requirements (file types, sizes, etc.). Always check the individual contest rules before submitting.'
        },
        {
            id: 3,
            category: 'contests',
            question: 'How are winners selected?',
            answer: 'Winners are selected through a combination of expert judge evaluation (70%) and community voting (30%). Judges evaluate based on creativity, technical skill, adherence to theme, and overall quality. The process is transparent and fair.'
        },
        {
            id: 4,
            category: 'payments',
            question: 'When will I receive my prize money?',
            answer: 'Prize money is distributed within 7-14 business days after contest results are officially announced. Payments are made via secure bank transfer, PayPal, or other methods specified in the contest rules.'
        },
        {
            id: 5,
            category: 'payments',
            question: 'Is there a registration fee for contests?',
            answer: 'Most contests have a small registration fee that helps cover platform costs and prize pools. Some beginner-friendly contests may be free. The fee amount is clearly displayed before registration.'
        },
        {
            id: 6,
            category: 'account',
            question: 'How do I create an account?',
            answer: 'Click "Sign Up" on the top right corner, enter your email, create a password, and verify your email address. You can also sign up using your Google or GitHub account for faster registration.'
        },
        {
            id: 7,
            category: 'account',
            question: 'Can I update my profile information?',
            answer: 'Yes, you can update your profile anytime by going to "My Profile" in your dashboard. You can change your display name, bio, profile picture, and notification preferences.'
        },
        {
            id: 8,
            category: 'security',
            question: 'Is my payment information secure?',
            answer: 'Absolutely. We use industry-standard SSL encryption and partner with secure payment processors like Stripe and PayPal. We never store your complete payment information on our servers.'
        },
        {
            id: 9,
            category: 'technical',
            question: 'What if I face technical issues during submission?',
            answer: 'If you encounter technical issues, try clearing your browser cache, using a different browser, or checking your internet connection. If problems persist, contact our support team immediately.'
        },
        {
            id: 10,
            category: 'contests',
            question: 'Can I submit multiple entries to one contest?',
            answer: 'Generally, only one entry per participant is allowed per contest. However, some contests may allow multiple submissions - this will be clearly mentioned in the contest rules.'
        },
        {
            id: 11,
            category: 'payments',
            question: 'Are there any taxes on prize money?',
            answer: 'Yes, prize money is considered taxable income in most countries. Winners are responsible for reporting and paying any applicable taxes according to their local laws and regulations.'
        },
        {
            id: 12,
            category: 'account',
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page, enter your registered email, and follow the instructions sent to your email to reset your password.'
        },
    ];

    const filteredFaqs = allFaqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const popularQuestions = [
        { id: 1, question: 'How do I participate in contests?' },
        { id: 2, question: 'When will I receive prize money?' },
        { id: 3, question: 'Is my payment information secure?' },
        { id: 4, question: 'How are winners selected?' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
           
            <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                            Find quick answers to common questions about contests, payments, accounts, and more
                        </p>
                    
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                   
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FaQuestionCircle className="text-blue-600" />
                                Categories
                            </h2>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeCategory === category.id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${activeCategory === category.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {category.icon}
                                            </div>
                                            <span className={`font-medium ${activeCategory === category.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {category.name}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-sm ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>

                    <div className="lg:w-3/4">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {activeCategory === 'all' ? 'All Questions' : categories.find(c => c.id === activeCategory)?.name}
                            </h2>
                            <p className="text-gray-600">
                                {filteredFaqs.length} questions found
                            </p>
                        </div>

                        {filteredFaqs.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaSearch className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No questions found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try different search terms or browse by category
                                </p>
                                <button 
                                    onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    View All Questions
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFaqs.map((faq) => (
                                    <div key={faq.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleItem(faq.id)}
                                            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                    <div className="text-blue-600">
                                                        {categories.find(c => c.id === faq.category)?.icon}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {faq.question}
                                                    </h3>
                                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                        {categories.find(c => c.id === faq.category)?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`text-2xl transition-transform ${openItems[faq.id] ? 'rotate-180' : ''}`}>
                                                ▼
                                            </div>
                                        </button>
                                        {openItems[faq.id] && (
                                            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                                <div className="pl-14">
                                                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                                    {faq.category === 'payments' && faq.id === 4 && (
                                                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FaClock className="text-green-600" />
                                                                <span className="font-semibold text-green-800">Payment Timeline</span>
                                                            </div>
                                                            <div className="text-sm text-green-700">
                                                                Contest ends → 3-5 days for judging → Results announced → 7-14 days for payment processing
                                                            </div>
                                                        </div>
                                                    )}
                                                    {faq.category === 'contests' && faq.id === 3 && (
                                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FaMedal className="text-blue-600" />
                                                                <span className="font-semibold text-blue-800">Judging Criteria</span>
                                                            </div>
                                                            <div className="text-sm text-blue-700">
                                                                Creativity (30%) • Technical Skill (25%) • Adherence to Theme (25%) • Overall Impact (20%)
                                                            </div>
                                                        </div>
                                                    )}
                                                    {faq.category === 'security' && (
                                                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FaShieldAlt className="text-purple-600" />
                                                                <span className="font-semibold text-purple-800">Security Features</span>
                                                            </div>
                                                            <div className="text-sm text-purple-700">
                                                                SSL Encryption • Two-Factor Authentication • Regular Security Audits • GDPR Compliant
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaFileAlt className="text-blue-600 text-2xl" />
                                    <h3 className="font-bold text-gray-900">Contest Guidelines</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Read our comprehensive contest participation guidelines and rules
                                </p>
                                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                    Read Guidelines →
                                </button>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <MdOutlinePayments className="text-green-600 text-2xl" />
                                    <h3 className="font-bold text-gray-900">Payment Policy</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Learn about payment methods, processing times, and prize distribution
                                </p>
                                <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                                    View Policy →
                                </button>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaLock className="text-purple-600 text-2xl" />
                                    <h3 className="font-bold text-gray-900">Privacy & Security</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Understand how we protect your data and ensure secure transactions
                                </p>
                                <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">
                                    Security Info →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;