<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold text-gray-900">Editor de Hash</h3>
        <p class="text-xs text-gray-400 mt-0.5">Arrastra campos desde la paleta hacia la configuración activa</p>
      </div>
      <div class="flex items-center gap-2">
        <Transition name="slide-fade">
          <span v-if="botsStore.saveSuccess"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-xl">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Guardado
          </span>
        </Transition>
        <button @click="handleSave" :disabled="botsStore.saving"
          class="btn-primary">
          <svg v-if="botsStore.saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Guardar cambios
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- LEFT: Field palette -->
      <div class="card p-5">
        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Campos Disponibles</h4>

        <div v-for="category in categories" :key="category" class="mb-4 last:mb-0">
          <p class="text-xs font-medium text-gray-500 mb-2">{{ category }}</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="field in availableByCategory(category)"
              :key="field.key"
              draggable="true"
              @dragstart="onDragStart($event, field)"
              @dragend="onDragEnd"
              :title="`${field.label} · ${typeLabel(field.type)}`"
              :class="[
                'relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono cursor-grab active:cursor-grabbing',
                'border transition-all duration-150 hover:scale-105 hover:shadow-md select-none group',
                colorClass(field.color, 'chip'),
                dragging?.key === field.key ? 'opacity-40 scale-95' : ''
              ]"
            >
              <span>{{ fieldIcon(field) }}</span>
              {{ field.key }}
              <!-- Tooltip -->
              <span class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                           w-max max-w-[220px] px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-[11px] font-sans font-medium
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                <span class="block font-semibold">{{ field.label }}</span>
                <span class="block text-gray-400">{{ typeLabel(field.type) }}</span>
                <span v-if="field.example" class="block text-gray-500 font-mono mt-0.5">ej: {{ field.example }}</span>
              </span>
            </div>
            <span v-if="availableByCategory(category).length === 0"
              class="text-xs text-gray-300 italic">Todos agregados</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Active config drop zone -->
      <div class="card p-5 flex flex-col min-h-[320px]"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
        :class="isDragOver ? 'ring-2 ring-brand-400 bg-brand-50/30' : ''">

        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Configuración Activa</h4>

        <!-- Drop hint -->
        <Transition name="fade">
          <div v-if="activeFields.length === 0 && !isDragOver"
            class="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p class="text-sm text-gray-400 font-medium">Arrastra campos aquí</p>
            <p class="text-xs text-gray-300 mt-1">Los campos activos del bot aparecerán aquí</p>
          </div>
        </Transition>

        <!-- Drop indicator -->
        <Transition name="fade">
          <div v-if="isDragOver"
            class="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-brand-300 rounded-xl mb-3 bg-brand-50/50">
            <svg class="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-brand-500 text-xs font-semibold">Suelta para agregar</span>
          </div>
        </Transition>

        <!-- Active fields -->
        <div class="space-y-2 flex-1">
          <div
            v-for="(entry, idx) in activeFields"
            :key="entry.key"
            draggable="true"
            @dragstart="onDragStartActive($event, idx)"
            @dragend="onDragEnd"
            :class="[
              'p-3 rounded-xl border transition-all group',
              colorClass(entry.meta.color, 'row'),
              draggingActiveIdx === idx ? 'opacity-40' : ''
            ]"
          >
            <!-- Header row -->
            <div class="flex items-center gap-3">
              <!-- Drag handle -->
              <div class="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>

              <!-- Field chip -->
              <span :class="['px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 font-mono', colorClass(entry.meta.color, 'badge')]">
                {{ entry.key }}
              </span>

              <!-- Inline value (non-complex) -->
              <div v-if="entry.meta.type !== 'complex'" class="flex-1 min-w-0">
                <!-- Boolean toggle -->
                <div v-if="entry.meta.type === 'boolean'" class="flex items-center">
                  <button @click="toggleBool(idx)"
                    :class="[
                      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
                      entry.value ? 'bg-brand-500' : 'bg-gray-200'
                    ]">
                    <span :class="[
                      'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
                      entry.value ? 'translate-x-4' : 'translate-x-1'
                    ]" />
                  </button>
                  <span class="ml-2 text-xs text-gray-500">{{ entry.value ? 'Activado' : 'Desactivado' }}</span>
                </div>

                <!-- Select -->
                <select v-else-if="entry.meta.type === 'select'"
                  v-model="entry.value"
                  class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                         focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors">
                  <option v-for="opt in entry.meta.options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>

                <!-- Number -->
                <input v-else-if="entry.meta.type === 'number'"
                  v-model.number="entry.value"
                  type="number"
                  :placeholder="entry.meta.label"
                  class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                         focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                />

                <!-- String -->
                <input v-else
                  v-model="entry.value"
                  type="text"
                  :placeholder="entry.meta.label"
                  class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                         focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                />
              </div>

              <!-- Spacer for complex -->
              <div v-else class="flex-1" />

              <!-- Remove -->
              <button @click="removeField(idx)"
                class="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300
                       hover:text-red-400 transition-all shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Complex: sub-fields with schema -->
            <div v-if="entry.meta.type === 'complex' && getComplexSchema(entry.key)" class="mt-3 pl-7 space-y-4">

              <!-- Campos simples en grid -->
              <div class="grid grid-cols-2 gap-x-3 gap-y-2">
                <div v-for="sub in getSimpleSubFields(entry.key)" :key="sub.key" class="flex flex-col gap-1">
                  <label class="text-[10px] text-gray-500 font-medium">{{ sub.label }}</label>
                  <input v-if="sub.type === 'number'"
                    :value="getSubValue(entry.value, sub.key)"
                    @input="setSubValue(entry.value, sub.key, Number(($event.target as HTMLInputElement).value))"
                    type="number"
                    class="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                  />
                  <input v-else
                    :value="getSubValue(entry.value, sub.key)"
                    @input="setSubValue(entry.value, sub.key, ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                  />
                </div>
              </div>

              <!-- Campos record (byLanguage) -->
              <div v-for="sub in getRecordSubFields(entry.key)" :key="sub.key"
                class="border border-gray-200 rounded-xl p-3 bg-white/40 space-y-3">

                <!-- Header + agregar idioma -->
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{{ sub.label }}</span>
                  <div class="flex items-center gap-1.5">
                    <input
                      v-model="newLangInputs[`${entry.key}.${sub.key}`]"
                      @keyup.enter="addLanguageEntry(entry.value, sub.key, entry.key)"
                      placeholder="es, en, pt…"
                      class="w-20 px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white
                             focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                    <button @click="addLanguageEntry(entry.value, sub.key, entry.key)"
                      class="px-2.5 py-1 text-xs font-semibold bg-brand-500 text-white rounded-lg
                             hover:bg-brand-600 transition-colors">
                      + Agregar
                    </button>
                  </div>
                </div>

                <!-- Entradas por idioma -->
                <div v-if="getSubValue(entry.value, sub.key) && Object.keys(getSubValue(entry.value, sub.key) ?? {}).length"
                  class="space-y-2">
                  <div v-for="(langVal, langCode) in getSubValue(entry.value, sub.key)" :key="langCode"
                    class="border border-gray-100 rounded-lg p-3 bg-white">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[11px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {{ langCode }}
                      </span>
                      <button @click="removeLanguageEntry(entry.value, sub.key, langCode as string)"
                        class="text-gray-300 hover:text-red-400 transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div class="grid grid-cols-2 gap-x-3 gap-y-2">
                      <div v-for="subSub in sub.subFields" :key="subSub.key" class="flex flex-col gap-1">
                        <label class="text-[10px] text-gray-500 font-medium">{{ subSub.label }}</label>
                        <input v-if="subSub.type === 'number'"
                          :value="getSubValue(langVal, subSub.key)"
                          @input="setSubValue(langVal, subSub.key, Number(($event.target as HTMLInputElement).value))"
                          type="number"
                          class="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                                 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                        <input v-else
                          :value="getSubValue(langVal, subSub.key)"
                          @input="setSubValue(langVal, subSub.key, ($event.target as HTMLInputElement).value)"
                          type="text"
                          class="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                                 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p v-else class="text-[11px] text-gray-300 italic">Sin entradas por idioma</p>
              </div>
            </div>

            <!-- Complex: sin schema → JSON textarea -->
            <textarea v-else-if="entry.meta.type === 'complex'"
              :value="entry.value ? JSON.stringify(entry.value, null, 2) : ''"
              @change="entry.value = tryParseJson(($event.target as HTMLTextAreaElement).value)"
              rows="4"
              placeholder="{}"
              class="mt-3 w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white font-mono
                     focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <Transition name="fade">
      <div v-if="botsStore.error"
        class="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
        <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 text-xs">{{ botsStore.error }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useBotsStore } from '@/stores/bots.store';
import { HASH_FIELDS, HASH_COMPLEX_FIELDS, COMPLEX_SCHEMAS, type HashFieldMeta, type HashDto } from '@/types/bot.types';

const ALL_FIELDS = [...HASH_FIELDS, ...HASH_COMPLEX_FIELDS];

interface ActiveEntry {
  key:   keyof HashDto;
  meta:  HashFieldMeta;
  value: any;
}

const botsStore = useBotsStore();

// State
const activeFields      = ref<ActiveEntry[]>([]);
const dragging          = ref<HashFieldMeta | null>(null);
const draggingActiveIdx = ref<number | null>(null);
const isDragOver        = ref(false);
const newLangInputs     = ref<Record<string, string>>({});

// Categories derived from all fields
const categories = computed(() => [...new Set(ALL_FIELDS.map(f => f.category))]);

// Available = fields NOT in active list
const activeKeys = computed(() => new Set(activeFields.value.map(e => e.key)));
const availableByCategory = (cat: string) =>
  ALL_FIELDS.filter(f => f.category === cat && !activeKeys.value.has(f.key));

// Sync when bot changes
watch(
  () => botsStore.selected?.hash,
  (hash) => {
    if (!hash) { activeFields.value = []; return; }
    activeFields.value = ALL_FIELDS
      .filter(f => hash[f.key] !== undefined && hash[f.key] !== null)
      .map(f => ({ key: f.key, meta: f, value: hash[f.key] }));
  },
  { immediate: true },
);

// Drag from palette → drop zone
function onDragStart(e: DragEvent, field: HashFieldMeta) {
  dragging.value = field;
  draggingActiveIdx.value = null;
  e.dataTransfer?.setData('source', 'palette');
}

// Drag from active list (to reorder or remove)
function onDragStartActive(e: DragEvent, idx: number) {
  draggingActiveIdx.value = idx;
  dragging.value = null;
  e.dataTransfer?.setData('source', 'active');
}

function onDragEnd() {
  dragging.value = null;
  draggingActiveIdx.value = null;
  isDragOver.value = false;
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}

function onDrop(e: DragEvent) {
  isDragOver.value = false;
  const source = e.dataTransfer?.getData('source');

  if (source === 'palette' && dragging.value) {
    const field = dragging.value;
    if (!activeKeys.value.has(field.key)) {
      const currentVal = botsStore.selected?.hash?.[field.key];
      activeFields.value.push({
        key:   field.key,
        meta:  field,
        value: currentVal !== undefined ? currentVal : defaultValue(field),
      });
    }
  }
  dragging.value = null;
  draggingActiveIdx.value = null;
}

function removeField(idx: number) {
  activeFields.value.splice(idx, 1);
}

function toggleBool(idx: number) {
  activeFields.value[idx].value = !activeFields.value[idx].value;
}

const ARRAY_COMPLEX_KEYS: Array<keyof HashDto> = ['phoneSendSummary', 'languageSupport', 'nonWorkingHours', 'optionalData'];

function defaultValue(field: HashFieldMeta): any {
  if (field.type === 'boolean') return false;
  if (field.type === 'number')  return 0;
  if (field.type === 'select')  return field.options?.[0]?.value ?? '';
  if (field.type === 'complex') return ARRAY_COMPLEX_KEYS.includes(field.key) ? [] : {};
  return '';
}

function getComplexSchema(key: keyof HashDto) {
  return COMPLEX_SCHEMAS[key] ?? null;
}

function getSimpleSubFields(key: keyof HashDto) {
  return COMPLEX_SCHEMAS[key]?.filter(s => s.type !== 'record') ?? [];
}

function getRecordSubFields(key: keyof HashDto) {
  return COMPLEX_SCHEMAS[key]?.filter(s => s.type === 'record') ?? [];
}

function addLanguageEntry(entryValue: any, subKey: string, entryKey: string) {
  const inputKey = `${entryKey}.${subKey}`;
  const code = newLangInputs.value[inputKey]?.trim();
  if (!code) return;
  if (!entryValue[subKey]) entryValue[subKey] = {};
  if (!entryValue[subKey][code]) entryValue[subKey][code] = {};
  newLangInputs.value[inputKey] = '';
}

function removeLanguageEntry(entryValue: any, subKey: string, langCode: string) {
  if (entryValue[subKey]) delete entryValue[subKey][langCode];
}

function getSubValue(obj: any, path: string): any {
  if (!obj) return '';
  return path.split('.').reduce((acc, k) => acc?.[k] ?? '', obj);
}

function setSubValue(obj: any, path: string, val: any) {
  if (!obj) return;
  const keys = path.split('.');
  const last = keys.pop()!;
  const target = keys.reduce((acc, k) => {
    if (!acc[k] || typeof acc[k] !== 'object') acc[k] = {};
    return acc[k];
  }, obj);
  target[last] = val;
}

function tryParseJson(raw: string): any {
  try { return JSON.parse(raw); } catch { return {}; }
}

async function handleSave() {
  const hash: Partial<HashDto> = {};
  for (const entry of activeFields.value) {
    (hash as any)[entry.key] = entry.value;
  }
  await botsStore.saveHash(hash);
}

// Color utilities
function colorClass(color: string, variant: 'chip' | 'badge' | 'row') {
  const map: Record<string, Record<string, string>> = {
    indigo: {
      chip:  'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      badge: 'bg-indigo-100 text-indigo-700',
      row:   'bg-indigo-50/50 border-indigo-100',
    },
    violet: {
      chip:  'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100',
      badge: 'bg-violet-100 text-violet-700',
      row:   'bg-violet-50/50 border-violet-100',
    },
    pink: {
      chip:  'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
      badge: 'bg-pink-100 text-pink-700',
      row:   'bg-pink-50/50 border-pink-100',
    },
    amber: {
      chip:  'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
      badge: 'bg-amber-100 text-amber-700',
      row:   'bg-amber-50/50 border-amber-100',
    },
    emerald: {
      chip:  'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700',
      row:   'bg-emerald-50/50 border-emerald-100',
    },
  };
  return map[color]?.[variant] ?? map['indigo'][variant];
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    string:  'Texto',
    number:  'Número',
    boolean: 'Booleano',
    select:  'Selección',
    complex: 'Complejo',
  };
  return map[type] ?? type;
}

function fieldIcon(field: HashFieldMeta) {
  const icons: Record<string, string> = {
    name: '✏️', phone: '📞', currency: '💱', timeZone: '🕐', language: '🌐',
    url: '🔗', urlYCloud: '☁️', accessToken: '🔑', accessTokenYCloud: '🗝️',
    image: '🖼️', imageYCloud: '🌅', updateImage: '🔄', updateImageYCloud: '🔃',
    alias: '🏷️', match: '🎯', travelPin: '📌', isSendTint: '🎨',
    isSendPhone: '📱', newTariff: '💰', changeDirection: '↩️', sendPhoto: '📷',
    typeSizeVehicle: '🚗', typePaymentMethod: '💳', applicationId: '🆔',
  };
  return icons[field.key] ?? '⚙️';
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { transform: translateY(-8px); opacity: 0; }
.slide-fade-leave-to { transform: translateY(4px); opacity: 0; }
</style>
