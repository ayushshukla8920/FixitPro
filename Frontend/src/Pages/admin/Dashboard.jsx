import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import server from '../../config';
import { useAuth } from '../../context/Usercontext';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null); // ✅ canvas reference
  const chartInstanceRef = useRef(null); // ✅ chart instance reference (for cleanup)

  const fetchStats = async () => {
    try {
      const res = await axios.post(`${server}/api/admin/getdashboard`, { token });
      if (res.data.status === 'success') {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (stats) drawChart(stats);
    // Clean up chart before drawing new one
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stats]);

  const drawChart = (data) => {
    if (!chartRef.current) return;

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [{
          label: 'Repair Requests',
          data: [data.pending_requests, data.in_progress_requests, data.completed_requests],
          backgroundColor: [
            'rgba(234, 179, 8, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(16, 185, 129, 0.7)'
          ],
          borderColor: [
            'rgba(234, 179, 8, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !stats) return <p className="p-4">Loading...</p>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Requests" count={stats.total_requests} color="text-blue-600" />
          <StatCard title="Pending Requests" count={stats.pending_requests} color="text-yellow-500" />
          <StatCard title="In Progress" count={stats.in_progress_requests} color="text-purple-500" />
          <StatCard title="Completed" count={stats.completed_requests} color="text-green-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader text="Customer" />
                    <TableHeader text="Status" />
                    <TableHeader text="Date" />
                    <TableHeader text="Actions" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recent_requests.map((req) => (
                    <tr key={req.request_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{req.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>
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
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <QuickStat title="Customers" value={stats.total_customers} color="text-blue-600" />
              <QuickStat title="Technicians" value={stats.total_technicians} color="text-green-600" />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <a href="/admin/technicians" className="block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">Manage Technicians</a>
                <a href="/admin/appointments" className="block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">View All Appointments</a>
                <a href="/admin/add-technician" className="block bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded text-blue-800">Add New Technician</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Requests Overview</h2>
          <canvas ref={chartRef} height="100"></canvas>
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

const QuickStat = ({ title, value, color }) => (
  <div>
    <h3 className="text-lg font-medium">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const TableHeader = ({ text }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text}</th>
);

export default AdminDashboard;
