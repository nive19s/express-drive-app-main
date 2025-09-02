import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDelivery } from '@/contexts/DeliveryContext';
import { MapComponent } from '@/components/MapComponent';
import { DeliveryStatusModal } from '@/components/DeliveryStatusModal';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Phone, Package, CheckCircle, XCircle } from 'lucide-react';

interface DeliveryRunScreenProps {
  onNavigateBack: () => void;
}

export const DeliveryRunScreen: React.FC<DeliveryRunScreenProps> = ({ onNavigateBack }) => {
  const { currentRun, nextDelivery, previousDelivery, endDeliveryRun } = useDelivery();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState<'delivered' | 'failed' | null>(null);

  if (!currentRun) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No active delivery run</p>
            <Button onClick={onNavigateBack} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDelivery = currentRun.deliveries[currentRun.currentIndex];
  const isFirstStop = currentRun.currentIndex === 0;
  const isLastStop = currentRun.currentIndex === currentRun.deliveries.length - 1;

  const handleStatusAction = (action: 'delivered' | 'failed') => {
    setStatusAction(action);
    setShowStatusModal(true);
  };

  const handleEndRun = () => {
    endDeliveryRun();
    onNavigateBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onNavigateBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Delivery Run</h1>
              <p className="text-sm text-muted-foreground">
                Stop {currentRun.currentIndex + 1} of {currentRun.deliveries.length}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleEndRun}>
            End Run
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {currentRun.currentIndex + 1} / {currentRun.deliveries.length}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentRun.currentIndex + 1) / currentRun.deliveries.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Delivery Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Delivery</CardTitle>
              <Badge variant="outline" className="font-mono">
                {currentDelivery.orderId}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{currentDelivery.recipientName}</h3>
              <div className="flex items-start space-x-2 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{currentDelivery.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{currentDelivery.phone}</span>
              </div>
            </div>

            <Separator />

            {/* Items to Deliver */}
            <div>
              <h4 className="font-medium flex items-center space-x-2 mb-3">
                <Package className="w-4 h-4" />
                <span>Items to Deliver</span>
              </h4>
              <div className="space-y-2">
                {currentDelivery.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm">{item.name}</span>
                    <Badge variant="secondary" className="text-xs">x{item.quantity}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {currentDelivery.specialInstructions && (
              <>
                <Separator />
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1">Special Instructions</h4>
                  <p className="text-blue-800 text-sm">{currentDelivery.specialInstructions}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MapComponent address={currentDelivery.address} />
          </CardContent>
        </Card>

        {/* Navigation and Actions */}
        <div className="space-y-3">
          {/* Navigation Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={previousDelivery} 
              disabled={isFirstStop}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={nextDelivery} 
              disabled={isLastStop}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleStatusAction('delivered')}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Delivered
            </Button>
            <Button 
              onClick={() => handleStatusAction('failed')}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Mark as Failed
            </Button>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && statusAction && (
        <DeliveryStatusModal
          deliveryId={currentDelivery.id}
          action={statusAction}
          onClose={() => {
            setShowStatusModal(false);
            setStatusAction(null);
          }}
        />
      )}
    </div>
  );
};