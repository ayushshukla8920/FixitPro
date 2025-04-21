import React from 'react';
import { useAuth } from '../context/Usercontext';
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "../components/ui/hero-highlight";

const HomePage = () => {
  const { token } = useAuth();
  const isLoggedIn = !!token;
  return (
    <div className="background-color: rgb(226,23,4,248)">
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          What's better than..<br />{" "}
          <Highlight className="text-black dark:text-white">
            Professional Appliance Repairs.
          </Highlight>
        </motion.h1>
      </HeroHighlight>
      {/* Services Section */}
      <section className="bg-blue-100 mb-5 py-12 px-4 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {[
            {
              title: "Refrigerator Repair",
              desc: "Diagnosis and repair of cooling issues, leaks, and other refrigerator problems."
            },
            {
              title: "Washing Machine Repair",
              desc: "Fixing spin cycle issues, leaks, drainage problems, and more."
            },
            {
              title: "Oven & Stove Repair",
              desc: "Repairing heating elements, igniters, temperature controls, and other issues."
            },
            {
              title: "Dishwasher Repair",
              desc: "Fixing drainage problems, leaks, and cleaning performance issues."
            }
          ].map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-cyan-300 hover:shadow-xl hover:scale-[1.03] transition-all"
            >
              <h3 className="text-xl font-bold mb-2 text-blue-600">{service.title}</h3>
              <p className="text-gray-700">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-20 bg-blue-100">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Easy Booking",
              desc: "Schedule your appliance repair service in just a few clicks. Our system makes it simple and convenient.",
              iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            },
            {
              title: "Fast Response",
              desc: "Our technicians respond quickly to service requests, minimizing your appliance downtime.",
              iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            {
              title: "Quality Service",
              desc: "Certified technicians with years of experience ensure your appliances are repaired to the highest standard.",
              iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-cyan-300 hover:shadow-xl hover:scale-[1.03] transition-all"
            >
              <div className="text-blue-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.iconPath}></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
