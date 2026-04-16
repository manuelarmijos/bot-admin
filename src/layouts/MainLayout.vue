<template>
  <div class="min-h-screen bg-gray-50">
    <TopNav @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <SideBar
      :is-open="sidebarOpen"
      @select-bot="handleSelectBot"
      @refresh="botsStore.fetchBots()"
      @width-change="sidebarWidth = $event"
      @drag-start="isDragging = true"
      @drag-end="isDragging = false"
    />

    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div v-if="sidebarOpen && isMobile"
        class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
        @click="sidebarOpen = false" />
    </Transition>

    <!-- Main content -->
    <main
      class="pt-16 min-h-screen"
      :style="{
        marginLeft: sidebarOpen && !isMobile ? sidebarWidth + 'px' : '0px',
        transition: isDragging ? 'none' : 'margin-left 300ms ease'
      }"
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import TopNav from './components/TopNav.vue';
import SideBar from './components/SideBar.vue';
import { useBotsStore } from '@/stores/bots.store';

const botsStore    = useBotsStore();
const sidebarOpen  = ref(true);
const isMobile     = ref(window.innerWidth < 1024);
const sidebarWidth = ref(288);
const isDragging   = ref(false);

function handleSelectBot(id: number) {
  botsStore.selectBot(id);
  if (isMobile.value) sidebarOpen.value = false;
}

function onResize() {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) sidebarOpen.value = true;
}

onMounted(() => {
  botsStore.fetchBots();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => window.removeEventListener('resize', onResize));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
