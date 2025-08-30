import { Card, CardContent } from '@/components/ui/card';

export default function CaseStudiesSection() {
  const caseStudies = [
    {
      id: 'c21-mall',
      title: 'C21 Mall Indore',
      description: 'Solved parking capacity issues with smart slot management and real-time availability updates.',
      image: 'https://images.unsplash.com/photo-1582016191679-46a57ffc894d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
      metrics: [
        { label: 'Capacity Increase', value: '+35%', color: 'text-green-600' },
        { label: 'Wait Time Reduction', value: '-60%', color: 'text-green-600' },
        { label: 'Customer Satisfaction', value: '4.8/5', color: 'text-green-600' }
      ]
    },
    {
      id: 'treasure-island',
      title: 'Treasure Island Mall',
      description: 'Provided real-time parking visibility with advanced ANPR technology and mobile integration.',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
      metrics: [
        { label: 'Revenue Growth', value: '+42%', color: 'text-green-600' },
        { label: 'Efficiency Gain', value: '+55%', color: 'text-green-600' },
        { label: 'App Adoption', value: '85%', color: 'text-green-600' }
      ]
    },
    {
      id: 'orbit-mall',
      title: 'Orbit Mall Indore',
      description: 'Implemented automated residential parking solutions with contactless payment systems.',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
      metrics: [
        { label: 'Automation Rate', value: '95%', color: 'text-green-600' },
        { label: 'Cost Reduction', value: '-40%', color: 'text-green-600' },
        { label: 'User Rating', value: '4.9/5', color: 'text-green-600' }
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600">How Park Sarthi transformed parking operations across Indore</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <Card key={study.id} className="shadow-lg overflow-hidden card-hover" data-testid={`case-study-${study.id}`}>
              <img 
                src={study.image} 
                alt={`${study.title} Case Study`}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3" data-testid={`case-study-title-${study.id}`}>
                  {study.title}
                </h3>
                <p className="text-gray-600 mb-4">{study.description}</p>
                <div className="space-y-2 text-sm">
                  {study.metrics.map((metric, index) => (
                    <div key={index} className="flex justify-between" data-testid={`metric-${study.id}-${index}`}>
                      <span>{metric.label}:</span>
                      <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
