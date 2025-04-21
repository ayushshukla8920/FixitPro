import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import server from '../../config';

const NewRepairRequest = () => {
  const [applianceType, setApplianceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    return token || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applianceType || !brand || !model || !issueDescription) {
      return setMessage({ type: 'error', text: 'Please fill in all required fields' });
    }

    setLoading(true);
    try {
      const res = await axios.post(`${server}/api/user/request`, {
        token: getToken(),
        appliance_type: applianceType,
        brand,
        model,
        issue_description: issueDescription,
        urgency,
      });

      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: res.data.message });
        setApplianceType('');
        setBrand('');
        setModel('');
        setIssueDescription('');
        setUrgency('medium');
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">New Repair Request</h1>
        <p className="text-gray-600 mb-6">Fill out the form below to request appliance repair service</p>

        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
            <label className="block mb-2 text-gray-700 font-medium">Appliance Type*</label>
            <select
              value={applianceType}
              onChange={(e) => setApplianceType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">-- Select Appliance Type --</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Air Conditioner">Air Conditioner</option>
              <option value="Microwave">Microwave</option>
              <option value="Television">Television</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Brand*</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              placeholder="e.g. Samsung"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Model*</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              placeholder="e.g. WA65A4002VS"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Issue Description*</label>
            <textarea
              rows="5"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Urgency*</label>
            <div className="flex gap-4">
              {['low', 'medium', 'high'].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={urgency === level}
                    onChange={() => setUrgency(level)}
                    className="mr-2"
                  />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <a href="/customer/dashboard" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</a>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
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
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default NewRepairRequest;
