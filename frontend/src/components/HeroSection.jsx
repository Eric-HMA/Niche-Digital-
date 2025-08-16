import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { companyInfo } from '../data/mock';

const HeroSection = () => {
  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-spacing bg-gradient-to-br from-[#ECEC75] to-[#e6e67c] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="serif-heading text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Grow Your Business with 
                <span className="block text-[#0f172a]">Digital Marketing</span>
              </h1>
              <p className="sans-body text-lg sm:text-xl leading-relaxed max-w-2xl">
                {companyInfo.tagline}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8">
              <div className="text-center">
                <div className="serif-heading text-2xl sm:text-3xl font-bold text-[#0f172a]">100+</div>
                <div className="sans-body text-sm text-gray-600 mt-1">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="serif-heading text-2xl sm:text-3xl font-bold text-[#0f172a]">4+</div>
                <div className="sans-body text-sm text-gray-600 mt-1">Platforms</div>
              </div>
              <div className="text-center">
                <div className="serif-heading text-2xl sm:text-3xl font-bold text-[#0f172a]">95%</div>
                <div className="sans-body text-sm text-gray-600 mt-1">Success Rate</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToServices}
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <span>Explore Services</span>
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={scrollToContact}
                className="btn-secondary inline-flex items-center justify-center space-x-2"
              >
                <Play size={18} />
                <span>Free Consultation</span>
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="card-lime bg-white/60 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <img 
                  src={companyInfo.logo} 
                  alt={companyInfo.logoAlt}
                  className="h-24 w-auto mx-auto"
                />
                <div className="space-y-3">
                  <h3 className="serif-heading text-xl font-semibold">Our Objective</h3>
                  <p className="sans-body text-sm leading-relaxed">
                    {companyInfo.objective}
                  </p>
                </div>
                
                {/* Service Icons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-white/80 rounded-lg">
                    <div className="serif-heading text-sm font-medium">Social Media</div>
                    <div className="sans-body text-xs text-gray-600">FB • IG • TikTok</div>
                  </div>
                  <div className="text-center p-3 bg-white/80 rounded-lg">
                    <div className="serif-heading text-sm font-medium">Google Ads</div>
                    <div className="sans-body text-xs text-gray-600">Search • Maps</div>
                  </div>
                  <div className="text-center p-3 bg-white/80 rounded-lg">
                    <div className="serif-heading text-sm font-medium">Websites</div>
                    <div className="sans-body text-xs text-gray-600">Design • SEO</div>
                  </div>
                  <div className="text-center p-3 bg-white/80 rounded-lg">
                    <div className="serif-heading text-sm font-medium">Analytics</div>
                    <div className="sans-body text-xs text-gray-600">Reports • ROI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
    </section>
  );
};

export default HeroSection;