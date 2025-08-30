import { Card, CardContent } from '@/components/ui/card';

export default function ProductsSection() {
  const products = [
    {
      id: 'car-parking',
      title: 'Car Parking',
      description: 'Smart parking solutions for cars',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'
    },
    {
      id: 'traffic-challan',
      title: 'Traffic Challan',
      description: 'Easy challan checking and payment',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'
    },
    {
      id: 'ev-solution',
      title: 'EV Solution',
      description: 'Electric vehicle charging network',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'
    },
    {
      id: 'valet-services',
      title: 'Valet Services',
      description: 'Premium valet parking service',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'
    }
  ];

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600">Comprehensive solutions for all your parking and vehicle needs</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="shadow-lg card-hover" data-testid={`product-${product.id}`}>
              <CardContent className="p-6 text-center">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="rounded-lg w-full h-32 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
