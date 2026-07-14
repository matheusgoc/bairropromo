interface ProfileModel {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: 'M' | 'F' | 'N' | 'O' | 'U' | '';
  role: 'customer' | 'owner' | 'admin' | 'master';
  subscriptionStatus: 'success' | 'pending' | 'not_applied';
}

export default ProfileModel;
