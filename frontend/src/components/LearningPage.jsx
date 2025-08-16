import React from 'react';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import Header from './Header';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import WorkflowSection from './WorkflowSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

const LearningPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WorkflowSection />
        <WhyChooseUsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LearningPage;