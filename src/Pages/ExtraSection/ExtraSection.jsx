import { FaTrophy, FaMoneyBillWave, FaShieldAlt, FaRocket } from "react-icons/fa";

const ExtraSection = () => {
    return (
        <section className="py-16 bg-gray-100 my-10">
            <div className="max-w-7xl mx-auto px-6">

               
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Why Choose <span className="text-indigo-600">ContestHub?</span>
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        ContestHub is a trusted platform where creativity meets opportunity.
                        Compete, grow your skills, and win real rewards.
                    </p>
                </div>

               
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
                        <FaTrophy className="text-5xl text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Real Competitions</h3>
                        <p className="text-gray-600 text-sm">
                            Participate in fair and skill-based contests designed for real talents.
                        </p>
                    </div>

                    
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
                        <FaMoneyBillWave className="text-5xl text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Cash Prizes</h3>
                        <p className="text-gray-600 text-sm">
                            Win genuine prize money and rewards for your creativity and effort.
                        </p>
                    </div>

                    
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
                        <FaShieldAlt className="text-5xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Transparent Results</h3>
                        <p className="text-gray-600 text-sm">
                            100% transparent judging system with trusted and verified winners.
                        </p>
                    </div>

                   
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
                        <FaRocket className="text-5xl text-purple-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Grow Your Skills</h3>
                        <p className="text-gray-600 text-sm">
                            Improve your skills, build confidence, and get recognized globally.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ExtraSection;
