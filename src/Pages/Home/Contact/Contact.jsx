import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';

const Contact = () => {

    const contactInfo = [
        { icon: <FaPhone />, title: 'Phone', info: '01992578305', desc: 'Mon-Fri, 9am-6pm' },
        { icon: <FaEnvelope />, title: 'Email', info: 'mdjashimuddinjnn22990@gmail.com', desc: '24/7 Support' },
    ];

    const faqCategories = [
        {
            title: 'Contest Questions',
            questions: [
                { q: 'How do I participate in a contest?', a: 'Browse contests, click participate, and follow instructions.' },
                { q: 'When are winners announced?', a: 'Typically 7-14 days after submission deadline.' },
            ]
        },
        {
            title: 'Payment & Prizes',
            questions: [
                { q: 'How are prizes distributed?', a: 'Via secure bank transfer or PayPal within 14 days.' },
                { q: 'Is there a participation fee?', a: 'Most contests have a small registration fee.' },
            ]
        },
        {
            title: 'Technical Support',
            questions: [
                { q: 'Having trouble submitting?', a: 'Clear cache and try again, or contact support.' },
                { q: 'File upload issues?', a: 'Ensure files are under 100MB and in supported formats.' },
            ]
        }
    ];


    return (
        <div className="min-h-screen">
          
            <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        We're here to help! Reach out with questions, feedback, or support needs
                    </p>
                </div>
            </section>

          
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="">
                       
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Get in Touch</h2>
                        <div className='flex justify-center items-center w-full md:w-[60%] mx-auto p-5 gap-10 border border-gray-100 shadow-md rounded-3xl'>
                            
                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <div className="text-blue-600 text-xl">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                                            <p className="text-gray-700 font-medium">{item.info}</p>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                         
                            <div className=" bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <MdSupportAgent className="text-blue-600 text-2xl" />
                                    <h3 className="font-bold text-lg">Support Response Time</h3>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Email Support</span>
                                        <span className="font-semibold">Within 24 hours</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Live Chat</span>
                                        <span className="font-semibold">5-10 minutes</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Urgent Issues</span>
                                        <span className="font-semibold">Priority Support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-lg">Quick answers to common questions</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {faqCategories.map((category, catIndex) => (
                            <div key={catIndex} className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold mb-6 text-gray-900">{category.title}</h3>
                                <div className="space-y-4">
                                    {category.questions.map((item, itemIndex) => (
                                        <div key={itemIndex} className="border-b border-gray-100 pb-4 last:border-0">
                                            <h4 className="font-semibold text-gray-800 mb-2">{item.q}</h4>
                                            <p className="text-gray-600 text-sm">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;