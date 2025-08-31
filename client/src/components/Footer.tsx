export default function Footer() {
  const quickLinks = [
    'Contact Us', 'Blogs', 'SBI FASTag Recharge', 'Telangana Challan',
    'Tech Blogs', 'Valet Services', 'Bug Bounty', 'FASTag Annual Pass'
  ];

  const products = [
    'Cars', 'Challan Information', 'FASTag', 'Parking Solutions',
    'Fuel Price', 'RTO', 'Loans'
  ];

  const moreLinks = [
    'Privacy Policy', 'Terms of Service', 'Careers', 'Support'
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/attached_assets/WhatsApp_Image_2025-08-31_at_01.12.54_10389c77-removebg-preview_1756606944259.png" 
                alt="Park Sarthi Logo" 
                className="w-8 h-8 object-contain"
              />
              <a href="/" className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
                Park Sarthi
              </a>
            </div>
            <p className="text-gray-400 mb-4">
              Your Spot, Just a Tap Away. Making parking simpler, faster, and stress-free.
            </p>
            <div className="flex space-x-4">
              <i className="fab fa-facebook text-blue-500 text-xl cursor-pointer hover:text-blue-400 transition-colors" data-testid="social-facebook"></i>
              <i className="fab fa-twitter text-blue-400 text-xl cursor-pointer hover:text-blue-300 transition-colors" data-testid="social-twitter"></i>
              <i className="fab fa-linkedin text-blue-600 text-xl cursor-pointer hover:text-blue-500 transition-colors" data-testid="social-linkedin"></i>
              <i className="fab fa-instagram text-pink-500 text-xl cursor-pointer hover:text-pink-400 transition-colors" data-testid="social-instagram"></i>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors" data-testid={`quick-link-${index}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              {products.map((product, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors" data-testid={`product-link-${index}`}>
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* More Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">More</h4>
            <ul className="space-y-2 text-gray-400">
              {moreLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors" data-testid={`more-link-${index}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Park Sarthi. All rights reserved. | Made with ❤️ for better parking experiences</p>
        </div>
      </div>
    </footer>
  );
}
