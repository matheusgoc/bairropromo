import ProfileModel from '@/models/profile.model';

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

  update: async (data: Partial<ProfileModel>) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return mockProfile;
  },

  subscribe: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      ...mockProfile,
      subscriptionStatus: 'success',
    };
  },
};

export default ProfileService;
