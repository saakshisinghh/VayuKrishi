export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  farmName?: string;
  location?: {
    district: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

export interface LoginPayload {
  phone: string;
}

export interface OtpPayload {
  phone: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
