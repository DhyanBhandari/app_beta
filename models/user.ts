export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'organization';
  avatar?: string;
  createdAt: Date;
  onboardingCompleted: boolean;
}

export interface UserOnboarding {
  name: string;
  profession: string;
  interests: string[];
  goals: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
}

export interface OrganizationOnboarding {
  companyName: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  description: string;
  website?: string;
  goals: string[];
}