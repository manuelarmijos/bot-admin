import { defineStore } from 'pinia';
import { ref } from 'vue';
import { botsService } from '@/modules/bots/services/bots.service';
import type { BotUpdatePayload } from '@/modules/bots/services/bots.service';
import { useAuthStore } from './auth.store';
import type { Bot, BotListItem, HashDto } from '@/types/bot.types';

export const useBotsStore = defineStore('bots', () => {
  const list          = ref<BotListItem[]>([]);
  const selected      = ref<Bot | null>(null);
  const loading       = ref(false);
  const loadingBot    = ref(false);
  const saving        = ref(false);
  const savingBot     = ref(false);
  const error         = ref<string | null>(null);
  const saveSuccess   = ref(false);
  const saveBotSuccess = ref(false);
  const stats         = ref<any | null>(null);
  const loadingStats  = ref(false);

  function _userId() {
    return useAuthStore().user?.id ?? 0;
  }

  async function fetchBots() {
    loading.value = true;
    error.value   = null;
    try {
      list.value = await botsService.getMyBots(_userId());
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Error al cargar bots';
    } finally {
      loading.value = false;
    }
  }

  async function selectBot(id: number) {
    if (selected.value?.id === id) return;
    loadingBot.value  = true;
    error.value       = null;
    saveSuccess.value = false;
    stats.value       = null;
    try {
      selected.value = await botsService.getBot(id, _userId());
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Error al cargar bot';
    } finally {
      loadingBot.value = false;
    }
  }

  async function fetchStats() {
    if (!selected.value) return;
    loadingStats.value = true;
    try {
      stats.value = await botsService.getStats(selected.value.id, _userId());
    } catch (e: any) {
      stats.value = null;
    } finally {
      loadingStats.value = false;
    }
  }

  async function saveHash(hash: Partial<HashDto>) {
    if (!selected.value) return;
    saving.value     = true;
    saveSuccess.value = false;
    error.value      = null;
    try {
      const ok = await botsService.updateHash(selected.value.id, _userId(), hash);
      if (ok) {
        // Re-fetch to get the authoritative hash from the server
        const fresh = await botsService.getBot(selected.value.id, _userId());
        if (fresh) selected.value = fresh;
        saveSuccess.value = true;
        setTimeout(() => (saveSuccess.value = false), 3000);
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Error al guardar';
    } finally {
      saving.value = false;
    }
  }

  async function saveBot(payload: BotUpdatePayload) {
    if (!selected.value) return;
    savingBot.value     = true;
    saveBotSuccess.value = false;
    error.value         = null;
    try {
      const ok = await botsService.updateBot(selected.value.id, _userId(), payload);
      if (ok) {
        const fresh = await botsService.getBot(selected.value.id, _userId());
        if (fresh) selected.value = fresh;
        saveBotSuccess.value = true;
        setTimeout(() => (saveBotSuccess.value = false), 3000);
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Error al guardar';
    } finally {
      savingBot.value = false;
    }
  }

  function clearSelected() {
    selected.value = null;
  }

  return {
    list, selected, loading, loadingBot, saving, savingBot, error, saveSuccess, saveBotSuccess,
    stats, loadingStats,
    fetchBots, selectBot, saveHash, saveBot, fetchStats, clearSelected,
  };
});
