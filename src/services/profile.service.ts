import ProfileModel from '@/models/profile.model';

export interface SigninPayload {
  email: string;
  password: string;
}

export interface ResetPayload {
  email: string;
}

export interface PasswordPayload {
  password: string;
}

export interface ApplyPayload {
  plan: 'monthly' | 'yearly';
}

export interface ProfileFormPayload {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: boolean;
  dob?: string;
  gender?: ProfileModel['gender'] | '';
}

export interface ConfirmSignupPayload {
  code: string;
}

export interface AuthResponse {
  token: string;
  profile: ProfileModel;
}

/**
 * Mocked sign-up confirmation codes. Any code other than `success` or
 * `expired` behaves like `invalid`.
 */
export const MOCK_CONFIRMATION_CODES = {
  success: '123456',
  expired: '000000',
  invalid: '111111',
} as const;

/**
 * Cognito exception names, as Amplify exposes them on `error.name`.
 * The mock throws the same names so screens won't change when Amplify
 * replaces it.
 */
export const EXPIRED_CODE_ERROR = 'ExpiredCodeException';
export const CODE_MISMATCH_ERROR = 'CodeMismatchException';

const authError = (name: string, message: string) =>
  Object.assign(new Error(message), { name });

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
  signin: async (_data: SigninPayload): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { token: 'mock-token-abc123', profile: mockProfile };
  },

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

  signup: async (data: ProfileFormPayload): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      token: 'mock-token-abc123',
      profile: { ...mockProfile, name: data.name, email: data.email },
    };
  },

  confirmSignup: async ({ code }: ConfirmSignupPayload): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (code === MOCK_CONFIRMATION_CODES.success) return;
    if (code === MOCK_CONFIRMATION_CODES.expired) {
      throw authError(EXPIRED_CODE_ERROR, 'Confirmation code has expired.');
    }
    throw authError(CODE_MISMATCH_ERROR, 'Invalid confirmation code.');
  },

  resendSignupCode: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  apply: async (_data: ApplyPayload): Promise<ProfileModel> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { ...mockProfile, subscriptionStatus: 'success' };
  },

  signout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export default ProfileService;
