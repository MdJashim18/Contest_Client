import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const ReviewCard = ({review}) => {

    const {userName , review:testimonial ,user_photoURL } = review
    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-md">
            {/* Quote Icon */}
            <FaQuoteLeft className="text-4xl text-gray-400 mb-4" />

            {/* Main Text */}
            <p className=" mb-6">
                {testimonial}
            </p>

            {/* Dotted Divider */}
            <hr className="border-t-2 border-dotted border-gray-400 mb-6" />

            {/* Profile Section */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0B4B4D] rounded-full">
                    <img src={user_photoURL} alt="" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#0B4B4D]">
                        {userName}
                    </h3>
                    <p className="text-gray-600 text-sm">Senior Product Designer</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;