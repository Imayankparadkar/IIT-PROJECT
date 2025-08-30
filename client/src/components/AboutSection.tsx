export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Helping customers with their car needs and beyond
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            What started as a mission to connect commuters to safe, secure, and digitized parking spaces 
            all across the country has now expanded to become a safe space to cater to people's car needs.
          </p>
        </div>
        
        {/* Future Scope */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Future Innovations</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="future-ai">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-blue-600 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2">AI-Based Prediction</h4>
              <p className="text-gray-600">Smart algorithms predict parking demand and optimize slot allocation</p>
            </div>
            <div className="text-center" data-testid="future-smart-city">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-city text-green-600 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2">Smart City Integration</h4>
              <p className="text-gray-600">Seamless integration with smart city infrastructure and traffic management</p>
            </div>
            <div className="text-center" data-testid="future-voice">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-microphone text-purple-600 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2">Voice-Enabled Booking</h4>
              <p className="text-gray-600">Book parking spots using voice commands for hands-free experience</p>
            </div>
          </div>
        </div>
        
        {/* Clients */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Our Trusted Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="client-c21">
              <img 
                src="https://images.unsplash.com/photo-1582016191679-46a57ffc894d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120" 
                alt="C21 Mall Indore" 
                className="rounded-lg mx-auto mb-2 w-full h-20 object-cover"
              />
              <h5 className="font-semibold">C21 Mall</h5>
              <p className="text-sm text-gray-600">Indore</p>
            </div>
            <div className="text-center" data-testid="client-treasure">
              <img 
                src="https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120" 
                alt="Treasure Island Mall" 
                className="rounded-lg mx-auto mb-2 w-full h-20 object-cover"
              />
              <h5 className="font-semibold">Treasure Island</h5>
              <p className="text-sm text-gray-600">Mall</p>
            </div>
            <div className="text-center" data-testid="client-orbit">
              <img 
                src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120" 
                alt="Orbit Mall" 
                className="rounded-lg mx-auto mb-2 w-full h-20 object-cover"
              />
              <h5 className="font-semibold">Orbit Mall</h5>
              <p className="text-sm text-gray-600">Indore</p>
            </div>
            <div className="text-center" data-testid="client-institutions">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120" 
                alt="Educational Institutions" 
                className="rounded-lg mx-auto mb-2 w-full h-20 object-cover"
              />
              <h5 className="font-semibold">Colleges</h5>
              <p className="text-sm text-gray-600">& Hospitals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
