import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const faqs = [
    {
      step: "Step 1",
      question: "How do I book a repair service?",
      answer: "Log in and use the 'Book Service' button to submit a request.",
      img: "/image.png", // fix: remove /public, just use /images if stored in public folder
    },
    {
      step: "Step 2",
      question: "Can I track my service status?",
      answer: "Yes! Go to your dashboard and check the 'My Services' section.",
      img: "/img2.png",
    },
    {
      step: "Step 3",
      question: "What if I want to cancel a job?",
      answer: "You can cancel your request before it's accepted by a technician.",
      img: "/img2.jpeg",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="bg-blue-100 py-12 px-4 md:px-20 mt-5 relative">
      <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-cyan-300 hover:shadow-xl hover:scale-[1.03] transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-600">
                {faq.step}: {faq.question}
              </h3>
              <button
                onClick={() => toggleAnswer(idx)}
                className="text-xl font-bold bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
              >
                {activeIndex === idx ? "−" : ">"}
              </button>
            </div>

            {activeIndex === idx && (
              <div className="mt-4 transition-all duration-300 ease-in-out">
                <img
                  src={faq.img}
                  alt={faq.step}
                  className="w-full h-40 object-contain mb-4 cursor-pointer"
                  onClick={() => setPreviewImage(faq.img)}
                />
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              className="relative bg-white rounded-xl shadow-lg overflow-hidden w-11/12 md:w-1/2 p-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-500"
              >
                ×
              </button>
              <img src={previewImage} alt="Preview" className="w-full h-auto rounded-md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FAQ;
