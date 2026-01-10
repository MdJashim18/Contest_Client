import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Clock,
  Trophy,
  Users,
  AlertCircle,
  CheckCircle,
  Upload,
  Award,
  FileText,
  DollarSign,
  ArrowLeft
} from "lucide-react";

const Details = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const [isRegistered, setIsRegistered] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [taskName, setTaskName] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const {
    data: contest,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contest-details", id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(`/contest/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!contest || !user) return;

    const participant = contest.participants?.find(
      (p) => p.userEmail === user.email
    );

    if (participant?.taskSubmission) {
      setIsSubmitDisabled(true);
    }

    const registeredData = JSON.parse(
      localStorage.getItem("registeredContest")
    );

    setIsRegistered(
      registeredData &&
        registeredData.contestId.toString() === id &&
        registeredData.userEmail === user.email
    );
  }, [contest, user, id]);

  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(contest.deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Contest Ended");
        clearInterval(interval);

        const registeredData = JSON.parse(
          localStorage.getItem("registeredContest")
        );

        if (
          registeredData?.contestId.toString() === id &&
          registeredData.userEmail === user?.email
        ) {
          localStorage.removeItem("registeredContest");
          setIsRegistered(false);
          setIsSubmitDisabled(false);
        }
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest, id, user]);

  const handleRegister = () => {
    if (!user) {
      Swal.fire("Login Required", "Please login to register", "warning");
      return navigate("/login");
    }
    navigate(`/payment/${id}`);
  };

  const handleSubmitTask = async () => {
    if (!taskName || !taskText) {
      return Swal.fire(
        "Missing Info",
        "Please provide task name and links",
        "warning"
      );
    }

    try {
      const res = await axiosSecure.patch(
        `/contest/submit-task/${id}`,
        {
          taskName,
          userEmail: user.email,
          taskSubmission: taskText,
        }
      );

      if (res.status === 200) {
        Swal.fire("Success", "Task submitted successfully!", "success");

        setTaskText("");
        setTaskName("");
        setIsSubmitDisabled(true);
        document.getElementById("submit_task_modal").close();

        refetch();
      }
    } catch {
      Swal.fire("Error", "Failed to submit task. Try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Contest</h3>
          <p className="text-red-600">{error.message}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center justify-center gap-2 mx-auto text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!contest) return null;

  const isContestEnded = timeLeft === "Contest Ended";
  const deadlineDate = new Date(contest.deadline).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
       
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Contests</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
           
            <div className="lg:w-2/3">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="text-yellow-400" size={24} />
                    <span className="font-semibold">Prize: ${contest.prizeMoney}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{contest.name}</h1>
                </div>
              </div>
            </div>

          
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="space-y-4">
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time Remaining</p>
                      <p className={`text-lg font-bold ${isContestEnded ? 'text-red-600' : 'text-gray-900'}`}>
                        {isContestEnded ? 'Contest Ended' : timeLeft}
                      </p>
                      <p className="text-sm text-gray-500">Deadline: {deadlineDate}</p>
                    </div>
                  </div>

                
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Participants</p>
                      <p className="text-lg font-bold text-gray-900">{contest.participantsCount || 0}</p>
                    </div>
                  </div>

                
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <DollarSign className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prize Pool</p>
                      <p className="text-lg font-bold text-gray-900">${contest.prizeMoney}</p>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-xl ${isContestEnded ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-center gap-2">
                      {isContestEnded ? (
                        <>
                          <AlertCircle className="text-red-500" size={20} />
                          <span className="font-semibold text-red-700">Contest Ended</span>
                        </>
                      ) : (
                        <>
                          <Clock className="text-blue-500" size={20} />
                          <span className="font-semibold text-blue-700">Contest Active</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm mt-1 text-gray-600">
                      {isContestEnded 
                        ? 'This contest is no longer accepting submissions.' 
                        : 'Submit your entry before the deadline.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
          <div className="lg:col-span-2 space-y-8">
           
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Contest Description</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{contest.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Task Instructions</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{contest.taskInstruction}</p>
              </div>
            </div>
          </div>

         
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contest Registration</h3>
              
              {!isRegistered && !isContestEnded && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span className="font-medium">Available for registration</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Secure your spot in this contest by completing the registration process.
                  </p>
                  <button
                    onClick={handleRegister}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Register Now
                  </button>
                </div>
              )}

              {isRegistered && !isContestEnded && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle size={20} />
                    <span className="font-medium">You are registered!</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You can now submit your task for this contest. Make sure to follow all instructions carefully.
                  </p>
                  <button
                    onClick={() => document.getElementById("submit_task_modal").showModal()}
                    className={`w-full font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                      isSubmitDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
                    }`}
                    disabled={isSubmitDisabled}
                  >
                    <Upload size={20} />
                    {isSubmitDisabled ? 'Task Submitted' : 'Submit Task'}
                  </button>
                </div>
              )}

              {isContestEnded && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={20} />
                    <span className="font-medium">Contest has ended</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This contest is no longer accepting registrations or submissions.
                  </p>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      Check back for upcoming contests!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Submission Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Ensure your submission follows all contest rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Provide clear and accessible links to your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Submit before the deadline for eligibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Only one submission per participant is allowed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <dialog id="submit_task_modal" className="modal">
        <div className="modal-box max-w-2xl p-0 overflow-hidden bg-white rounded-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload size={24} />
              Submit Your Task
            </h3>
            <p className="text-blue-100 mt-1">Complete the form below to submit your entry</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive name for your task"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Details
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                placeholder="Provide all relevant links, descriptions, and any additional information about your submission..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">
                Include GitHub links, live demos, documentation, or any other relevant resources.
              </p>
            </div>

            <div className="modal-action flex gap-3 pt-4 border-t border-gray-200">
              <button
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => document.getElementById("submit_task_modal").close()}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                onClick={handleSubmitTask}
              >
                Submit Entry
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Details;