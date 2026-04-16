<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center px-4 gap-3">
    <!-- Sidebar toggle -->
    <button @click="$emit('toggle-sidebar')"
      class="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Brand -->
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-sm">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
        </svg>
      </div>
      <span class="font-bold text-gray-900 text-sm hidden sm:block">Clipp Bot Admin</span>
    </div>

    <div class="flex-1" />

    <!-- User profile -->
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex flex-col items-end">
        <span class="text-sm font-semibold text-gray-900 leading-tight">{{ user?.name ?? 'Usuario' }}</span>
        <span class="text-xs text-gray-400">{{ user?.email ?? '' }}</span>
      </div>

      <!-- Avatar -->
      <div class="relative">
        <img v-if="user?.image" :src="user.image" :alt="user?.name"
          class="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-200" />
        <div v-else
          class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center ring-2 ring-brand-200">
          <span class="text-white font-bold text-sm">{{ initials }}</span>
        </div>
        <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
      </div>

      <!-- Logout -->
      <button @click="handleLogout"
        class="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
        title="Cerrar sesión">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

defineEmits(['toggle-sidebar']);

const router    = useRouter();
const authStore = useAuthStore();
const user      = computed(() => authStore.user);
const initials  = computed(() => {
  const name = user.value?.name ?? 'U';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
