import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/Usercontext';
import server from '../../config';

const CustomerDashboard = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRequests = async () => {
    try {
      const res = await axios.post(`${server}/api/user/getrequests`, {
        token,
      });
      setRequests(res.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const countByStatus = (status) =>
    requests.filter((r) => r.status === status).length;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <a href="/customer/request" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">New Repair Request</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Requests" count={requests.length} color="text-blue-600" />
          <StatCard title="Pending Requests" count={countByStatus('pending')} color="text-yellow-500" />
          <StatCard title="Completed Requests" count={countByStatus('completed')} color="text-green-500" />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Repair Requests</h2>
          </div>
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader text="Appliance Type" />
                    <TableHeader text="Brand & Model" />
                    <TableHeader text="Status" />
                    <TableHeader text="Date" />
                    <TableHeader text="Actions" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((req) => (
                    <tr key={req.request_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{req.appliance_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{req.brand} {req.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`/job-details/${req.request_id}`} className="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{count}</p>
  </div>
);

const TableHeader = ({ text }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text}</th>
);

export default CustomerDashboard;
