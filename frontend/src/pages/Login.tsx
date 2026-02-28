import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { MessageCircle, Mail, Lock } from "lucide-react";
import Typewriter from "typewriter-effect";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setAuthUser } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Login successful!");
        setAuthUser(res.data.user);
        navigate("/");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (error.response) {
        toast.error(error.response.data.message || "An error occurred!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Left side - Illustration */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 h-screen flex items-center justify-center relative overflow-hidden w-1/2">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white px-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <MessageCircle size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Chatify</h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Connecting with your Loved Ones
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-xs mx-auto">
            <div className="space-y-3">
              <div className="bg-white/20 rounded-lg p-2 text-sm">Hey there! 👋</div>
              <div className="bg-blue-500 rounded-lg p-2 text-sm ml-8">Hello! How are you?</div>
              <div className="bg-white/20 rounded-lg p-2 text-sm mr-8">Great! Ready to chat?</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Typewriter heading */}
        <div className="w-full max-w-md mb-6">
          
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h1 className="text-blue-500 text-3xl font-bold h-10">
            <Typewriter
              options={{
                strings: ["Get That Chat Rolling ..."],
                autoStart: true,
                loop: true,
                delay: 70,
                deleteSpeed: 18,
              }}
            />
          </h1>
            </div>

            {/* Form Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?
                <Link to="/register" className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;