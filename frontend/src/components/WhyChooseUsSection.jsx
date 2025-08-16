import React from 'react';
import * as Icons from 'lucide-react';
import { whyChooseUs } from '../data/mock';

const WhyChooseUsSection = () => {
  return (
    <section id="why-choose-us" className="section-spacing bg-[#ECEC75]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a]">
              Why Choose NICHE Digital Marketing?
            </h2>
            <p className="sans-body text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We combine expertise, innovation, and dedication to deliver digital marketing solutions 
              that drive real business growth and measurable results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {whyChooseUs.map((feature, index) => {
              const IconComponent = Icons[feature.icon] || Icons.Target;
              return (
                <div 
                  key={index} 
                  className="card-lime bg-white hover:bg-white/95 transition-all duration-300 group"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[#ECEC75] rounded-full flex items-center justify-center group-hover:bg-[#e6e67c] transition-colors duration-200">
                      <IconComponent size={28} className="text-[#0f172a]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="serif-heading text-xl font-semibold text-[#0f172a]">
                        {feature.title}
                      </h3>
                      <p className="sans-body text-sm text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center space-y-8">
              <h3 className="serif-heading text-2xl lg:text-3xl font-bold text-[#0f172a]">
                Our Track Record Speaks for Itself
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center space-y-2">
                  <div className="serif-heading text-3xl lg:text-4xl font-bold text-[#0f172a]">
                    100+
                  </div>
                  <div className="sans-body text-sm text-gray-600">
                    Satisfied Clients
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="serif-heading text-3xl lg:text-4xl font-bold text-[#0f172a]">
                    500+
                  </div>
                  <div className="sans-body text-sm text-gray-600">
                    Campaigns Launched
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="serif-heading text-3xl lg:text-4xl font-bold text-[#0f172a]">
                    95%
                  </div>
                  <div className="sans-body text-sm text-gray-600">
                    Client Retention Rate
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="serif-heading text-3xl lg:text-4xl font-bold text-[#0f172a]">
                    4.9★
                  </div>
                  <div className="sans-body text-sm text-gray-600">
                    Average Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center sm:text-left">
                <h4 className="serif-heading text-xl font-semibold text-[#0f172a] mb-2">
                  Ready to Get Started?
                </h4>
                <p className="sans-body text-sm text-gray-600">
                  Join our growing family of successful businesses
                </p>
              </div>
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-primary whitespace-nowrap"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;