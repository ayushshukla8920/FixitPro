import React from 'react';
const Footer = () => {
  return (
    <div className='bg-[#1F2937] text-white py-10 mt-4'>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ApplianceRepair</h3>
            <p>Your trusted partner for all appliance repair needs. Fast, reliable, and professional service.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/index.php" className="hover:text-blue-300">Home</a></li>
              <li><a href="/about.php" className="hover:text-blue-300">About Us</a></li>
              <li><a href="/contact.php" className="hover:text-blue-300">Contact</a></li>
              <li><a href="/privacy.php" className="hover:text-blue-300">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>Email: info@appliancerepair.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Repair St, Service City</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} ApplianceRepair. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
