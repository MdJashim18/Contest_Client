import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';
import { 
  FaUpload, 
  FaDollarSign, 
  FaTrophy, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaImage, 
  FaCode, 
  FaPalette, 
  FaPenNib, 
  FaCamera,
  FaDatabase,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { MdDescription, MdTitle, MdEmail } from 'react-icons/md';
import { GiTargetPrize } from 'react-icons/gi';

const CreateContest = () => {
    const axiosSecure = UseAxiosSecure();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();

    const contestType = watch('contestType');
    const imageFile = watch('image');

    React.useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }, [imageFile]);

    const getContestTypeIcon = (type) => {
        const icons = {
            'Design': <FaPalette className="text-purple-500" />,
            'Development': <FaCode className="text-blue-500" />,
            'Writing': <FaPenNib className="text-green-500" />,
            'Photography': <FaCamera className="text-amber-500" />,
            'Programming': <FaCode className="text-indigo-500" />,
            'Database': <FaDatabase className="text-red-500" />,
            'UI/UX Design': <FaPalette className="text-pink-500" />
        };
        return icons[type] || <FaCode />;
    };

    const handleCreateContest = async (data) => {
        try {
            setIsSubmitting(true);
            setUploadProgress(10);

            const imageFile = data.image[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
            
            setUploadProgress(30);
            const imgRes = await axios.post(imageApiUrl, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(30 + Math.floor(percentCompleted * 0.6));
                }
            });
            
            setUploadProgress(90);
            const imageURL = imgRes.data.data.url;

            const contestData = {
                name: data.name,
                image: imageURL,
                description: data.description,
                price: Number(data.price),
                prizeMoney: Number(data.prizeMoney),
                taskInstruction: data.taskInstruction,
                contestType: data.contestType,
                deadline: new Date(data.deadline),
                participantsCount: 0,
                participants: [],
                winner: {},
                status: 'pending',
                createdAt: new Date(),
                tasks: {},
                creatorEmail: data.CreatorEmailForTask,
                tags: [data.contestType.toLowerCase(), 'contest', 'competition']
            };

            const res = await axiosSecure.post('/contest', contestData);
            setUploadProgress(100);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Contest Created Successfully!',
                    html: `
                        <div class="text-left">
                            <p class="mb-3">Your contest "<strong>${data.name}</strong>" has been created and submitted for approval.</p>
                            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p class="font-semibold text-green-800">Contest Details:</p>
                                <ul class="text-sm text-green-700 mt-2 space-y-1">
                                    <li>• Prize: $${data.prizeMoney.toLocaleString()}</li>
                                    <li>• Entry Fee: $${data.price}</li>
                                    <li>• Type: ${data.contestType}</li>
                                    <li>• Deadline: ${new Date(data.deadline).toLocaleDateString()}</li>
                                </ul>
                            </div>
                        </div>
                    `,
                    showConfirmButton: true,
                    confirmButtonText: 'View Contests',
                    confirmButtonColor: '#3B82F6',
                    showCancelButton: true,
                    cancelButtonText: 'Create Another',
                    customClass: {
                        popup: 'rounded-xl'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/dashboard/ShowContestTable';
                    }
                });
                
                reset();
                setImagePreview(null);
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Creation Failed',
                html: `
                    <div class="text-left">
                        <p class="mb-3">Failed to create contest. Please try again.</p>
                        <div class="bg-red-50 p-3 rounded-lg border border-red-200">
                            <p class="text-sm text-red-700">${error.message || 'Unknown error occurred'}</p>
                        </div>
                    </div>
                `,
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#EF4444',
                customClass: {
                    popup: 'rounded-xl'
                }
            });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const contestTypes = [
        { value: 'UI/UX Design', label: 'UI/UX Design', icon: <FaPalette /> },
        { value: 'Web Development', label: 'Web Development', icon: <FaCode /> },
        { value: 'Mobile Development', label: 'Mobile Development', icon: <FaCode /> },
        { value: 'Graphic Design', label: 'Graphic Design', icon: <FaPalette /> },
        { value: 'Content Writing', label: 'Content Writing', icon: <FaPenNib /> },
        { value: 'Photography', label: 'Photography', icon: <FaCamera /> },
        { value: 'Video Editing', label: 'Video Editing', icon: <FaCamera /> },
        { value: 'Data Science', label: 'Data Science', icon: <FaDatabase /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
             
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create New Contest
                    </h1>
                    <p className="text-gray-600 mt-2">Fill in the details below to launch your contest</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                          
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Contest Details</h2>
                                        <p className="opacity-90">Fill all required fields</p>
                                    </div>
                                    <div className="p-3 bg-white/20 rounded-lg">
                                        <GiTargetPrize className="text-2xl" />
                                    </div>
                                </div>
                            </div>

                         
                            {isSubmitting && (
                                <div className="px-6 pt-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span>Uploading Contest...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                           
                            <form onSubmit={handleSubmit(handleCreateContest)} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MdEmail />
                                            Creator Email
                                        </label>
                                        <input
                                            type="email"
                                            {...register('CreatorEmailForTask', { 
                                                required: 'Creator email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            className={`input input-bordered w-full ${errors.CreatorEmailForTask ? 'input-error' : ''}`}
                                            placeholder="creator@example.com"
                                        />
                                        {errors.CreatorEmailForTask && (
                                            <span className="text-red-500 text-sm flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.CreatorEmailForTask.message}
                                            </span>
                                        )}
                                    </div>

                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MdTitle />
                                            Contest Name *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name', { 
                                                required: 'Contest name is required',
                                                minLength: {
                                                    value: 5,
                                                    message: 'Minimum 5 characters required'
                                                }
                                            })}
                                            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                                            placeholder="e.g., Amazing UI Design Challenge"
                                        />
                                        {errors.name && (
                                            <span className="text-red-500 text-sm flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.name.message}
                                            </span>
                                        )}
                                    </div>
                                </div>

                              
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FaCode />
                                        Contest Type *
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {contestTypes.map((type) => (
                                            <label 
                                                key={type.value}
                                                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    contestType === type.value 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={type.value}
                                                    {...register('contestType', { required: 'Please select a contest type' })}
                                                    className="hidden"
                                                />
                                                <span className={`text-2xl mb-2 ${contestType === type.value ? 'text-blue-500' : 'text-gray-400'}`}>
                                                    {type.icon}
                                                </span>
                                                <span className={`text-sm font-medium ${contestType === type.value ? 'text-blue-700' : 'text-gray-600'}`}>
                                                    {type.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.contestType && (
                                        <span className="text-red-500 text-sm flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.contestType.message}
                                        </span>
                                    )}
                                </div>

                               
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FaImage />
                                        Contest Banner Image *
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            {...register('image', { required: 'Contest image is required' })}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="flex flex-col items-center">
                                                <FaUpload className="text-3xl text-gray-400 mb-3" />
                                                <p className="text-gray-600 mb-2">
                                                    <span className="font-medium text-blue-500">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.image && (
                                        <span className="text-red-500 text-sm flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.image.message}
                                        </span>
                                    )}
                                    
                                   
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        document.getElementById('image-upload').value = '';
                                                        setImagePreview(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <FaExclamationCircle />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                               
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MdDescription />
                                        Description *
                                    </label>
                                    <textarea
                                        {...register('description', { 
                                            required: 'Description is required',
                                            minLength: {
                                                value: 50,
                                                message: 'Minimum 50 characters required'
                                            }
                                        })}
                                        className={`textarea textarea-bordered w-full h-32 ${errors.description ? 'textarea-error' : ''}`}
                                        placeholder="Describe your contest in detail. What are the requirements? What are you looking for in submissions?"
                                    />
                                    {errors.description && (
                                        <span className="text-red-500 text-sm flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.description.message}
                                        </span>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Tip: Be specific about requirements and judging criteria
                                    </p>
                                </div>

                              
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <FaDollarSign />
                                            Entry Fee ($) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                {...register('price', { 
                                                    required: 'Entry fee is required',
                                                    min: {
                                                        value: 0,
                                                        message: 'Entry fee must be positive'
                                                    }
                                                })}
                                                className={`input input-bordered w-full pl-8 ${errors.price ? 'input-error' : ''}`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && (
                                            <span className="text-red-500 text-sm flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.price.message}
                                            </span>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Amount participants pay to join
                                        </p>
                                    </div>

                                  
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <FaTrophy />
                                            Prize Money ($) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                {...register('prizeMoney', { 
                                                    required: 'Prize money is required',
                                                    min: {
                                                        value: 0,
                                                        message: 'Prize money must be positive'
                                                    }
                                                })}
                                                className={`input input-bordered w-full pl-8 ${errors.prizeMoney ? 'input-error' : ''}`}
                                                placeholder="1000.00"
                                            />
                                        </div>
                                        {errors.prizeMoney && (
                                            <span className="text-red-500 text-sm flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.prizeMoney.message}
                                            </span>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Total prize pool for winners
                                        </p>
                                    </div>
                                </div>

                               
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FaFileAlt />
                                        Task Instructions *
                                    </label>
                                    <textarea
                                        {...register('taskInstruction', { 
                                            required: 'Task instructions are required',
                                            minLength: {
                                                value: 20,
                                                message: 'Minimum 20 characters required'
                                            }
                                        })}
                                        className={`textarea textarea-bordered w-full h-24 ${errors.taskInstruction ? 'textarea-error' : ''}`}
                                        placeholder="Clear instructions for participants. What should they submit? Format? Size? Requirements?"
                                    />
                                    {errors.taskInstruction && (
                                        <span className="text-red-500 text-sm flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.taskInstruction.message}
                                        </span>
                                    )}
                                </div>

                             
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FaCalendarAlt />
                                        Submission Deadline *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('deadline', { 
                                            required: 'Deadline is required',
                                            validate: value => {
                                                const selectedDate = new Date(value);
                                                const now = new Date();
                                                return selectedDate > now || 'Deadline must be in the future';
                                            }
                                        })}
                                        className={`input input-bordered w-full ${errors.deadline ? 'input-error' : ''}`}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                    {errors.deadline && (
                                        <span className="text-red-500 text-sm flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.deadline.message}
                                        </span>
                                    )}
                                </div>

                                
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                                            isSubmitting 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                                        } text-white flex items-center justify-center gap-3`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Creating Contest...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                Launch Contest
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                   
                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaTrophy className="text-amber-500" />
                                Contest Preview
                            </h3>
                            <div className="space-y-4">
                                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Contest Preview" 
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">Upload image to preview</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            {watch('name') || 'Contest Name'}
                                        </h4>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {watch('description') || 'Contest description will appear here...'}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {contestType && getContestTypeIcon(contestType)}
                                            <span className="text-sm font-medium text-gray-700">
                                                {contestType || 'Select Type'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">
                                                ${watch('prizeMoney')?.toLocaleString() || '0'}
                                            </div>
                                            <div className="text-xs text-gray-500">Prize Pool</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                      
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaExclamationCircle className="text-blue-500" />
                                Pro Tips
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                                        <FaCheckCircle className="text-blue-500 text-xs" />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Be specific in task instructions
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                                        <FaCheckCircle className="text-blue-500 text-xs" />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Set realistic deadlines (7-30 days)
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                                        <FaCheckCircle className="text-blue-500 text-xs" />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Use high-quality images for better engagement
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                                        <FaCheckCircle className="text-blue-500 text-xs" />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Review all details before submission
                                    </span>
                                </li>
                            </ul>
                        </div>

                      
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        ${watch('price') || '0'}
                                    </div>
                                    <div className="text-xs text-gray-600">Entry Fee</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-600">
                                        ${watch('prizeMoney') || '0'}
                                    </div>
                                    <div className="text-xs text-gray-600">Prize Money</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateContest;