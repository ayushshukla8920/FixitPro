import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import server from '../../config';
import { useAuth } from '../../context/Usercontext';

const AdminRequests = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [assignModal, setAssignModal] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.post(`${server}/api/admin/allrequests`, { token });
      if (res.data.status === 'success') {
        setRequests(res.data.requests);
        setFiltered(res.data.requests);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await axios.post(`${server}/api/admin/technicianlist`, { token });
      if (res.data.status === 'success') {
        setTechnicians(res.data.technicians);
      }
    } catch (err) {
      console.error('Error loading technicians:', err);
    }
  };

  const handleAssignClick = (reqId) => {
    setCurrentRequest(reqId);
    setAssignModal(true);
    fetchTechnicians();
  };

  const handleAssignSubmit = async () => {
    try {
      const res = await axios.post(`${server}/api/admin/assigntechnician`, {
        token,
        request_id: currentRequest,
        technician_id: selectedTech,
      });
      console.log(res.data)
      if (res.data.status === 'success') {
        alert('Technician assigned successfully');
        setAssignModal(false);
        setSelectedTech('');
        fetchRequests();
      }
    } catch (err) {
      alert('Failed to assign technician');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  useEffect(() => {
    if (search === '') {
      setFiltered(requests);
    } else {
      setFiltered(
        requests.filter(r =>
          r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
          r.status.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, requests]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 mb-10">
        <h1 className="text-3xl font-bold mb-6">All Service Requests</h1>

        <input
          type="text"
          placeholder="Search by customer or status..."
          className="w-full max-w-md px-4 py-2 border rounded-md mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader text="Customer" />
                <TableHeader text="Appliance" />
                <TableHeader text="Status" />
                <TableHeader text="Date" />
                <TableHeader text="Actions" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">No requests found.</td></tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.request_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{req.customer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.appliance_type} ({req.brand})</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/job-details/${req.request_id}`}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        View
                      </a>

                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleAssignClick(req.request_id)}
                          className="text-green-600 hover:underline"
                        >
                          Assign
                        </button>
                      )}

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Technician</h2>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
            >
              <option value="">Select Technician</option>
              {technicians.map((tech) => (
                <option key={tech.user_id} value={tech.user_id}>
                  {tech.full_name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setAssignModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button
                onClick={handleAssignSubmit}
                disabled={!selectedTech}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

const TableHeader = ({ text }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text}</th>
);

export default AdminRequests;
