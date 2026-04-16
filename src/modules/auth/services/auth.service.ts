import { authHttp } from '@/http/axios';
import { APP_CONFIG } from '@/config/constants';
import type { LoginRequest, LoginResponse } from '@/types/auth.types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { ID_DEVICE, APPLICATION_ID, ID_APP } = APP_CONFIG;

    const payload: LoginRequest = {
      email,
      password,
      application: { id: APPLICATION_ID },
      idDevice: ID_DEVICE,
      idApp: ID_APP,
    };

    const { data } = await authHttp.post<LoginResponse>(
      `/login/${ID_DEVICE}/${APPLICATION_ID}/1`,
      payload,
    );

    return data;
  },
};
