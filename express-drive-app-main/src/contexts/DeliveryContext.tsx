import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Delivery, DeliveryRun } from '@/types';

interface DeliveryContextType {
  deliveries: Delivery[];
  selectedDeliveries: string[];
  currentRun: DeliveryRun | null;
  toggleDeliverySelection: (deliveryId: string) => void;
  startDeliveryRun: () => void;
  updateDeliveryStatus: (deliveryId: string, status: 'delivered' | 'failed', data?: { proofOfDelivery?: string; failureReason?: string }) => void;
  nextDelivery: () => void;
  previousDelivery: () => void;
  endDeliveryRun: () => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

// Mock delivery data
const mockDeliveries: Delivery[] = [
  {
    id: '1',
    orderId: 'ORD001',
    recipientName: 'Alice Johnson',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    phone: '+1234567890',
    items: [
      { name: 'Pizza Margherita', quantity: 1 },
      { name: 'Coca Cola', quantity: 2 }
    ],
    status: 'pending',
    estimatedTime: '30 mins',
    specialInstructions: 'Ring doorbell twice'
  },
  {
    id: '2',
    orderId: 'ORD002',
    recipientName: 'Bob Smith',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    phone: '+1987654321',
    items: [
      { name: 'Burger Combo', quantity: 1 },
      { name: 'French Fries', quantity: 1 }
    ],
    status: 'pending',
    estimatedTime: '25 mins'
  },
  {
    id: '3',
    orderId: 'ORD003',
    recipientName: 'Carol Davis',
    address: '789 Pine Rd, Queens, NY 11355',
    phone: '+1122334455',
    items: [
      { name: 'Chicken Sandwich', quantity: 2 },
      { name: 'Salad', quantity: 1 }
    ],
    status: 'delivered',
    proofOfDelivery: 'photo_proof_1.jpg'
  }
];

interface DeliveryProviderProps {
  children: ReactNode;
}

export const DeliveryProvider: React.FC<DeliveryProviderProps> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [currentRun, setCurrentRun] = useState<DeliveryRun | null>(null);

  const toggleDeliverySelection = (deliveryId: string) => {
    setSelectedDeliveries(prev => 
      prev.includes(deliveryId) 
        ? prev.filter(id => id !== deliveryId)
        : [...prev, deliveryId]
    );
  };

  const startDeliveryRun = () => {
    const selectedDeliv = deliveries.filter(d => selectedDeliveries.includes(d.id) && d.status === 'pending');
    if (selectedDeliv.length > 0) {
      const run: DeliveryRun = {
        id: Date.now().toString(),
        deliveries: selectedDeliv,
        currentIndex: 0,
        startTime: new Date()
      };
      setCurrentRun(run);
      setSelectedDeliveries([]);
    }
  };

  const updateDeliveryStatus = (deliveryId: string, status: 'delivered' | 'failed', data?: { proofOfDelivery?: string; failureReason?: string }) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { ...delivery, status, ...data }
        : delivery
    ));

    if (currentRun) {
      setCurrentRun(prev => prev ? {
        ...prev,
        deliveries: prev.deliveries.map(delivery =>
          delivery.id === deliveryId 
            ? { ...delivery, status, ...data }
            : delivery
        )
      } : null);
    }
  };

  const nextDelivery = () => {
    if (currentRun && currentRun.currentIndex < currentRun.deliveries.length - 1) {
      setCurrentRun(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null);
    }
  };

  const previousDelivery = () => {
    if (currentRun && currentRun.currentIndex > 0) {
      setCurrentRun(prev => prev ? { ...prev, currentIndex: prev.currentIndex - 1 } : null);
    }
  };

  const endDeliveryRun = () => {
    setCurrentRun(null);
  };

  const value = {
    deliveries,
    selectedDeliveries,
    currentRun,
    toggleDeliverySelection,
    startDeliveryRun,
    updateDeliveryStatus,
    nextDelivery,
    previousDelivery,
    endDeliveryRun
  };

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
};