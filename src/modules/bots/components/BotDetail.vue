<template>
  <div class="h-full">
    <!-- Loading skeleton -->
    <div v-if="botsStore.loadingBot" class="space-y-6 p-6">
      <div class="h-48 bg-gray-200 rounded-3xl animate-pulse" />
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded-xl animate-pulse w-3/4" />
        <div class="h-4 bg-gray-200 rounded-xl animate-pulse w-1/2" />
      </div>
    </div>

    <!-- Bot detail -->
    <div v-else-if="bot" class="space-y-6">
      <!-- Hero header -->
      <div class="relative rounded-3xl overflow-hidden">
        <div :class="['absolute inset-0', heroBg]" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div class="relative p-6">
          <div class="flex items-end gap-5">
            <div class="relative shrink-0">
              <img v-if="bot.image" :src="bot.image" :alt="bot.name"
                class="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-xl" />
              <div v-else :class="['w-24 h-24 rounded-full flex items-center justify-center ring-4 ring-white/30 shadow-xl text-white font-bold text-3xl', heroBg]">
                {{ bot.name.charAt(0).toUpperCase() }}
              </div>
              <div :class="['absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-xl border-2 border-white flex items-center justify-center text-xs', bot.active ? 'bg-emerald-400' : 'bg-gray-400']">
                {{ bot.active ? '✓' : '✗' }}
              </div>
            </div>
            <div class="flex-1 pb-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h2 class="text-2xl font-bold text-white drop-shadow">{{ bot.name }}</h2>
                <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm', bot.active ? 'bg-emerald-400/30 text-emerald-200 border border-emerald-400/30' : 'bg-gray-400/30 text-gray-200 border border-gray-400/30']">
                  {{ bot.active ? 'Activo' : 'Inactivo' }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                  {{ botTypeLabel(bot.typeBot) }}
                </span>
              </div>
              <p class="text-white/70 text-sm">{{ bot.description }}</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3 mt-5">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p class="text-white/50 text-xs mb-0.5">Teléfono</p>
              <p class="text-white font-semibold text-sm">{{ bot.phone }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p class="text-white/50 text-xs mb-0.5">TTL</p>
              <p class="text-white font-semibold text-sm">{{ bot.ttl ?? 150 }}s</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <p class="text-white/50 text-xs mb-0.5">País</p>
              <p class="text-white font-semibold text-sm">{{ bot.countryCode ?? '—' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card overflow-hidden">
        <div class="flex border-b border-gray-100 bg-gray-50/60">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            :class="['flex items-center gap-2.5 px-7 py-4 text-sm font-semibold transition-all border-b-2 -mb-px',
              activeTab === tab.id ? 'border-brand-500 text-brand-600 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/60']">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" :d="tab.iconPath" />
            </svg>
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab: Configuración -->
        <div v-if="activeTab === 'config'" class="p-5 space-y-5">
          <div class="border border-gray-100 rounded-2xl overflow-hidden">
            <button @click="infoOpen = !infoOpen"
              class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
              <span class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-brand-100 flex items-center justify-center text-brand-600 text-xs">ℹ</span>
                Información del bot
              </span>
              <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200', infoOpen ? 'rotate-180' : '']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Transition name="expand">
              <div v-if="infoOpen" class="px-4 pb-4 space-y-4 border-t border-gray-100">
                <div class="grid grid-cols-2 gap-3 pt-3">
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">App ID</p>
                    <p class="text-sm font-semibold text-gray-700 font-mono">{{ bot.applicationId }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Agencia ID</p>
                    <p class="text-sm font-semibold text-gray-700 font-mono">{{ bot.agencyId ?? '—' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Idioma</p>
                    <p class="text-sm font-semibold text-gray-700">{{ bot.hash?.language ?? '—' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Moneda</p>
                    <p class="text-sm font-semibold text-gray-700">{{ bot.hash?.currency ?? '—' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Zona horaria</p>
                    <p class="text-sm font-semibold text-gray-700">{{ bot.hash?.timeZone != null ? `UTC${bot.hash.timeZone >= 0 ? '+' : ''}${bot.hash.timeZone}` : '—' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Última actualización</p>
                    <p class="text-sm font-semibold text-gray-700">{{ bot.updatedAt ? formatDate(bot.updatedAt) : '—' }}</p>
                  </div>
                </div>
                <div v-if="bot.features?.length">
                  <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Features activas</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="f in bot.features" :key="f"
                      class="px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-600 text-xs font-mono font-semibold rounded-lg">{{ f }}</span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
          <HashEditor />
        </div>

        <!-- Tab: Estadísticas -->
        <div v-else-if="activeTab === 'stats'" class="p-6">
          <!-- Loading -->
          <div v-if="botsStore.loadingStats" class="flex flex-col items-center justify-center py-20 gap-4">
            <div class="relative">
              <div class="w-12 h-12 border-2 border-brand-100 rounded-full" />
              <div class="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <span class="text-gray-400 text-sm font-medium">Cargando estadísticas…</span>
          </div>

          <!-- Sin datos -->
          <div v-else-if="!statsData" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-gray-500 font-medium mb-1">Sin estadísticas</p>
            <p class="text-gray-400 text-sm">Este bot aún no tiene datos disponibles</p>
          </div>

          <!-- Dashboard -->
          <div v-else class="space-y-5">

            <!-- ── KPIs principales ── -->
            <div class="grid grid-cols-3 gap-4">
              <div v-for="kpi in mainKpis" :key="kpi.key"
                class="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm overflow-hidden group cursor-default">
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  :style="{ background: `linear-gradient(135deg, ${kpi.color}08 0%, transparent 60%)` }" />
                <div class="relative">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                      :style="{ background: `${kpi.color}18` }">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        :style="{ stroke: kpi.color }">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="kpi.icon" />
                      </svg>
                    </div>
                    <span class="w-2 h-2 rounded-full" :style="{ background: kpi.color }" />
                  </div>
                  <p class="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1.5">
                    {{ formatNumber(kpi.value) }}
                  </p>
                  <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{{ kpi.label }}</p>
                </div>
              </div>
            </div>

            <!-- ── Períodos de tiempo ── -->
            <div class="grid grid-cols-3 gap-3">
              <div v-for="t in timeCards" :key="t.key"
                class="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 border cursor-default"
                :style="{ background: `${t.color}08`, borderColor: `${t.color}20` }">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  :style="{ background: `${t.color}18` }">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    :style="{ stroke: t.color }">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="t.icon" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-lg font-bold leading-none tracking-tight" :style="{ color: t.color }">
                    {{ formatNumber(t.value) }}
                  </p>
                  <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{{ t.label }}</p>
                </div>
              </div>
            </div>

            <!-- ── Actividad diaria ── -->
            <div v-if="activityChart" class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-800 leading-none">Actividad diaria</h4>
                    <p class="text-[11px] text-gray-400 mt-0.5">Hilos por fecha</p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-gray-300">{{ activityChart.bars.length }} días</span>
              </div>
              <div class="px-6 pb-6 pt-4">
                <svg :viewBox="`0 0 ${activityChart.w} ${activityChart.h}`" class="w-full" style="height:200px">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#6366f1" stop-opacity="1" />
                      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.6" />
                    </linearGradient>
                  </defs>
                  <!-- Y grid lines -->
                  <line v-for="g in activityChart.yGrids" :key="g.y"
                    :x1="activityChart.pad.l" :y1="g.y"
                    :x2="activityChart.w - activityChart.pad.r" :y2="g.y"
                    stroke="#f1f5f9" stroke-width="1" />
                  <!-- Y labels -->
                  <text v-for="g in activityChart.yGrids" :key="'yl'+g.y"
                    :x="activityChart.pad.l - 8" :y="g.y + 4"
                    text-anchor="end" font-size="11" fill="#d1d5db" font-family="system-ui">{{ g.label }}</text>
                  <!-- Bars -->
                  <rect v-for="bar in activityChart.bars" :key="bar.date"
                    :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height"
                    rx="6" fill="url(#barGrad)" />
                  <!-- Value above bars -->
                  <text v-for="bar in activityChart.bars" :key="'v'+bar.date"
                    :x="bar.x + bar.width / 2" :y="bar.y - 8"
                    text-anchor="middle" font-size="13" fill="#374151"
                    font-family="system-ui" font-weight="700">{{ bar.count }}</text>
                  <!-- X date labels -->
                  <text v-for="bar in activityChart.bars" :key="'xl'+bar.date"
                    :x="bar.x + bar.width / 2"
                    :y="activityChart.h - activityChart.pad.b + 18"
                    text-anchor="middle" font-size="11" fill="#9ca3af" font-family="system-ui">{{ bar.label }}</text>
                </svg>
              </div>
            </div>

            <!-- ── byStatus + byContext ── -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

              <!-- Donut byStatus -->
              <div v-if="donutChart" class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div class="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-50">
                  <div class="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-800 leading-none">Por estado</h4>
                    <p class="text-[11px] text-gray-400 mt-0.5">Distribución de hilos</p>
                  </div>
                </div>
                <div class="flex items-center gap-6 p-6">
                  <div class="relative shrink-0">
                    <svg :width="donutChart.size" :height="donutChart.size" class="shrink-0 -rotate-90">
                      <circle :cx="donutChart.cx" :cy="donutChart.cy" :r="donutChart.r"
                        fill="none" stroke="#f3f4f6" :stroke-width="donutChart.sw" />
                      <circle v-for="seg in donutChart.segments" :key="seg.label"
                        :cx="donutChart.cx" :cy="donutChart.cy" :r="donutChart.r"
                        fill="none" :stroke="seg.color" :stroke-width="donutChart.sw"
                        :stroke-dasharray="`${seg.dash} ${donutChart.circ}`"
                        :stroke-dashoffset="seg.offset" stroke-linecap="butt" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                      <span class="text-xl font-bold text-gray-800">{{ formatNumber(donutChart.total) }}</span>
                      <span class="text-[10px] text-gray-400 font-medium tracking-wide uppercase">total</span>
                    </div>
                  </div>
                  <div class="flex-1 space-y-2.5 min-w-0">
                    <div v-for="seg in donutChart.segments" :key="seg.label"
                      class="flex items-center gap-2.5">
                      <div class="w-2 h-2 rounded-full shrink-0" :style="{ background: seg.color }" />
                      <span class="text-xs text-gray-500 truncate flex-1 font-medium">{{ seg.label }}</span>
                      <div class="flex items-center gap-2 shrink-0">
                        <span class="text-sm font-bold text-gray-700">{{ formatNumber(seg.val) }}</span>
                        <span class="text-[10px] text-gray-400 w-8 text-right font-mono">{{ seg.pct }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Barras byContext -->
              <div v-if="barChart" class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div class="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-50">
                  <div class="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-800 leading-none">Por contexto</h4>
                    <p class="text-[11px] text-gray-400 mt-0.5">Tipo de conversación</p>
                  </div>
                </div>
                <div class="p-6 space-y-3.5">
                  <div v-for="item in barChart" :key="item.label">
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: item.color }" />
                        <span class="text-xs text-gray-600 font-semibold truncate">{{ item.label }}</span>
                      </div>
                      <div class="flex items-center gap-2 shrink-0 ml-2">
                        <span class="text-sm font-bold text-gray-700">{{ formatNumber(item.val) }}</span>
                        <span class="text-[10px] font-mono text-gray-400 w-9 text-right">{{ item.pct }}%</span>
                      </div>
                    </div>
                    <div class="h-2 rounded-full overflow-hidden" style="background: #f3f4f6">
                      <div class="h-full rounded-full transition-all duration-700"
                        :style="{ width: item.barPct + '%', background: `linear-gradient(90deg, ${item.color}99, ${item.color})` }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- JSON colapsable -->
            <details class="group">
              <summary class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-500 select-none list-none">
                <svg class="w-3 h-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Ver respuesta completa
              </summary>
              <pre class="mt-3 p-4 bg-gray-950 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-auto max-h-64 leading-relaxed">{{ rawStats }}</pre>
            </details>

          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center px-8">
      <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center mb-5 shadow-inner">
        <svg class="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Selecciona un bot</h3>
      <p class="text-gray-400 text-sm max-w-xs">Elige un bot del menú lateral para ver sus detalles y editar la configuración</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBotsStore } from '@/stores/bots.store';
import { TypeBot } from '@/types/bot.types';
import HashEditor from './HashEditor.vue';

const botsStore = useBotsStore();
const bot       = computed(() => botsStore.selected);
const statsData = computed(() => botsStore.stats?.stats ?? null);
const infoOpen  = ref(false);
const activeTab = ref<'config' | 'stats'>('config');

const tabs = [
  { id: 'config', label: 'Configuración', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'stats',  label: 'Estadísticas',  iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
] as const;

watch(activeTab, (tab: string) => { if (tab === 'stats' && !botsStore.stats) botsStore.fetchStats(); });
watch(() => bot.value?.id, () => { activeTab.value = 'config'; infoOpen.value = false; });

const heroBgs = [
  'bg-gradient-to-br from-brand-600 to-violet-700',
  'bg-gradient-to-br from-pink-600 to-rose-700',
  'bg-gradient-to-br from-amber-600 to-orange-700',
  'bg-gradient-to-br from-emerald-600 to-teal-700',
  'bg-gradient-to-br from-sky-600 to-blue-700',
];
const heroBg = computed(() => bot.value ? heroBgs[bot.value.id % heroBgs.length] : heroBgs[0]);

function botTypeLabel(type: TypeBot) {
  if (type === TypeBot.WHATSAPP) return '💬 WhatsApp';
  if (type === TypeBot.TELEGRAM) return '✈️ Telegram';
  if (type === TypeBot.ZENDESK)  return '🎫 Zendesk';
  return '🤖 Bot';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatNumber(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Sí' : 'No';
  const n = Number(val);
  if (!isNaN(n) && Math.abs(n) >= 1000) return n.toLocaleString('es');
  return String(val);
}
function formatShortDate(s: string): string {
  // Parse YYYY-MM-DD as local time (avoid UTC offset shifting the day)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
}
// ── Main KPIs ────────────────────────────────────────────────────────────────
const mainKpis = computed(() => {
  const s = statsData.value;
  if (!s) return [];
  return [
    {
      key: 'totalThreads',
      label: 'Conversaciones',
      value: s.totalThreads ?? 0,
      color: '#6366f1',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z',
    },
    {
      key: 'uniquePhones',
      label: 'Usuarios únicos',
      value: s.uniquePhones ?? 0,
      color: '#8b5cf6',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      key: 'reservedThreads',
      label: 'En curso',
      value: s.reservedThreads ?? 0,
      color: '#10b981',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
  ];
});

// ── Time period cards ─────────────────────────────────────────────────────────
const timeCards = computed(() => {
  const s = statsData.value;
  if (!s) return [];
  return [
    {
      key: 'todayThreads',
      label: 'Hoy',
      value: s.todayThreads ?? 0,
      color: '#0ea5e9',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    },
    {
      key: 'weekThreads',
      label: 'Esta semana',
      value: s.weekThreads ?? 0,
      color: '#f59e0b',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      key: 'monthThreads',
      label: 'Este mes',
      value: s.monthThreads ?? 0,
      color: '#f43f5e',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
  ];
});

// ── Activity bar chart (dailyActivity) ───────────────────────────────────────
const activityChart = computed(() => {
  const raw = statsData.value?.dailyActivity as Array<{ date: string; count: number }> | undefined;
  if (!Array.isArray(raw) || !raw.length) return null;

  const W = 500, H = 200;
  const pad = { l: 44, r: 16, t: 36, b: 32 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const maxCount = Math.max(...raw.map(d => d.count)) || 1;
  const totalBarFrac = 0.55;
  const barWidth = (cW * totalBarFrac) / raw.length;
  const gapWidth = (cW * (1 - totalBarFrac)) / (raw.length + 1);

  const bars = raw.map((d, i) => {
    const barH = Math.max(4, (d.count / maxCount) * cH);
    const x = pad.l + gapWidth * (i + 1) + barWidth * i;
    const y = pad.t + cH - barH;
    return { date: d.date, count: d.count, label: formatShortDate(d.date), x, y, width: barWidth, height: barH };
  });

  const yGrids = Array.from({ length: 4 }, (_, i) => {
    const v = (maxCount * (i + 1)) / 4;
    const y = pad.t + cH - (v / maxCount) * cH;
    return { y, label: v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v).toString() };
  });

  return { bars, yGrids, pad, w: W, h: H };
});

// ── Donut chart (byStatus) ────────────────────────────────────────────────────
const DONUT_COLORS = ['#6366f1','#10b981','#f59e0b','#f43f5e','#8b5cf6','#0ea5e9','#ec4899','#64748b'];

const donutChart = computed(() => {
  const raw = statsData.value?.byStatus as Array<{ status: number; label: string; count: number }> | undefined;
  if (!Array.isArray(raw) || !raw.length) return null;
  const entries = raw.filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  if (!entries.length) return null;

  const total = entries.reduce((s, item) => s + item.count, 0);
  const r = 54, sw = 22, cx = r + sw / 2 + 4, cy = cx;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segments = entries.map((item, i) => {
    const pct = item.count / total;
    const seg = {
      label: item.label,
      val: item.count,
      pct: Math.round(pct * 100),
      dash: pct * circ,
      offset: -(circ * offset + circ * 0.25),
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    };
    offset += pct;
    return seg;
  });

  return { segments, cx, cy, r, sw, circ, size: (r + sw / 2 + 4) * 2, total };
});

// ── Bar chart (byContext) ─────────────────────────────────────────────────────
const BAR_COLORS = ['#6366f1','#8b5cf6','#0ea5e9','#10b981','#f59e0b','#f43f5e','#ec4899','#64748b'];

const barChart = computed(() => {
  const raw = statsData.value?.byContext as Array<{ context: number; label: string; count: number }> | undefined;
  if (!Array.isArray(raw) || !raw.length) return null;
  const entries = raw.filter(item => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 10);
  if (!entries.length) return null;
  const total = entries.reduce((s, item) => s + item.count, 0) || 1;
  const maxVal = Math.max(...entries.map(item => item.count)) || 1;
  return entries.map((item, i) => ({
    label: item.label,
    val: item.count,
    pct: Math.round((item.count / total) * 100),
    barPct: Math.round((item.count / maxVal) * 100),
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));
});

const rawStats = computed(() => statsData.value ? JSON.stringify(statsData.value, null, 2) : null);
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: opacity 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; }
</style>
