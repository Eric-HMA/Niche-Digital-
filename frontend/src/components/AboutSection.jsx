import React from 'react';
import { Target, Users, TrendingUp, Award } from 'lucide-react';
import { companyInfo } from '../data/mock';

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: 'Strategic Approach',
      description: 'We develop customized strategies tailored to your specific business goals and target audience.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our experienced professionals stay updated with the latest digital marketing trends and best practices.'
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: 'Track record of delivering measurable growth and ROI for businesses across various industries.'
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'Committed to delivering high-quality work with transparent communication and regular reporting.'
    }
  ];

  return (
    <section id="about" className="section-spacing bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a]">
              About NICHE Digital Marketing
            </h2>
            <p className="sans-body text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At Niche Digital Marketing, we specialize in providing tailored digital marketing solutions 
              that help businesses stand out, attract their ideal customers, and scale online.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Description */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="serif-heading text-2xl font-semibold text-[#0f172a]">
                  Your Digital Growth Partner
                </h3>
                <p className="sans-body text-base leading-relaxed text-gray-700">
                  Whether you're looking to build your online presence, drive traffic, or boost conversions, 
                  we've got the tools, experience, and strategy to make it happen.
                </p>
                <p className="sans-body text-base leading-relaxed text-gray-700">
                  Our comprehensive approach combines creative content, strategic planning, and data-driven 
                  insights to deliver results that matter to your business.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#ECEC75] rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-[#0f172a] rounded-full"></div>
                  </div>
                  <span className="sans-body text-sm text-gray-700">
                    Customized strategies for every business size and industry
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#ECEC75] rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-[#0f172a] rounded-full"></div>
                  </div>
                  <span className="sans-body text-sm text-gray-700">
                    Transparent reporting with measurable results
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#ECEC75] rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-[#0f172a] rounded-full"></div>
                  </div>
                  <span className="sans-body text-sm text-gray-700">
                    Expert knowledge across all major digital platforms
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="card-lime bg-gradient-to-br from-[#e6e67c] to-[#ECEC75]">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center">
                    <img 
                      src={companyInfo.logo} 
                      alt={companyInfo.logoAlt}
                      className="h-12 w-auto"
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="serif-heading text-lg font-semibold text-[#0f172a]">
                      Our Mission
                    </h4>
                    <p className="sans-body text-sm leading-relaxed text-gray-700">
                      {companyInfo.objective}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4 group">
                <div className="w-16 h-16 mx-auto bg-[#ECEC75] rounded-full flex items-center justify-center group-hover:bg-[#e6e67c] transition-colors duration-200">
                  <feature.icon size={24} className="text-[#0f172a]" />
                </div>
                <div className="space-y-2">
                  <h4 className="serif-heading text-lg font-semibold text-[#0f172a]">
                    {feature.title}
                  </h4>
                  <p className="sans-body text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;