import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDelivery } from '@/contexts/DeliveryContext';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from 'sonner';
import { Camera as CameraIcon, Image, AlertCircle } from 'lucide-react';

interface DeliveryStatusModalProps {
  deliveryId: string;
  action: 'delivered' | 'failed';
  onClose: () => void;
}

const failureReasons = [
  'Recipient unavailable',
  'Wrong address',
  'Access denied',
  'Damaged package',
  'Refused by recipient',
  'Business closed',
  'Other'
];

export const DeliveryStatusModal: React.FC<DeliveryStatusModalProps> = ({
  deliveryId,
  action,
  onClose
}) => {
  const { updateDeliveryStatus } = useDelivery();
  const [photo, setPhoto] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        setPhoto(`data:image/jpeg;base64,${image.base64String}`);
        toast.success('Photo captured successfully!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Failed to take photo. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (action === 'delivered' && !photo) {
      toast.error('Please take a photo as proof of delivery');
      return;
    }

    if (action === 'failed' && !failureReason) {
      toast.error('Please select a failure reason');
      return;
    }

    setIsLoading(true);
    try {
      const data = action === 'delivered' 
        ? { proofOfDelivery: photo || '' }
        : { failureReason };

      updateDeliveryStatus(deliveryId, action, data);
      toast.success(
        action === 'delivered' 
          ? 'Delivery marked as completed!' 
          : 'Delivery marked as failed'
      );
      onClose();
    } catch (error) {
      toast.error('Failed to update delivery status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {action === 'delivered' ? (
              <>
                <CameraIcon className="w-5 h-5 text-green-600" />
                <span>Proof of Delivery</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Delivery Failed</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {action === 'delivered' ? (
            <>
              <p className="text-sm text-muted-foreground">
                Take a photo as proof of delivery
              </p>
              
              {photo ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={photo} 
                      alt="Proof of delivery" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2"
                    >
                      Retake
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={takePhoto} variant="outline" className="w-full h-32 flex-col space-y-2">
                  <CameraIcon className="w-8 h-8 text-muted-foreground" />
                  <span>Take Photo</span>
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Please select the reason for delivery failure
              </p>
              
              <Select value={failureReason} onValueChange={setFailureReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select failure reason" />
                </SelectTrigger>
                <SelectContent>
                  {failureReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className={`flex-1 ${
                action === 'delivered' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Updating...' : action === 'delivered' ? 'Confirm Delivery' : 'Confirm Failure'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};