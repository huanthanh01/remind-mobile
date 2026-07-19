import { apiHelper } from './api';

export interface MobileExpert {
  _id: string;
  fullName: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  priceFrom?: number;
  avatarUrl?: string;
}

export interface MobileExpertSlot {
  _id: string;
  expertId: string;
  startAt: string;
  endAt: string;
  price: number;
  status: 'available' | 'booked';
}

export const ExpertService = {
  getApprovedExperts: async (): Promise<MobileExpert[]> => {
    try {
      const res = await apiHelper.get<{ experts: MobileExpert[] }>('/experts');
      return res.experts || [];
    } catch {
      return [];
    }
  },

  getExpertSlots: async (expertId: string): Promise<MobileExpertSlot[]> => {
    try {
      const res = await apiHelper.get<{ slots: MobileExpertSlot[] }>(`/experts/${expertId}/availability`);
      return res.slots || [];
    } catch {
      return [];
    }
  },

  bookAppointment: async (expertId: string, slotId: string) => {
    return apiHelper.post('/appointments/book', { expertId, slotId });
  },

  createPayment: async (appointmentId: string) => {
    return apiHelper.post('/payments/appointment', { appointmentId });
  },
};
