import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <>
      <Header />
      
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Appliance Repair</h1>
            <p className="text-xl mb-6">Call Us Now: 800.369.3210</p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Left Column - Form */}
              <div className="md:w-1/2 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Expert</h2>
                <h3 className="text-xl font-semibold text-blue-600 mb-6">Appliance Repair Services</h3>
                
                <p className="text-gray-600 mb-6">Fill out the form below to receive a free quote for your service</p>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name:</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address:</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number:</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
              
              {/* Right Column - Image */}
              <div className="md:w-1/2 bg-gray-100 hidden md:block">
                <div className="h-full bg-[url('/appliance-repair-tech.jpg')] bg-cover bg-center"></div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">About</h2>
            <h3 className="text-xl font-semibold text-blue-600 mb-6">Appliance Repair</h3>
            
            <p className="text-gray-600 leading-relaxed">
              There are many variations of professional appliance repair services available, 
              but the majority have suffered from inconsistent quality at some point. 
              We pride ourselves on maintaining the highest standards of service and 
              technical expertise. When you contact us, you can be confident you're 
              getting reliable, same-day service from certified technicians. All of our 
              repair services come with a satisfaction guarantee and competitive pricing.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ContactPage;