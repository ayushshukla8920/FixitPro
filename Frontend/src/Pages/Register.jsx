import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import server from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfpassword, setcnfPassword] = useState('');
  const [username, setusername] = useState('');
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [address, setaddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password!=cnfpassword){
      console.error("Passowords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${server}/api/register`, {
        username,
        name,
        email,
        password,
        phone,
        address,
        role: "customer"
      });
      const data = response.data;
      console.log(data);
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
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="h-screen w-screen overflow-y-auto bg-gradient-to-b from-sky-100 to-white relative">
      <div className="min-h-full flex items-center justify-center py-10 px-4">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/clouds-bg.png')] bg-cover opacity-10 z-0" />
        <div className="backdrop-blur-md bg-white/30 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-md w-full z-10">
          <div className="flex justify-center mb-6">
            <img src="/icon.png" className="w-20 h-20" alt="App Icon" />
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-800">Create Account</h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">
            Make a new doc to bring your words, data, and teams together. For free
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-10">
            <input
              type="text"
              placeholder="Enter Your Username"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Your Full Name"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={cnfpassword}
              onChange={(e) => setcnfPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Your Address"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Enter Your Phone Number"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`hover:cursor-pointer transition-all w-full py-2 rounded-xl text-white font-semibold ${
                loading ? 'bg-sky-300 cursor-not-allowed' : 'bg-[#2463EB] hover:bg-[#1E52C3]'
              } flex justify-center items-center gap-2 mt-6 mb-4`}
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
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>
          <p className="text-center">
            Already have an Account?{' '}
            <a className="hover:underline text-blue-500" href="/login">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Register;
