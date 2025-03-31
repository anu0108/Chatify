import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import banner from "../assets/banner.png"
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${backendUrl}/auth/register`, {
        name,
        email,
        password,
        mobile,
      }, {
        headers: {
          "x-vercel-protection-bypass": import.meta.env.VITE_VERCEL_AUTOMATION_BYPASS_SECRET,
          "Content-Type": "application/json",
      },
        withCredentials: true
      });

      if(res.data.success){
        toast.success(res.data.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>; // Type cast error as AxiosError

      if (error.response) {
        toast.error(error.response.data.message || "An error occurred!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="flex w-full h-screen">
      <div className="bg-gray-100 h-screen flex items-center justify-center">
        <img src={banner} alt="" className="h-full w-[450px] rounded"></img>
      </div>
      <div className="px-40 pt-24 w-7/12 mx-auto">

        <h1 className="text-blue-500 text-6xl mx-auto w-md mb-10 h-24">
          <Typewriter
            options={{
              strings: ["Connecting with your Loved Ones"],
              autoStart: true,
              loop: true,
              delay: 70,
              deleteSpeed: 18,
            }}
          />
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
          <div className="my-4 pt-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="my-4 ">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div className="my-4">
            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-white font-semibold py-2 rounded-lg cursor-pointer hover:bg-amber-500 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-4 w-md mx-auto">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="mx-auto border px-4 py-2 text-lg text-gray-700 font-bold rounded-lg flex items-center gap-4 w-md justify-center cursor-pointer hover:bg-gray-100"><FcGoogle className="text-3xl" />Sign Up with Google</button>
        <button className="mx-auto border px-4 py-2 mt-4 text-lg text-gray-700 font-bold rounded-lg flex items-center gap-4 w-md justify-center cursor-pointer hover:bg-gray-100 "><FaXTwitter className="text-3xl" />Sign Up with Twitter</button>

        <h1 className="text-center w-md mt-4 mx-auto">Already have an account? <Link className="text-blue-500 font-semibold" to="/login">Login</Link></h1>
      </div>
    </div>
  )
}

export default Register