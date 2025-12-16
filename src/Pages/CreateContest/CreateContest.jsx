import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const CreateContest = () => {
    const axiosSecure = UseAxiosSecure();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleCreateContest = async (data) => {
        try {
            // ================= Upload Image =================
            const imageFile = data.image[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
            const imgRes = await axios.post(imageApiUrl, formData);
            const imageURL = imgRes.data.data.url;

            // ================= Contest Object =================
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
                winner: null,
                status: 'pending',
                createdAt: new Date(),
                tasks: {},
                creatorEmail:data.CreatorEmailForTask
            };

            // ================= Save to DB =================
            const res = await axiosSecure.post('/contest', contestData);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Contest Created',
                    text: 'Contest created successfully',
                    timer: 1500,
                    showConfirmButton: false,
                });
                reset();
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.message || 'Contest creation failed',
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
            <div className="bg-base-100 shadow-xl rounded-2xl p-8">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Create Contest
                </h2>

                <form onSubmit={handleSubmit(handleCreateContest)} className="space-y-4">
                    <div>
                        <label className="label font-medium">Creator Email</label>
                        <input
                            type="text"
                            {...register('CreatorEmailForTask', { required: true })}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Contest Name */}
                    <div>
                        <label className="label font-medium">Contest Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Contest name"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                Contest name is required
                            </span>
                        )}
                    </div>

                    {/* Image */}
                    <div>
                        <label className="label font-medium">Contest Image</label>
                        <input
                            type="file"
                            {...register('image', { required: true })}
                            className="file-input file-input-bordered w-full"
                        />
                        {errors.image && (
                            <span className="text-red-500 text-sm">
                                Image is required
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label font-medium">Description</label>
                        <textarea
                            {...register('description', { required: true })}
                            className="textarea textarea-bordered w-full"
                            placeholder="Contest description"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="label font-medium">Participation Price</label>
                        <input
                            type="number"
                            {...register('price', { required: true })}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Prize Money */}
                    <div>
                        <label className="label font-medium">Prize Money</label>
                        <input
                            type="number"
                            {...register('prizeMoney', { required: true })}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Task Instruction */}
                    <div>
                        <label className="label font-medium">Task Instruction</label>
                        <input
                            type="text"
                            {...register('taskInstruction', { required: true })}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Contest Type */}
                    <div>
                        <label className="label font-medium">Contest Type</label>
                        <select
                            {...register('contestType', { required: true })}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select contest type</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                            <option value="Writing">Writing</option>
                            <option value="Photography">Photography</option>
                        </select>
                    </div>

                    {/* Deadline (NO react-datepicker) */}
                    <div>
                        <label className="label font-medium">Deadline</label>
                        <input
                            type="datetime-local"
                            {...register('deadline', { required: true })}
                            className="input input-bordered w-full"
                        />
                        {errors.deadline && (
                            <span className="text-red-500 text-sm">
                                Deadline is required
                            </span>
                        )}
                    </div>

                    <button className="btn btn-primary w-full mt-4">
                        Create Contest
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateContest;
