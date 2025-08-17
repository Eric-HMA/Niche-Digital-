import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { companyInfo } from '../data/mock'; // keep your logo/name from mock

const CONTACT = {
  email: 'nichedigital.marketing9.0@gmail.com',
  phone: '+66955050811',
  location: 'Thailand, Myanmar',
  facebook: 'https://www.facebook.com/profile.php?id=61577090491731',
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Why Choose Us', href: '#why-choose-us' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Facebook & Instagram Marketing',
    'TikTok Marketing',
    'Google & Maps Marketing',
    'Website Creation'
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={companyInfo.logo} 
                    alt={companyInfo.logoAlt}
                    className="h-10 w-auto"
                  />
                  <span className="serif-heading text-xl font-bold">
                    {companyInfo.name}
                  </span>
                </div>
                <p className="sans-body text-sm text-white leading-relaxed">
                  Tailored digital marketing solutions that help businesses stand out, 
                  attract their ideal customers, and scale online.
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h4 className="serif-heading text-sm font-semibold text-[#ECEC75]">Follow Us</h4>
                <div className="flex space-x-4">
                  <a 
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 bg-[#1e293b] text-white rounded-full flex items-center justify-center hover:bg-[#ECEC75] hover:text-[#0f172a] transition-colors duration-200"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="#"
                    aria-label="Instagram"
                    className="w-10 h-10 bg-[#1e293b] text-white rounded-full flex items-center justify-center hover:bg-[#ECEC75] hover:text-[#0f172a] transition-colors duration-200"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="#"
                    aria-label="LinkedIn"
                    className="w-10 h-10 bg-[#1e293b] text-white rounded-full flex items-center justify-center hover:bg-[#ECEC75] hover:text-[#0f172a] transition-colors duration-200"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="serif-heading text-lg font-semibold text-[#ECEC75]">Quick Links</h4>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="block sans-body text-sm text-white hover:text-[#ECEC75] transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="serif-heading text-lg font-semibold text-[#ECEC75]">Our Services</h4>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="sans-body text-sm text-white">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="serif-heading text-lg font-semibold text-[#ECEC75]">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail size={16} className="text-[#ECEC75] mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="sans-body text-sm font-medium text-white">Email</div>
                    <a href={`mailto:${CONTACT.email}`} className="sans-body text-sm text-white hover:text-[#ECEC75]">
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone size={16} className="text-[#ECEC75] mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="sans-body text-sm font-medium text-white">Phone</div>
                    <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} className="sans-body text-sm text-white hover:text-[#ECEC75]">
                      {CONTACT.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-[#ECEC75] mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="sans-body text-sm font-medium text-white">Location</div>
                    <div className="sans-body text-sm text-white">
                      {CONTACT.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
  <button 
    onClick={() => scrollToSection('#contact')}
    className="bg-[#0d3b66] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#145388] transition-colors duration-200"
  >
    Get Free Consultation
  </button>
</div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="sans-body text-sm text-white">
              © {currentYear} {companyInfo.name}. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="sans-body text-sm text-white hover:text-[#ECEC75] transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="sans-body text-sm text-white hover:text-[#ECEC75] transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
