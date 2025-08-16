import React from 'react';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { workflow } from '../data/mock';

const WorkflowSection = () => {
  return (
    <section id="workflow" className="section-spacing bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a]">
              Our Professional Workflow
            </h2>
            <p className="sans-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A step-by-step breakdown of how we work with you to deliver exceptional results. 
              Our proven process ensures transparency and quality at every stage.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-[#ECEC75] rounded-full"></div>

            <div className="space-y-12">
              {workflow.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Number */}
                  <div className="relative z-10 w-16 h-16 bg-[#ECEC75] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="serif-heading text-xl font-bold text-[#0f172a]">
                      {step.step}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 max-w-lg ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="card-lime bg-[#e6e67c] hover:bg-[#ECEC75] transition-colors duration-200">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="serif-heading text-xl font-semibold text-[#0f172a]">
                            {step.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock size={16} />
                            <span className="sans-body text-sm font-medium">
                              {step.duration}
                            </span>
                          </div>
                        </div>
                        <p className="sans-body text-sm text-gray-700 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block flex-1 max-w-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-4 bg-[#ECEC75] rounded-full px-8 py-4">
              <CheckCircle size={24} className="text-[#0f172a]" />
              <div className="text-left">
                <div className="serif-heading text-lg font-semibold text-[#0f172a]">
                  Total Timeline: 8-12 Days
                </div>
                <div className="sans-body text-sm text-gray-700">
                  From initial brief to campaign launch
                </div>
              </div>
              <ArrowRight size={20} className="text-[#0f172a]" />
            </div>
          </div>

          {/* Process Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-[#ECEC75] rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-[#0f172a]" />
              </div>
              <h4 className="serif-heading text-lg font-semibold text-[#0f172a]">
                Transparent Process
              </h4>
              <p className="sans-body text-sm text-gray-600 leading-relaxed">
                Every step is clearly defined with regular check-ins and approvals to ensure you're always informed.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-[#ECEC75] rounded-full flex items-center justify-center">
                <Clock size={24} className="text-[#0f172a]" />
              </div>
              <h4 className="serif-heading text-lg font-semibold text-[#0f172a]">
                Efficient Timeline
              </h4>
              <p className="sans-body text-sm text-gray-600 leading-relaxed">
                Our structured approach ensures quick turnaround times without compromising on quality.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-[#ECEC75] rounded-full flex items-center justify-center">
                <ArrowRight size={24} className="text-[#0f172a]" />
              </div>
              <h4 className="serif-heading text-lg font-semibold text-[#0f172a]">
                Proven Results
              </h4>
              <p className="sans-body text-sm text-gray-600 leading-relaxed">
                This methodology has been refined through hundreds of successful campaigns and client projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;