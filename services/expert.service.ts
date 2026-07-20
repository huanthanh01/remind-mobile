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
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  yearsOfExperience?: number;
}

export interface MobileExpertSlot {
  _id: string;
  expertId: string;
  startAt: string;
  endAt: string;
  price: number;
  status: 'available' | 'booked';
}

export interface MobileAppointment {
  _id: string;
  expertId: string | { _id?: string } | any;
  status: string;
  scheduledStartAt?: string;
}

export interface ExpertProfile extends MobileExpert {
  title: string;
  bio: string;
  specialties: string[];
  languages: string[];
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
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

  getExpertProfile: async (expertId: string): Promise<ExpertProfile | null> => {
    try {
      const res = await apiHelper.get<{ expert: ExpertProfile }>(`/experts/${expertId}`);
      return res.expert || null;
    } catch {
      return null;
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

  getMyAppointments: async (): Promise<MobileAppointment[]> => {
    try {
      const res = await apiHelper.get<{ appointments: MobileAppointment[] }>('/appointments/mine');
      return res.appointments || [];
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
