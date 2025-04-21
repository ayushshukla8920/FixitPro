import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah K.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Fast and professional service. My refrigerator was fixed the same day!",
  },
  {
    name: "Mark D.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Affordable pricing and friendly technicians. Highly recommended!",
  },
  {
    name: "Priya S.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "Excellent customer support. Resolved my washing machine issue quickly.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-blue-100 mt-5 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
      <div className="grid md:grid-cols-3 gap-6 px-4 md:px-20">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gray-100 p-6 rounded-2xl shadow-cyan-300 hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
              />
              <h4 className="text-lg font-semibold">{t.name}</h4>
            </div>
            <p className="italic text-gray-700">"{t.quote}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
