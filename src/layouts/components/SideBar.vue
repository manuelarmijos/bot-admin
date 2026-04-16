<template>
  <aside
    :class="[
      'fixed top-16 left-0 bottom-0 z-40 flex flex-col bg-dark-800 border-r border-white/5',
      isDragging ? '' : 'transition-[width] duration-300 ease-in-out',
      isOpen ? '' : 'overflow-hidden'
    ]"
    :style="{ width: isOpen ? sidebarWidth + 'px' : '0px' }"
  >
    <div class="flex-1 flex flex-col overflow-hidden" :style="{ width: sidebarWidth + 'px' }">
      <!-- Header -->
      <div class="px-4 pt-5 pb-3">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Mis Bots</h2>
          <span class="px-2 py-0.5 bg-brand-500/20 text-brand-300 text-xs font-semibold rounded-full">
            {{ botsStore.list.length }}
          </span>
        </div>

        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="search" type="text" placeholder="Buscar bot…"
            class="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-200
                   placeholder-gray-600 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="botsStore.loading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span class="text-gray-400 text-xs">Cargando bots…</span>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!botsStore.list.length" class="flex-1 flex items-center justify-center px-4">
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-400 text-xs">No hay bots disponibles</p>
        </div>
      </div>

      <!-- Bot list -->
      <div v-else class="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
        <button
          v-for="bot in filteredBots"
          :key="bot.id"
          @click="$emit('select-bot', bot.id)"
          :title="`${bot.name}\n${bot.countryCode ? '+' + bot.countryCode + ' ' : ''}${bot.phone}`"
          :class="[
            'w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-150 group text-left',
            botsStore.selected?.id === bot.id
              ? 'bg-brand-500/20 ring-1 ring-brand-500/40'
              : 'hover:bg-white/5'
          ]"
        >
          <!-- Bot avatar -->
          <div class="relative shrink-0">
            <img v-if="bot.image" :src="bot.image" :alt="bot.name"
              class="w-10 h-10 rounded-full object-cover" />
            <div v-else
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                botGradient(bot.id)
              ]">
              {{ bot.name.charAt(0).toUpperCase() }}
            </div>
            <div :class="[
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-800',
              bot.active ? 'bg-emerald-400' : 'bg-gray-500'
            ]" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span :class="[
                'text-sm font-semibold truncate',
                botsStore.selected?.id === bot.id ? 'text-brand-300' : 'text-gray-200'
              ]">{{ bot.name }}</span>
              <span :class="[
                'shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none',
                bot.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
              ]">{{ bot.active ? 'Activo' : 'Inactivo' }}</span>
            </div>
            <p class="text-xs text-gray-500 truncate mt-0.5">{{ bot.phone }}</p>
          </div>

          <!-- Arrow -->
          <svg :class="[
            'w-4 h-4 shrink-0 transition-colors',
            botsStore.selected?.id === bot.id ? 'text-brand-400' : 'text-gray-600 group-hover:text-gray-400'
          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Refresh -->
      <div class="px-4 py-3 border-t border-white/5">
        <button @click="$emit('refresh')"
          class="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-gray-400
                 hover:text-gray-200 hover:bg-white/5 transition-all text-xs font-medium">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar lista
        </button>
      </div>
    </div>

    <!-- Drag handle -->
    <div v-if="isOpen"
      class="absolute top-0 right-0 bottom-0 w-2 z-50 cursor-col-resize group/drag flex items-center justify-center hover:bg-brand-500/10 transition-colors"
      @mousedown.prevent="startDrag">
      <div class="w-px h-10 rounded-full bg-white/10 group-hover/drag:bg-brand-400/60 transition-colors" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useBotsStore } from '@/stores/bots.store';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
  'select-bot': [id: number];
  'refresh': [];
  'width-change': [w: number];
  'drag-start': [];
  'drag-end': [];
}>();

const botsStore    = useBotsStore();
const search       = ref('');
const sidebarWidth = ref(288);
const isDragging   = ref(false);
const MIN_W = 220, MAX_W = 520;

function startDrag(e: MouseEvent) {
  isDragging.value = true;
  emit('drag-start');
  const startX = e.clientX;
  const startW = sidebarWidth.value;

  function onMove(ev: MouseEvent) {
    sidebarWidth.value = Math.min(MAX_W, Math.max(MIN_W, startW + ev.clientX - startX));
    emit('width-change', sidebarWidth.value);
  }
  function onUp() {
    isDragging.value = false;
    emit('drag-end');
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

const filteredBots = computed(() => {
  if (!search.value) return botsStore.list;
  const q = search.value.toLowerCase();
  return botsStore.list.filter(b =>
    b.name.toLowerCase().includes(q) || b.phone.includes(q),
  );
});

const gradients = [
  'bg-gradient-to-br from-brand-500 to-violet-600',
  'bg-gradient-to-br from-pink-500 to-rose-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-sky-500 to-blue-600',
];
function botGradient(id: number) { return gradients[id % gradients.length]; }

</script>
