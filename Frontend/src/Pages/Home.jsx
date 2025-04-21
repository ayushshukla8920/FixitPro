import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage';
import Testimonials from '../components/ui/Testimonials';
import FAQ from '../components/ui/FAQ';
import { useAuth } from '../context/Usercontext';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  return (
    <div>
      <Header />
      <HomePage />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
