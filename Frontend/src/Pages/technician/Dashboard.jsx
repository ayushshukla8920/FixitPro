import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import server from '../../config';
import { useAuth } from '../../context/Usercontext';
import { FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa'; // Add icons

const TechnicianDashboard = () => {
    const { token, user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const stats = {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        accepted: assignments.filter(a => a.status === 'accepted').length,
    };

    const handleStatusUpdate = async (request_id, status) => {
        try {
            const res = await axios.post(`${server}/api/technician/accept`, {
                token,
                request_id,
                status
            });
            if (res.data.status === 'success') {
                fetchAssignments();
            } else {
                alert(res.data.message || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong while updating status.');
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await axios.post(`${server}/api/technician/assignments`, { token });
            if (res.data.status === 'success') {
                setAssignments(res.data.assignments);
            }
        } catch (err) {
            console.error('Error loading technician assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [user]);

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'declined': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-6 mb-10">
                <h1 className="text-3xl font-bold mb-6 text-center animate__animated animate__fadeIn">Technician Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Assignments" count={stats.total} color="text-blue-600" />
                    <StatCard title="Pending Acceptance" count={stats.pending} color="text-yellow-500" />
                    <StatCard title="Active Jobs" count={stats.accepted} color="text-green-500" />
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Your Assignments</h2>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <TableHeader text="Customer" />
                                <TableHeader text="Appliance" />
                                <TableHeader text="Issue" />
                                <TableHeader text="Priority" />
                                <TableHeader text="Status" />
                                <TableHeader text="Assigned" />
                                <TableHeader text="Completed" />
                                <TableHeader text="Actions" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="8" className="p-4 text-center">Loading...</td></tr>
                            ) : assignments.length === 0 ? (
                                <tr><td colSpan="8" className="p-4 text-center">No assignments found.</td></tr>
                            ) : (
                                assignments.map((a) => (
                                    <tr key={a.assignment_id} className="hover:bg-gray-100 transition duration-300 ease-in-out">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{a.customer_name}</div>
                                            <div className="text-sm text-gray-500">{a.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{a.appliance_name}</div>
                                            <div className="text-sm text-gray-500">{a.appliance_type}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-900">
                                            {a.issue_description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getPriorityColorClass(a.priority)}`}>
                                                {a.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusColorClass(a.status)}`}>
                                                {a.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(a.assigned_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : 'Not completed'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {a.status === 'assigned' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(a.request_id, 'accepted')}
                                                        className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200 transition duration-200"
                                                    >
                                                        <FaCheckCircle className="inline mr-1" /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(a.request_id, 'declined')}
                                                        className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200 transition duration-200"
                                                    >
                                                        <FaTimesCircle className="inline mr-1" /> Reject
                                                    </button>
                                                </div>
                                            ) : a.status === 'in_progress' ? (
                                                <div className="flex gap-2">
                                                    <a
                                                        href={`/job-details/${a.assignment_id}`}
                                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                                    >
                                                        <FaEye className="inline mr-1" /> View
                                                    </a>
                                                    <button
                                                        onClick={() => handleStatusUpdate(a.request_id, 'completed')}
                                                        className="px-3 py-1 bg-green-500/60 text-green-600 font-bold text-xs rounded hover:bg-green-600 hover:text-white hover:cursor-pointer transition duration-200"
                                                    >
                                                        Mark Completed
                                                    </button>
                                                </div>
                                            ) : (
                                                <a
                                                    href={`/job-details/${a.assignment_id}`}
                                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                                >
                                                    <FaEye className="inline mr-1" /> View
                                                </a>
                                            )}
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

const StatCard = ({ title, count, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
    </div>
);

const TableHeader = ({ text }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text}</th>
);

export default TechnicianDashboard;
