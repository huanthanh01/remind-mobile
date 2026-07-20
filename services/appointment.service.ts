import { apiHelper } from './api';

export interface MobileAppointment {
  _id: string;
  studentId: string;
  expertId: {
    _id: string;
    fullName: string;
    expert?: {
      profile?: {
        professionalTitle?: string;
        bio?: string;
      };
    };
  };
  slotId: string;
  amount?: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled' | 'pending_payment' | 'booked';
  scheduledStartAt: string;
  scheduledEndAt: string;
  createdAt: string;
}

export const AppointmentService = {
  getMyAppointments: async (): Promise<MobileAppointment[]> => {
    try {
      const res = await apiHelper.get<{ appointments: MobileAppointment[] }>('/appointments/mine');
      return res.appointments || [];
    } catch {
      return [];
    }
  },

  cancelAppointment: async (appointmentId: string): Promise<unknown> => {
    return apiHelper.post(`/appointments/${appointmentId}/cancel`);
  },
};
