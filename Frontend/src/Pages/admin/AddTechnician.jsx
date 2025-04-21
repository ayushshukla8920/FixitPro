import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/Usercontext';
import axios from 'axios';
import server from '../../config';

const AddTechnician = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post(`${server}/api/admin/addtechnician`, {
        token,
        ...form,
      });
      console.log(res.data);
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: res.data.message });
        setForm({ first_name: '', last_name: '', email: '', phone: '', password: '' });
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Technician</h1>

        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="First Name" className="border px-3 py-2 rounded-md" />
            <input name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Last Name" className="border px-3 py-2 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="border px-3 py-2 rounded-md" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="border px-3 py-2 rounded-md" />
          </div>

          <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" className="w-full border px-3 py-2 rounded-md" />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Adding...' : 'Add Technician'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddTechnician;
