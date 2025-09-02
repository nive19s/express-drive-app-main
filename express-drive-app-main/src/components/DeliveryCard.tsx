import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useDelivery } from '@/contexts/DeliveryContext';
import { Delivery } from '@/types';
import { MapPin, Phone, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

interface DeliveryCardProps {
  delivery: Delivery;
  readonly?: boolean;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery, readonly = false }) => {
  const { selectedDeliveries, toggleDeliverySelection } = useDelivery();
  const isSelected = selectedDeliveries.includes(delivery.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-500';
      case 'delivered': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleCardClick = () => {
    if (!readonly && delivery.status === 'pending') {
      toggleDeliverySelection(delivery.id);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected && !readonly ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${readonly ? 'opacity-75' : 'hover:shadow-md'}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {!readonly && delivery.status === 'pending' && (
            <Checkbox 
              checked={isSelected}
              onChange={() => toggleDeliverySelection(delivery.id)}
              className="mt-1"
            />
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {delivery.orderId}
                </Badge>
                <div className={`flex items-center space-x-1 ${getStatusColor(delivery.status)}`}>
                  {getStatusIcon(delivery.status)}
                  <span className="text-xs font-medium capitalize">{delivery.status}</span>
                </div>
              </div>
              {delivery.estimatedTime && delivery.status === 'pending' && (
                <Badge variant="secondary" className="text-xs">
                  {delivery.estimatedTime}
                </Badge>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm">{delivery.recipientName}</h4>
              <div className="flex items-start space-x-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{delivery.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{delivery.phone}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Package className="w-3 h-3" />
                <span>{delivery.items.length} item{delivery.items.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {delivery.specialInstructions && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <strong>Note:</strong> {delivery.specialInstructions}
              </div>
            )}

            {delivery.failureReason && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <strong>Failed:</strong> {delivery.failureReason}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};