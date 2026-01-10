import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { 
    FaSearch, 
    FaFilter, 
    FaSortAmountDown, 
    FaCalendarAlt, 
    FaDollarSign, 
    FaUsers,
    FaTrophy,
    FaFire,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaEye
} from 'react-icons/fa';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const PopularContests = () => {
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState('popularity');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const categories = useMemo(() => {
        const cats = [...new Set(contests.map(c => c.contestType).filter(Boolean))];
        return ['all', ...cats];
    }, [contests]);

    useEffect(() => {
        axiosSecure.get('/public-contest')
            .then(res => {
                setContests(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [axiosSecure]);

    useEffect(() => {
        let result = [...contests];

        if (searchTerm) {
            result = result.filter(contest =>
                contest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.contestType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            result = result.filter(contest => 
                contest.contestType === selectedCategory
            );
        }

        result = result.filter(contest =>
            (contest.price || 0) >= priceRange[0] &&
            (contest.price || 0) <= priceRange[1]
        );

        result.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.price || 0) - (b.price || 0);
                case 'price-high':
                    return (b.price || 0) - (a.price || 0);
                case 'participants':
                    return (b.participantsCount || 0) - (a.participantsCount || 0);
                case 'date-new':
                    return new Date(b.deadline) - new Date(a.deadline);
                case 'date-old':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'popularity':
                default:
                    return (b.participantsCount || 0) - (a.participantsCount || 0);
            }
        });

        setFilteredContests(result);
        setCurrentPage(1); 
    }, [contests, searchTerm, selectedCategory, priceRange, sortBy]);

   
    const paginatedContests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredContests.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredContests, currentPage]);

   
    const totalPages = Math.ceil(filteredContests.length / itemsPerPage);

    
    const handleDetails = (id) => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/Details/${id}`);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setPriceRange([0, 1000]);
        setSortBy('popularity');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Explore Contests
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover exciting contests, showcase your skills, and win amazing prizes
                    </p>
                </div>

               
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                       
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search contests by name, description, or category..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>

                        
                        <div className="w-full lg:w-64">
                            <div className="relative">
                                <FaSortAmountDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="popularity">Most Popular</option>
                                    <option value="participants">Most Participants</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="date-new">Newest First</option>
                                    <option value="date-old">Oldest First</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaFilter className="inline mr-2" />
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(0,6).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedCategory === category
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category === 'all' ? 'All Categories' : category}
                                    </button>
                                ))}
                            </div>
                        </div>

                       
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaDollarSign className="inline mr-2" />
                                Price Range: ${priceRange[0]} - ${priceRange[1]}
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                     
                        <div className="flex flex-col justify-between">
                            <div className="text-sm text-gray-600">
                                <span className="font-semibold text-indigo-600">{filteredContests.length}</span> contests found
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <FaTimes />
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>

                
                <div className="mb-10">
                    {filteredContests.length === 0 ? (
                      
                        <div className="text-center py-16 bg-white rounded-2xl shadow border border-gray-200">
                            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                                <FaSearch className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Contests Found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Try adjusting your search or filter criteria to find what you're looking for.
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="btn btn-primary"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedContests.slice(0,8).map((contest) => (
                                    <div
                                        key={contest._id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                    >
                                     
                                        <div className="relative overflow-hidden h-48">
                                            <img
                                                src={contest.image || 'https://via.placeholder.com/400x300?text=Contest+Image'}
                                                alt={contest.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {(contest.participantsCount || 0) > 50 && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <FaFire />
                                                    Popular
                                                </div>
                                            )}
                                            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                                {contest.contestType}
                                            </div>
                                        </div>

                                     
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                                {contest.name}
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {contest.description || 'No description available'}
                                            </p>

                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="flex items-center gap-1 text-gray-700">
                                                        <FaDollarSign className="text-green-500" />
                                                        <span className="font-semibold">${contest.price || 0}</span>
                                                        <span className="text-gray-500 ml-1">Entry Fee</span>
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-700">
                                                        <FaTrophy className="text-amber-500" />
                                                        <span className="font-semibold">${contest.prizeMoney?.toLocaleString() || 0}</span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="flex items-center gap-1 text-gray-700">
                                                        <FaUsers className="text-blue-500" />
                                                        <span>{contest.participantsCount || 0} Participants</span>
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-700">
                                                        <FaCalendarAlt className="text-purple-500" />
                                                        <span>{new Date(contest.deadline).toLocaleDateString()}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            
                                            <div className="flex justify-between items-center">
                                                <button
                                                    onClick={() => handleDetails(contest._id)}
                                                    className="btn btn-sm btn-primary flex items-center gap-2 group-hover:bg-indigo-700 transition-colors"
                                                >
                                                    <FaEye />
                                                    View Details
                                                </button>
                                                <div className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                                    {contest.contestType}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                           
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg ${
                                            currentPage === 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-10 h-10 rounded-lg font-medium ${
                                                        currentPage === page
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="px-2">...</span>;
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg ${
                                            currentPage === totalPages
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                
                {filteredContests.length > 0 && (
                    <div className="text-center">
                        <Link
                            to="/all-contests"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
                        >
                            View All Contests
                            <FaChevronRight />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopularContests;