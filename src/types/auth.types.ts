export interface LoginRequest {
  email: string;
  password: string;
  application: { id: number };
  idDevice: string;
  idApp: number;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: UserProfile;
  errorCode?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  image?: string;
  applicationId?: number;
  idDevice?: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  idDevice: string;
  applicationId: number;
  roles: string[];
  name?: string;
  image?: string;
  exp?: number;
  iat?: number;
}
