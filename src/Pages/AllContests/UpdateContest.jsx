import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import {
    FiEdit, FiCalendar, FiDollarSign, FiImage,
    FiTag, FiFileText, FiArrowLeft, FiCheckCircle
} from "react-icons/fi";

const UpdateContest = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(""); 
    const [newImageFile, setNewImageFile] = useState(null); 

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        values: contest,
    });

    const watchFile = watch("newImage");

    useEffect(() => {
        const loadContest = async () => {
            try {
                const res = await axiosSecure.get(`/contest/${id}`);
                const data = res.data;

                if (data.deadline) data.deadline = data.deadline.slice(0, 16);

                setContest(data);
                setImagePreview(data.image); 
            } catch (error) {
                console.error("Error fetching contest:", error);
            }
        };

        loadContest();
    }, [id, axiosSecure]);

  
    useEffect(() => {
        if (watchFile && watchFile.length > 0) {
            const file = watchFile[0];
            setNewImageFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    }, [watchFile]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            let imageUrl = contest.image;

            if (newImageFile) {
                const formData = new FormData();
                formData.append("image", newImageFile);

                const uploadRes = await axiosSecure.post("/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                imageUrl = uploadRes.data.url; 
            }

            const updatedContest = {
                ...data,
                image: imageUrl,
                price: Number(data.price),
                prizeMoney: Number(data.prizeMoney),
            };

            const res = await axiosSecure.patch(`/contest/${id}`, updatedContest);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Contest details have been successfully modified.",
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate("/dashboard/ShowContestTable");
            } else {
                Swal.fire("No Changes", "You didn't modify any field.", "info");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong while updating.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!contest) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="loading loading-spinner loading-lg text-blue-600"></div>
                <p className="text-gray-500 font-medium animate-pulse">Fetching contest details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <FiArrowLeft className="mr-1" /> Back to Dashboard
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">Update Contest</h2>
                    <p className="text-gray-500">Refine and edit your contest details here.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                            <FiFileText className="mr-2 text-blue-500" /> General Information
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Contest Name</label>
                                <div className="relative">
                                    <FiEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...register("name", { required: "Name is required" })}
                                        className={`input input-bordered w-full pl-10 focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-100' : 'focus:ring-blue-100 border-gray-200'}`}
                                        placeholder="Enter contest name"
                                    />
                                </div>
                                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                            </div>

                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Description</label>
                                <textarea
                                    {...register("description", { required: "Description is required" })}
                                    className={`textarea textarea-bordered w-full h-32 focus:ring-2 ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Describe the contest objectives..."
                                />
                                {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                            </div>

                        
                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Contest Image</label>
                                <div className="items-center space-x-4">
                                    <img
                                        src={imagePreview}
                                        alt="Contest Preview"
                                        className="w-full mb-5 h-40 object-cover rounded-lg border border-gray-200"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register("newImage")}
                                        className="file-input file-input-bordered file-input-sm w-full "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                            <FiCheckCircle className="mr-2 text-purple-500" /> Instructions & Resources
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Task Instruction</label>
                                <textarea
                                    {...register("taskInstruction", { required: "Instructions are required" })}
                                    className="textarea textarea-bordered w-full h-24 border-gray-200 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Provide step-by-step instructions for participants..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing & Logistics</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Registration Fee</label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                                    <input
                                        type="number"
                                        {...register("price", { required: true, min: 0 })}
                                        className="input input-bordered w-full pl-10 bg-green-50/30 border-green-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Prize Pool</label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600" />
                                    <input
                                        type="number"
                                        {...register("prizeMoney", { required: true, min: 0 })}
                                        className="input input-bordered w-full pl-10 bg-orange-50/30 border-orange-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Category</label>
                                <div className="relative">
                                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        {...register("contestType", { required: true })}
                                        className="select select-bordered w-full pl-10 border-gray-200"
                                    >
                                        <option value="Design">Design</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Database">Database</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Mobile Development">Mobile Development</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Writing">Writing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label text-sm font-semibold text-gray-600">Deadline</label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input
                                        type="datetime-local"
                                        {...register("deadline", { required: true })}
                                        className="input input-bordered w-full pl-10 border-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn w-full border-none text-white shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
                                >
                                    {isSubmitting ? "Updating..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-outline w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateContest;
