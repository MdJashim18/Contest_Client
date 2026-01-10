import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaTrophy, FaUsers, FaCalendarAlt, FaChartLine, FaShieldAlt, FaMedal, FaStar, FaAward, FaRegClock, FaRegSmile, FaCode, FaPaintBrush, FaPenNib, FaCamera, FaVideo } from 'react-icons/fa';
import { FiSearch, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { MdOutlinePayments, MdSupportAgent } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import { TbCategoryFilled } from 'react-icons/tb';

const HomePart = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentSlide, setCurrentSlide] = useState(0);

    const categories = [
        { id: 'coding', name: 'Coding Challenge', icon: FaCode, count: 15 },
        { id: 'design', name: 'UI/UX Design', icon: FaPaintBrush, count: 12 },
        { id: 'writing', name: 'Content Writing', icon: FaPenNib, count: 8 },
        { id: 'photo', name: 'Photography', icon: FaCamera, count: 10 },
        { id: 'video', name: 'Video Editing', icon: FaVideo, count: 6 },
        { id: 'business', name: 'Business Plan', icon: FaChartLine, count: 7 },
    ];

    const featuredContests = [
        { id: 1, name: 'Global Hackathon 2024', prize: '$25,000', participants: 850, category: 'coding', deadline: '2024-05-15' },
        { id: 2, name: 'UI Design Masterpiece', prize: '$15,000', participants: 420, category: 'design', deadline: '2024-04-30' },
        { id: 3, name: 'Content Creation Contest', prize: '$8,000', participants: 310, category: 'writing', deadline: '2024-05-10' },
        { id: 4, name: 'Photo Art Challenge', prize: '$12,000', participants: 560, category: 'photo', deadline: '2024-05-05' },
    ];


    const stats = [
        { value: '500+', label: 'Active Contests', icon: <FaTrophy /> },
        { value: '$2M+', label: 'Prize Distributed', icon: <MdOutlinePayments /> },
        { value: '50K+', label: 'Participants', icon: <FaUsers /> },
        { value: '95%', label: 'Satisfaction Rate', icon: <FaRegSmile /> },
    ];

  
    const testimonials = [
        { id: 1, name: 'Alex Johnson', role: 'Web Developer', content: 'Won $15,000 in coding contests. This platform changed my career!', rating: 5 },
        { id: 2, name: 'Sarah Chen', role: 'UI/UX Designer', content: 'Best platform for design contests. Great community and fair judging.', rating: 5 },
        { id: 3, name: 'Mike Rodriguez', role: 'Photographer', content: 'Participated in 10+ contests, won 3. Life-changing experience!', rating: 4 },
    ];

   
    const features = [
        { icon: <FaShieldAlt />, title: 'Secure Payments', desc: 'Guaranteed prize distribution' },
        { icon: <FaMedal />, title: 'Fair Judging', desc: 'Expert panel evaluation' },
        { icon: <FaChartLine />, title: 'Real-time Tracking', desc: 'Monitor your progress' },
        { icon: <MdSupportAgent />, title: '24/7 Support', desc: 'Always here to help' },
    ];

   
    const blogs = [
        { id: 1, title: 'How to Win Your First Contest', category: 'Tips', readTime: '5 min' },
        { id: 2, title: 'Top 10 Contest Strategies', category: 'Strategy', readTime: '8 min' },
        { id: 3, title: 'Prize Money Management', category: 'Finance', readTime: '6 min' },
    ];

  
    const faqs = [
        { question: 'How do I participate in contests?', answer: 'Register on our platform, browse contests, and click participate to get started.' },
        { question: 'When will I receive my prize money?', answer: 'Prize money is distributed within 7-14 days after contest results are announced.' },
        { question: 'Is there any registration fee?', answer: 'Most contests have a small registration fee, which varies by contest.' },
        { question: 'How are winners selected?', answer: 'Winners are selected by expert judges based on predefined criteria and participant voting.' },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 text-white py-20  px-4 flex items-center justify-center">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center">
                        <div className="lg:w-full mx-auto">
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Compete. Create. <span className="text-yellow-400">Win.</span>
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                                Join thousands of creators in exciting contests with massive prize pools.
                                Showcase your talent and earn recognition worldwide.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/contests')}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Explore Contests
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all"
                                >
                                    Get Started Free
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Find contests that match your skills and interests
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {categories.map((category) => {
                            const Icon = category.icon; 

                            return (
                                <div
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2 border-2 text-center
              ${activeCategory === category.id ? 'border-blue-500' : 'border-transparent'}`}
                                >
                                    <Icon className="text-4xl text-blue-600 mb-4 mx-auto" />
                                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {category.count} Contests
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


          
            <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-4 flex justify-center">{stat.icon}</div>
                                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-xl">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto ">
                    <div className="flex justify-between items-center mb-12">
                        <div className='text-center w-full'>
                            <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">Featured Contests</h2>
                            <p className="text-gray-600 text-center">High-value contests with massive prize pools</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredContests.map((contest) => (
                            <div key={contest.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            {contest.category.toUpperCase()}
                                        </div>
                                        <div className="text-yellow-500 flex items-center gap-1">
                                            <FaStar /> <span className="font-bold">Featured</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{contest.name}</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Prize Money</span>
                                            <span className="font-bold text-green-600">{contest.prize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Participants</span>
                                            <span className="font-bold">{contest.participants}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Deadline</span>
                                            <span className="font-bold">{contest.deadline}</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Hear from our successful participants
                        </p>
                    </div>
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                                        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">👤</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl">{testimonial.name}</h3>
                                                    <p className="text-gray-500">{testimonial.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-lg mb-6">{testimonial.content}</p>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
                        >
                            <FiChevronLeft className="text-2xl" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
                        >
                            <FiChevronRight className="text-2xl" />
                        </button>
                    </div>
                </div>
            </section>
            <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-600 text-lg">Get started in 4 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Sign Up', desc: 'Create your free account' },
                            { step: '2', title: 'Browse Contests', desc: 'Find contests matching your skills' },
                            { step: '3', title: 'Participate', desc: 'Submit your entry before deadline' },
                            { step: '4', title: 'Win Prizes', desc: 'Get judged and win amazing prizes' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-lg">Find answers to common questions</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex justify-between items-center cursor-pointer">
                                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                                    <span className="text-2xl">+</span>
                                </div>
                                <p className="mt-4 text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </section>

            <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6">Ready to Showcase Your Talent?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of creators who are already winning amazing prizes and recognition
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/all-contests')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Start Free Today
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePart;