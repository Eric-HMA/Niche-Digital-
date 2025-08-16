import React, { useState } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { services } from '../data/mock';

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(services[0]);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="section-spacing bg-[#ECEC75]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a]">
              Our Digital Marketing Services
            </h2>
            <p className="sans-body text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Comprehensive solutions designed to grow your business online. Each service combines 
              education and execution to deliver measurable results.
            </p>
          </div>

          {/* Service Navigation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {services.map((service) => {
              const IconComponent = Icons[service.icon] || Icons.Target;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-lg text-center transition-all duration-200 ${
                    selectedService.id === service.id
                      ? 'bg-white shadow-lg transform scale-105'
                      : 'bg-white/60 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  <IconComponent 
                    size={32} 
                    className={`mx-auto mb-2 ${
                      selectedService.id === service.id ? 'text-[#0f172a]' : 'text-gray-600'
                    }`} 
                  />
                  <h3 className={`serif-heading text-sm font-semibold ${
                    selectedService.id === service.id ? 'text-[#0f172a]' : 'text-gray-700'
                  }`}>
                    {service.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Selected Service Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Service Overview */}
            <div className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="serif-heading text-2xl lg:text-3xl font-bold text-[#0f172a]">
                      {selectedService.title}
                    </h3>
                    <p className="sans-body text-base text-gray-700 leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="serif-heading text-lg font-semibold text-[#0f172a]">
                      Key Benefits:
                    </h4>
                    <div className="grid gap-2">
                      {selectedService.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span className="sans-body text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={scrollToContact}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Features */}
                <div className="card-lime bg-[#e6e67c]">
                  <h4 className="serif-heading text-lg font-semibold text-[#0f172a] mb-4">
                    What's Included:
                  </h4>
                  <div className="space-y-3">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-[#0f172a] rounded-full flex items-center justify-center mt-0.5">
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="sans-body text-sm text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-8 lg:p-12">
              <div className="mb-8">
                <h4 className="serif-heading text-xl lg:text-2xl font-bold text-[#0f172a] text-center">
                  Pricing Plans for {selectedService.title}
                </h4>
                <p className="sans-body text-center text-gray-600 mt-2">
                  Choose the plan that fits your business needs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {selectedService.pricing.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`relative bg-white rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:transform hover:scale-105 ${
                      plan.popular ? 'ring-2 ring-[#ECEC75] ring-opacity-50' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#ECEC75] text-[#0f172a] px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star size={12} />
                          <span>POPULAR</span>
                        </div>
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <h5 className="serif-heading text-lg font-bold text-[#0f172a]">
                        {plan.name}
                      </h5>
                      <div className="space-y-1">
                        <div className="serif-heading text-3xl font-bold text-[#0f172a]">
                          {plan.price}
                        </div>
                        <div className="sans-body text-sm text-gray-600">
                          {plan.currency}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="sans-body text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={scrollToContact}
                      className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        plan.popular 
                          ? 'btn-primary' 
                          : 'btn-secondary'
                      }`}
                    >
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>

              {/* Add-ons for Website Service */}
              {selectedService.addOns && (
                <div className="mt-12 p-6 bg-white rounded-xl shadow-md">
                  <h5 className="serif-heading text-lg font-semibold text-[#0f172a] mb-4 text-center">
                    Available Add-Ons
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedService.addOns.map((addon, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="sans-body text-sm font-medium text-gray-800">
                          {addon.name}
                        </span>
                        <span className="sans-body text-sm font-semibold text-[#0f172a]">
                          {addon.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;