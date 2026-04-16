<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Panel de Bots</h1>
      <p class="text-gray-400 text-sm mt-0.5">Gestiona y configura tus bots de forma intuitiva</p>
    </div>

    <!-- Stats row (when there are bots) -->
    <div v-if="botsStore.list.length" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="card p-4">
        <p class="text-xs text-gray-400 mb-1">Total Bots</p>
        <p class="text-2xl font-bold text-gray-900">{{ botsStore.list.length }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-gray-400 mb-1">Activos</p>
        <p class="text-2xl font-bold text-emerald-600">{{ activeBots }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-gray-400 mb-1">Inactivos</p>
        <p class="text-2xl font-bold text-gray-400">{{ botsStore.list.length - activeBots }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-gray-400 mb-1">WhatsApp</p>
        <p class="text-2xl font-bold text-brand-600">{{ whatsappBots }}</p>
      </div>
    </div>

    <!-- Main content -->
    <BotDetail />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBotsStore } from '@/stores/bots.store';
import { TypeBot } from '@/types/bot.types';
import BotDetail from '../components/BotDetail.vue';

const botsStore    = useBotsStore();
const activeBots   = computed(() => botsStore.list.filter(b => b.active).length);
const whatsappBots = computed(() => botsStore.list.filter(b => b.typeBot === TypeBot.WHATSAPP).length);
</script>
