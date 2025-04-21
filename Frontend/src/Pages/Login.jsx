import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import server from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // loader state
  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
  
    if (cookies.token) {
      window.location.href = '/';
    }
  }, []);  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader
    try {
      const response = await axios.post(`${server}/api/login`, {
        email,
        password,
      });
      const data = response.data;
      if (data.token) {
        document.cookie = `token=${data.token};path=/`;
        window.location.href = '/';
      } else {
        alert('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/clouds-bg.png')] bg-cover opacity-10 z-0" />
      <div className="backdrop-blur-md bg-white/30 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-md w-full z-10">
        <div className="flex justify-center mb-6">
          <div className="">
            <img src="/icon.png" className='w-25 h-25' alt="" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">Sign in with email</h2>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Make a new doc to bring your words, data, and teams together. For free
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 mt-12">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`hover:cursor-pointer transition-all w-full py-2 rounded-xl text-white font-semibold ${
              loading ? 'bg-sky-300 cursor-not-allowed' : 'bg-[#2463EB] hover:bg-[#1E52C3]'
            } flex justify-center items-center gap-2 mt-10 mb-5`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <h1 className='w-full text-center'>Don't have an Account ? <a className='hover:underline text-blue-500' href="/register">Register</a></h1>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
