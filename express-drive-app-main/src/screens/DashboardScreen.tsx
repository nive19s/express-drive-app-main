import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDelivery } from '@/contexts/DeliveryContext';
import { useAuth } from '@/contexts/AuthContext';
import { DeliveryCard } from '@/components/DeliveryCard';
import { Package, Clock, CheckCircle, Play, User, LogOut } from 'lucide-react';

interface DashboardScreenProps {
  onNavigateToDeliveryRun: () => void;
  onNavigateToProfile: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  onNavigateToDeliveryRun, 
  onNavigateToProfile 
}) => {
  const { deliveries, selectedDeliveries, startDeliveryRun } = useDelivery();
  const { user, logout } = useAuth();

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const completedDeliveries = deliveries.filter(d => d.status !== 'pending');

  const handleStartRun = () => {
    startDeliveryRun();
    onNavigateToDeliveryRun();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">SwiftTrack</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onNavigateToProfile}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingDeliveries.length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{completedDeliveries.length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Deliveries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Deliveries</CardTitle>
              <Badge variant="secondary">{pendingDeliveries.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingDeliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending deliveries</p>
              </div>
            ) : (
              pendingDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Start Delivery Run Button */}
        {selectedDeliveries.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4">
            <Button 
              onClick={handleStartRun} 
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Delivery Run ({selectedDeliveries.length} selected)
            </Button>
          </div>
        )}

        {/* Completed/Other Deliveries */}
        {completedDeliveries.length > 0 && (
          <>
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedDeliveries.map((delivery) => (
                  <DeliveryCard key={delivery.id} delivery={delivery} readonly />
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};