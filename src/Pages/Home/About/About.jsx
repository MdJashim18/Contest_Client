import React from 'react';
import { Link } from 'react-router';
import { FaTrophy, FaUsers, FaAward, FaHandshake, FaRocket, FaHeart } from 'react-icons/fa';
import { MdDiversity3, MdSecurity } from 'react-icons/md';
import { GiAchievement } from 'react-icons/gi';

const About = () => {
    const team = [
        { name: 'Sarah Johnson', role: 'CEO & Founder' },
        { name: 'Michael Chen', role: 'CTO' },
        { name: 'Emma Davis', role: 'Head of Community' },
        { name: 'David Wilson', role: 'Marketing Director' },
    ];

    const values = [
        { icon: <FaAward />, title: 'Excellence', desc: 'We strive for excellence in everything we do' },
        { icon: <MdDiversity3 />, title: 'Inclusivity', desc: 'Everyone deserves a chance to shine' },
        { icon: <FaHandshake />, title: 'Integrity', desc: 'Fairness and transparency in all contests' },
        { icon: <MdSecurity />, title: 'Security', desc: 'Your data and payments are always secure' },
        { icon: <FaHeart />, title: 'Community', desc: 'Building a supportive creative community' },
        { icon: <GiAchievement />, title: 'Innovation', desc: 'Constantly improving our platform' },
    ];

    return (
        <div className="min-h-screen">
           
            <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">About ContestHub</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Empowering creators worldwide through fair competition and massive opportunities
                    </p>
                </div>
            </section>

           
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-700">
                                <p>
                                    Founded in 2020, ContestHub started with a simple mission: to create a platform where talent meets opportunity. 
                                    We noticed that many creative individuals lacked proper avenues to showcase their skills and get recognized.
                                </p>
                                <p>
                                    What began as a small community for local design competitions has grown into a global platform hosting 
                                    thousands of contests across multiple categories, distributing millions in prize money.
                                </p>
                                <p>
                                    Today, we're proud to have helped thousands of creators launch their careers, win life-changing prizes, 
                                    and connect with opportunities worldwide.
                                </p>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <FaTrophy className="text-4xl text-yellow-500 mb-4" />
                                        <div className="text-3xl font-bold text-gray-900">500+</div>
                                        <div className="text-gray-600">Contests Hosted</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <FaUsers className="text-4xl text-blue-500 mb-4" />
                                        <div className="text-3xl font-bold text-gray-900">50K+</div>
                                        <div className="text-gray-600">Community Members</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <FaAward className="text-4xl text-green-500 mb-4" />
                                        <div className="text-3xl font-bold text-gray-900">$2M+</div>
                                        <div className="text-gray-600">Prize Distributed</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <FaRocket className="text-4xl text-purple-500 mb-4" />
                                        <div className="text-3xl font-bold text-gray-900">30+</div>
                                        <div className="text-gray-600">Countries Served</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                <div className="text-blue-600 text-4xl mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            The passionate individuals behind ContestHub
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden text-center hover:shadow-xl transition-all">
                                <div className="p-8">
                                   
                                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                    <p className="text-blue-600 mb-4">{member.role}</p>
                                    <p className="text-gray-600 text-sm">
                                        Passionate about creating opportunities for creators worldwide
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           
            <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Be part of a platform that truly values creativity and talent
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        
                        <Link to="/contact">
                            <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;