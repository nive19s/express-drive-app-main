export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
}

export interface DeliveryItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  recipientName: string;
  address: string;
  phone: string;
  items: DeliveryItem[];
  status: 'pending' | 'delivered' | 'failed';
  estimatedTime?: string;
  specialInstructions?: string;
  proofOfDelivery?: string;
  failureReason?: string;
}

export interface DeliveryRun {
  id: string;
  deliveries: Delivery[];
  currentIndex: number;
  startTime?: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}