import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  Zap, 
  TrendingUp, 
  Star, 
  Car, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface DashboardData {
  totalServices: number;
  completedServices: number;
  documentsUploaded: number;
  totalDocuments: number;
  evStationsUsed: number;
  totalSavings: number;
  userLevel: number;
  totalPoints: number;
  upcomingService: {
    type: string;
    date: string;
    location: string;
  } | null;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'scheduled';
  }>;
}

const generateDashboardData = (): DashboardData => {
  const activities = [
    'Service booking completed',
    'Document uploaded',
    'EV charging session',
    'Profile updated',
    'Points earned from referral'
  ];

  const serviceTypes = ['Oil Change', 'Battery Service', 'Car Wash', 'General Service'];
  const locations = ['Central Mall', 'IT Park', 'Airport Road', 'Vijay Nagar'];

  return {
    totalServices: Math.floor(Math.random() * 20) + 5,
    completedServices: Math.floor(Math.random() * 15) + 3,
    documentsUploaded: Math.floor(Math.random() * 4) + 1,
    totalDocuments: 4,
    evStationsUsed: Math.floor(Math.random() * 8) + 2,
    totalSavings: Math.floor(Math.random() * 5000) + 1000,
    userLevel: Math.floor(Math.random() * 5) + 1,
    totalPoints: Math.floor(Math.random() * 2000) + 500,
    upcomingService: Math.random() > 0.5 ? {
      type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      date: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      location: locations[Math.floor(Math.random() * locations.length)]
    } : null,
    recentActivity: Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${i}`,
      type: activities[Math.floor(Math.random() * activities.length)],
      description: `${activities[Math.floor(Math.random() * activities.length)]} successfully`,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      status: ['completed', 'pending', 'scheduled'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'scheduled'
    }))
  };
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Generate new dummy data on every visit for real-time effect
    setDashboardData(generateDashboardData());
  }, []);

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-xl text-gray-600">Welcome back! Here's your automotive overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Services</p>
                    <p className="text-2xl font-bold">{dashboardData.totalServices}</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    {dashboardData.completedServices} completed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Documents</p>
                    <p className="text-2xl font-bold">{dashboardData.documentsUploaded}/{dashboardData.totalDocuments}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2">
                  <Badge className="bg-purple-100 text-purple-800">
                    {Math.round((dashboardData.documentsUploaded / dashboardData.totalDocuments) * 100)}% complete
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">EV Sessions</p>
                    <p className="text-2xl font-bold">{dashboardData.evStationsUsed}</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    This month
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Savings</p>
                    <p className="text-2xl font-bold">₹{dashboardData.totalSavings.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="mt-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    All time
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Service */}
              {dashboardData.upcomingService && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">{dashboardData.upcomingService.type}</h3>
                        <p className="text-gray-600">
                          {dashboardData.upcomingService.date} at {dashboardData.upcomingService.location}
                        </p>
                      </div>
                      <Button size="sm" data-testid="button-view-service">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link href="/services">
                      <Button className="w-full h-20 flex flex-col gap-2" variant="outline" data-testid="button-book-service">
                        <Car className="h-6 w-6" />
                        Book Service
                      </Button>
                    </Link>
                    <Link href="/documents">
                      <Button className="w-full h-20 flex flex-col gap-2" variant="outline" data-testid="button-upload-docs">
                        <FileText className="h-6 w-6" />
                        Upload Docs
                      </Button>
                    </Link>
                    <Link href="/ev-stations">
                      <Button className="w-full h-20 flex flex-col gap-2" variant="outline" data-testid="button-find-ev">
                        <Zap className="h-6 w-6" />
                        Find EV Station
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-center gap-3 p-3 border rounded-lg"
                        data-testid={`activity-${activity.id}`}
                      >
                        {getStatusIcon(activity.status)}
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Your Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      Level {dashboardData.userLevel}
                    </div>
                    <div className="text-lg font-semibold mb-4">
                      {dashboardData.totalPoints.toLocaleString()} Points
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(dashboardData.totalPoints % 1000) / 10}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {1000 - (dashboardData.totalPoints % 1000)} points to next level
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Complete</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documents Verified</span>
                      {dashboardData.documentsUploaded === dashboardData.totalDocuments ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> :
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2FA Enabled</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant support for all your queries.
                  </p>
                  <Link href="/support">
                    <Button className="w-full" data-testid="button-contact-support">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}