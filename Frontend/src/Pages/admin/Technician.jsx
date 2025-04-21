import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useAuth } from '../../context/Usercontext';
import server from '../../config';

const ManageTechnicians = () => {
  const { token,user } = useAuth();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTechnicians = async () => {
    try {
      const res = await axios.post(`${server}/api/admin/technicianlist`, { token });
      if (res.data.status === 'success') {
        setTechnicians(res.data.technicians);
      }
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [user]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 mb-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Technicians</h1>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">View and manage registered technicians.</p>
          <a href="/admin/add-technician" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Technician</a>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b">Technician Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
              ) : technicians.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4">No technicians found</td></tr>
              ) : (
                technicians.map((tech) => (
                  <tr key={tech.user_id}>
                    <td className="py-3 px-25 border-b">{tech.full_name}</td>
                    <td className="py-3 px-25 border-b">{tech.email}</td>
                    <td className="py-3 px-25 border-b">{tech.phone}</td>
                    <td className="py-3 px-25 border-b">
                      <button className="bg-red-500 hover:cursor-pointer hover:bg-red-700 transition-all w-20 h-7 rounded-md text-white font-semibold">Block</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageTechnicians;
