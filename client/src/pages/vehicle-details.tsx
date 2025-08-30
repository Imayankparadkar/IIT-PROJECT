import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import VehicleDetails from '@/components/VehicleDetails';
import { ArrowLeft } from 'lucide-react';

export default function VehicleDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Details & Challan Checker</h1>
                <p className="text-sm text-gray-600">Complete vehicle information and traffic violation lookup</p>
              </div>
            </div>
            <Link href="/">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-parking text-white text-sm"></i>
                </div>
                <span className="text-lg font-bold text-primary">Park Sarthi</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How it works</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">1</span>
                <span>Enter your vehicle registration number</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-xs">2</span>
                <span>Get complete vehicle and owner details</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium text-xs">3</span>
                <span>View pending challans and current location</span>
              </div>
            </div>
          </div>
        </div>

        <VehicleDetails />

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Vehicle Types</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-car text-blue-600"></i>
                <span className="text-gray-700">Four-wheelers (Cars, SUVs, etc.)</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-motorcycle text-green-600"></i>
                <span className="text-gray-700">Two-wheelers (Bikes, Scooters)</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-truck text-purple-600"></i>
                <span className="text-gray-700">Commercial vehicles</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-bolt text-yellow-600"></i>
                <span className="text-gray-700">Electric vehicles (EVs)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-user text-blue-600"></i>
                <span className="text-gray-700">Owner name and registration details</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-green-600"></i>
                <span className="text-gray-700">Current parking location</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
                <span className="text-gray-700">Pending traffic violations</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-history text-purple-600"></i>
                <span className="text-gray-700">Recent parking history</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need to Book Parking?</h3>
          <p className="text-blue-100 mb-6">Once you've checked your vehicle details, book your next parking spot with Park Sarthi</p>
          <Link href="/">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 font-semibold">
              Explore Parking Options
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}