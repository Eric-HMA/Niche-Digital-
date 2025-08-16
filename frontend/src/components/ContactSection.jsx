import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { contactInfo } from '../data/mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && formData.phone.length > 0) {
      const phoneClean = formData.phone.replace(/\D/g, '');
      if (phoneClean.length < 8 || phoneClean.length > 15) {
        errors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (formData.message && formData.message.length > 2000) {
      errors.message = 'Message is too long (max 2000 characters)';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API}/contact`, {
        name: formData.name.trim(),
        business_name: formData.business_name.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        service: formData.service || undefined,
        message: formData.message.trim() || undefined
      });
      
      if (response.data.success) {
        setIsSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            business_name: '',
            email: '',
            phone: '',
            service: '',
            message: ''
          });
        }, 5000);
      } else {
        setError(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Please check your information and try again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to send your message. Please try again or contact us directly.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    'Facebook & Instagram Marketing',
    'TikTok Marketing',
    'Google & Google Maps Marketing',
    'Website Creation',
    'Full Package (All Services)',
    'Consultation Only',
    'Other'
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="section-spacing bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card-lime bg-[#ECEC75] max-w-md mx-auto">
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="serif-heading text-2xl font-bold text-[#0f172a]">
                    Thank You!
                  </h3>
                  <p className="sans-body text-sm text-gray-700">
                    We've received your message and will get back to you within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-spacing bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a]">
              {contactInfo.title}
            </h2>
            <p className="sans-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {contactInfo.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="serif-heading text-2xl font-semibold text-[#0f172a]">
                  Get Your Free Consultation
                </h3>
                <p className="sans-body text-gray-600">
                  Fill out the form below and we'll schedule a consultation to discuss your digital marketing needs.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent transition-all duration-200"
                      placeholder="+66 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-medium text-gray-700">
                      Service Interest
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="sans-body text-sm font-medium text-gray-700">
                    Tell us about your project
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ECEC75] focus:border-transparent transition-all duration-200 resize-vertical"
                    placeholder="Describe your business, goals, and what you're looking to achieve with digital marketing..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto inline-flex items-center justify-center space-x-2"
                >
                  <Send size={18} />
                  <span>Send Message</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="card-lime bg-[#e6e67c]">
                <div className="space-y-6">
                  <h4 className="serif-heading text-xl font-semibold text-[#0f172a]">
                    Get in Touch
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail size={18} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="serif-heading text-sm font-semibold text-[#0f172a]">
                          Email Us
                        </div>
                        <div className="sans-body text-sm text-gray-700">
                          {contactInfo.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone size={18} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="serif-heading text-sm font-semibold text-[#0f172a]">
                          Call Us
                        </div>
                        <div className="sans-body text-sm text-gray-700">
                          {contactInfo.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="serif-heading text-sm font-semibold text-[#0f172a]">
                          Location
                        </div>
                        <div className="sans-body text-sm text-gray-700">
                          Thailand
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white border-2 border-[#ECEC75] rounded-xl p-6">
                <h4 className="serif-heading text-lg font-semibold text-[#0f172a] mb-4">
                  What Happens Next?
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ECEC75] rounded-full flex items-center justify-center mt-0.5">
                      <span className="serif-heading text-xs font-bold text-[#0f172a]">1</span>
                    </div>
                    <div className="space-y-1">
                      <div className="serif-heading text-sm font-semibold text-[#0f172a]">
                        Quick Response
                      </div>
                      <div className="sans-body text-xs text-gray-600">
                        We'll respond within 24 hours to schedule your consultation
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ECEC75] rounded-full flex items-center justify-center mt-0.5">
                      <span className="serif-heading text-xs font-bold text-[#0f172a]">2</span>
                    </div>
                    <div className="space-y-1">
                      <div className="serif-heading text-sm font-semibold text-[#0f172a]">
                        Strategy Discussion
                      </div>
                      <div className="sans-body text-xs text-gray-600">
                        30-minute consultation to understand your needs and goals
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ECEC75] rounded-full flex items-center justify-center mt-0.5">
                      <span className="serif-heading text-xs font-bold text-[#0f172a]">3</span>
                    </div>
                    <div className="space-y-1">
                      <div className="serif-heading text-sm font-semibold text-[#0f172a]">
                        Custom Proposal
                      </div>
                      <div className="sans-body text-xs text-gray-600">
                        Tailored strategy and pricing based on your requirements
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Satisfaction Guarantee */}
              <div className="bg-[#ECEC75] rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-[#0f172a] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h4 className="serif-heading text-lg font-semibold text-[#0f172a] mb-2">
                  100% Satisfaction Guarantee
                </h4>
                <p className="sans-body text-sm text-gray-700">
                  We're confident in our ability to deliver results. If you're not satisfied with our initial strategy, we'll refund your consultation fee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;