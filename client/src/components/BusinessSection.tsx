import { Card, CardContent } from '@/components/ui/card';

export default function BusinessSection() {
  const businessFeatures = [
    {
      id: 'anpr',
      title: 'ANPR Technology',
      description: 'Automatic Number Plate Recognition for seamless entry and exit',
      icon: 'fas fa-camera',
      color: 'blue',
      features: ['99.5% accuracy', 'Real-time processing', '24/7 monitoring']
    },
    {
      id: 'analytics',
      title: 'Real-Time Analytics',
      description: 'Visual analytics dashboard for parking spot optimization',
      icon: 'fas fa-chart-line',
      color: 'green',
      features: ['Live occupancy data', 'Revenue insights', 'Trend analysis']
    },
    {
      id: 'ev-solutions',
      title: 'Smart EV Solutions',
      description: 'Shortest path optimization for electric vehicle charging',
      icon: 'fas fa-route',
      color: 'purple',
      features: ['Route optimization', 'Charging status', 'Payment integration']
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        iconBg: 'bg-blue-600',
        iconText: 'text-white'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        iconBg: 'bg-green-600',
        iconText: 'text-white'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        iconBg: 'bg-purple-600',
        iconText: 'text-white'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section id="business" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Park Sarthi for Businesses</h2>
          <p className="text-xl text-gray-600">Advanced parking solutions for modern businesses</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {businessFeatures.map((feature) => {
            const colors = getColorClasses(feature.color);
            return (
              <Card key={feature.id} className={`${colors.bg} card-hover`} data-testid={`business-feature-${feature.id}`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <i className={`${feature.icon} ${colors.iconText} text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-700 mb-6">{feature.description}</p>
                  <div className="space-y-2 text-sm">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center justify-center space-x-2">
                        <i className="fas fa-check text-green-500"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
