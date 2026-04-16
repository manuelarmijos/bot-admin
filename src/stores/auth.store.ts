import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/modules/auth/services/auth.service';
import type { JwtPayload, UserProfile } from '@/types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const token  = ref<string | null>(localStorage.getItem('token'));
  const user   = ref<UserProfile | null>(null);
  const loading = ref(false);
  const error   = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function _hydrate() {
    if (!token.value) return;
    try {
      const payload = jwtDecode<JwtPayload>(token.value);
      user.value = {
        id:            payload.id,
        email:         payload.email,
        name:          payload.name ?? payload.email?.split('@')[0] ?? 'Usuario',
        image:         payload.image,
        applicationId: payload.applicationId,
        idDevice:      payload.idDevice,
      };
    } catch {
      token.value = null;
      localStorage.removeItem('token');
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value   = null;
    try {
      const res = await authService.login(email, password);
      const raw = res.token ?? res.access_token ?? (res as any).data?.token;
      if (!raw) throw new Error('Token no recibido');

      token.value = raw;
      localStorage.setItem('token', raw);

      // If response includes user data directly, merge it
      if (res.user) {
        user.value = res.user;
      } else {
        _hydrate();
      }

      // If name/image come in response root level
      const anyRes = res as any;
      if (user.value && anyRes.name)  user.value.name  = anyRes.name;
      if (user.value && anyRes.image) user.value.image = anyRes.image;

      return true;
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? e?.message ?? 'Error al iniciar sesión';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value  = null;
    localStorage.removeItem('token');
  }

  // Hydrate on store creation
  _hydrate();

  return { token, user, loading, error, isAuthenticated, login, logout };
});
