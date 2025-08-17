import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Services", href: "services" },
    { name: "Contact", href: "contact" },
  ]

  const services = [
    "Visa Consultation",
    "Work Permits",
    "Permanent Residency",
    "Citizenship Assistance",
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Logo & Description */}
            <div className="space-y-6">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Amazing Visa Service Logo"
                  className="h-12"
                />
              </div>
              <p className="text-sm leading-relaxed text-white">
                Making your global journey smoother with expert visa and
                immigration services.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="serif-heading text-lg font-semibold text-[#ECEC75]">
                Quick Links
              </h4>
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
              <h4 className="serif-heading text-lg font-semibold text-[#ECEC75]">
                Our Services
              </h4>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="sans-body text-sm text-white"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="serif-heading text-lg font-semibold text-[#ECEC75]">
                Contact Info
              </h4>
              <div className="space-y-4 text-sm text-white">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#ECEC75]" />
                  <span>info@amazingvisaservice.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#ECEC75]" />
                  <span>+66 123 456 789</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#ECEC75]" />
                  <span>120/9-10 Ratchaprarop Rd, Bangkok</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center text-sm text-white">
            © {new Date().getFullYear()} Amazing Visa Service. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
