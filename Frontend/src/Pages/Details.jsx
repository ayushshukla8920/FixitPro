import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import server from '../config';
import { useAuth } from '../context/Usercontext';
import { FaUser, FaTools, FaInfoCircle, FaCalendarCheck } from 'react-icons/fa';

const TechnicianJobDetails = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.post(`${server}/api/getdetails`, {
                    token,
                    request_id: id
                });

                if (res.data.status === 'success') {
                    setDetails(res.data.data);
                } else {
                    alert(res.data.message || "Unable to fetch details");
                }
            } catch (err) {
                console.error("Failed to load job details:", err);
                alert("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, token]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not Available';
        const isoStr = dateStr.replace(' ', 'T');
        const date = new Date(isoStr);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    if (loading) {
        return <div className="text-center p-6 text-lg font-medium text-gray-700">Loading...</div>;
    }

    if (!details) {
        return <div className="text-center p-6 text-red-600 text-lg">No details found.</div>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">🛠️ Service Request Details</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="bg-white border-l-4 border-blue-400 rounded-lg shadow-md p-6 hover:shadow-lg transition">
                        <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                            <FaUser /> Customer Info
                        </h2>
                        <p className="mb-2"><strong>Name:</strong> {details.customer_name}</p>
                        <p className="mb-2"><strong>Phone:</strong> {details.customer_phone}</p>
                        <p className="mb-2"><strong>Address:</strong> {details.customer_address}</p>
                    </div>

                    {/* Appliance Info */}
                    <div className="bg-white border-l-4 border-purple-400 rounded-lg shadow-md p-6 hover:shadow-lg transition">
                        <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
                            <FaTools /> Appliance Info
                        </h2>
                        <p className="mb-2"><strong>Appliance:</strong> {details.appliance_name || 'N/A'}</p>
                        <p className="mb-2"><strong>Type:</strong> {details.appliance_type}</p>
                        <p className="mb-2"><strong>Brand & Model:</strong> {details.brand} {details.model}</p>
                        <p className="mb-2"><strong>Issue:</strong> {details.issue_description}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="bg-white border-l-4 border-green-400 rounded-lg shadow-md p-6 hover:shadow-lg transition col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                            <FaInfoCircle /> Request Status & Timeline
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Status:</strong> <span className="capitalize text-gray-700">{details.status}</span></p>
                            <p><strong>Priority:</strong> <span className="capitalize">{details.priority}</span></p>
                            <p><strong>Created On:</strong> {formatDate(details.created_at)}</p>
                            <p><strong>Scheduled For:</strong> {formatDate(details.scheduled_date)}</p>
                            <p><strong>Completed On:</strong> {details.completed_date ? formatDate(details.completed_date) : 'Not Completed'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TechnicianJobDetails;
