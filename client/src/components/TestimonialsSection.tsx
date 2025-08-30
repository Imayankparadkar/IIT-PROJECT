import { Card, CardContent } from '@/components/ui/card';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Regular User",
      avatar: "R",
      avatarColor: "bg-blue-500",
      rating: 5,
      content: "Park Sarthi has made my daily commute so much easier. The pre-booking feature saves me 15 minutes every day!",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Business Owner",
      avatar: "P",
      avatarColor: "bg-green-500",
      rating: 5,
      content: "The gamification makes parking fun! I love earning points and the EV station finder is incredibly helpful.",
    },
    {
      id: 3,
      name: "Amit Gupta",
      role: "IT Professional",
      avatar: "A",
      avatarColor: "bg-purple-500",
      rating: 5,
      content: "Secure document storage is a game-changer. No more worrying about carrying physical documents everywhere!",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Real feedback from our amazing Park Sarthi community</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-gray-50 card-hover" data-testid={`testimonial-${testimonial.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <h5 className="font-semibold" data-testid={`testimonial-name-${testimonial.id}`}>
                      {testimonial.name}
                    </h5>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4" data-testid={`testimonial-content-${testimonial.id}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400"></i>
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
