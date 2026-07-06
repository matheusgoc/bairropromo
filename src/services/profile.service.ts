import ProfileModel from '@/models/profile.model';

export interface ResetPayload {
  email: string;
}

export interface PasswordPayload {
  password: string;
}

export interface ApplyPayload {
  plan: 'monthly' | 'yearly';
}

export interface SignupPayload {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: boolean;
  dob?: string;
  gender?: string;
}

const mockProfile: ProfileModel = {
  id: '1',
  name: 'João da Silva',
  email: 'joao.silva@example.com',
  phone: '31 99999-9999',
  dob: '1990-05-15',
  gender: 'M',
  role: 'customer',
  subscriptionStatus: 'not_applied',
};

const ProfileService = {
  get: async (): Promise<ProfileModel> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return mockProfile;
  },

  update: async (_data: Partial<ProfileModel>) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return mockProfile;
  },

  resetPassword: async (_data: ResetPayload): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },

  setPassword: async (_data: PasswordPayload): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },

  signup: async (data: SignupPayload): Promise<ProfileModel> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { ...mockProfile, name: data.name, email: data.email };
  },

  apply: async (_data: ApplyPayload): Promise<ProfileModel> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { ...mockProfile, subscriptionStatus: 'success' };
  },
};

export default ProfileService;
