export enum TypeBot {
  TELEGRAM  = 1000,
  WHATSAPP  = 1001,
  ZENDESK   = 2000,
}

export enum TypeLanguageBot {
  SPANISH    = 'es',
  ENGLISH    = 'en',
  PORTUGUESE = 'pt',
  CHINESE    = 'zh',
  ARABIC     = 'ar',
}

export enum TypePaymentMethod {
  CASH   = 1,
  WALLET = 2,
}

export enum TypeSizeVehicle {
  UNDEFINED = 0,
  ALL       = 1,
  BIKE      = 100,
  TAXI      = 200,
  LIGHT     = 300,
  MEDIUM    = 400,
  BIG       = 500,
}

export interface NonWorkingHours {
  from?: string;
  to?: string;
  day?: number;
  date?: string;
  isHoliday?: boolean;
}

export interface Download {
  message: string;
  url: string;
  footer: string;
  textUrl: string;
  byLanguage?: Record<string, { message: string; url: string; footer: string; textUrl: string }>;
}

export interface Direction {
  message?: string;
  id?: string;
  idDestination?: string;
  idMeta?: string;
  idMetaDestination?: string;
  byLanguage?: Record<string, { message?: string; id?: string; idDestination?: string; idMeta?: string; idMetaDestination?: string }>;
}

export interface Reservation {
  message?: string;
  days?: number;
  id?: string;
  idMeta?: string;
  template?: { name: string; language: string };
  byLanguage?: Record<string, { message?: string; id?: string; idMeta?: string }>;
}

export interface EstablishmentDto {
  id: number;
  lt: number;
  lg: number;
  userId: number;
  city?: string;
}

export interface HashDto {
  nonWorkingHours?: NonWorkingHours[];
  travelPin?: boolean;
  isSendTint?: boolean;
  isSendPhone?: boolean;
  url?: string;
  urlYCloud?: string;
  accessToken?: string;
  accessTokenYCloud?: string;
  image?: string;
  imageYCloud?: string;
  updateImage?: string;
  updateImageYCloud?: string;
  download?: Download;
  typePaymentMethod?: TypePaymentMethod;
  establishment?: EstablishmentDto;
  applicationId?: number;
  alias?: boolean;
  match?: boolean;
  instructions?: { placeSearch?: string };
  optionalData?: { key: string; value: string }[];
  phoneSendSummary?: string[];
  phone?: string;
  currency?: string;
  timeZone?: number;
  typeSizeVehicle?: TypeSizeVehicle;
  direction?: Direction;
  reservation?: Reservation;
  name?: string;
  language?: TypeLanguageBot;
  languageSupport?: TypeLanguageBot[];
  board?: Record<string, { message?: string }>;
  newTariff?: boolean;
  changeDirection?: boolean;
  sendPhoto?: boolean;
}

export interface Bot {
  id: number;
  applicationId: number;
  countryId?: number;
  countryCode?: string;
  phone: string;
  name: string;
  description: string;
  image: string;
  typeBot: TypeBot;
  hash: HashDto;
  active: boolean;
  features?: number[];
  agencyId?: number;
  ttl?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BotListItem {
  id: number;
  name: string;
  phone: string;
  image: string;
  active: boolean;
  typeBot: TypeBot;
  description: string;
  countryCode?: string;
  ttl?: number;
}

// Hash field metadata for the editor
export type HashFieldType = 'string' | 'number' | 'boolean' | 'select' | 'complex';

export interface HashFieldMeta {
  key: keyof HashDto;
  label: string;
  type: HashFieldType;
  category: string;
  options?: { value: string | number; label: string }[];
  color: string;
  example?: string;
}

export const HASH_FIELDS: HashFieldMeta[] = [
  // Identidad
  { key: 'name',     label: 'Nombre del bot',  type: 'string', category: 'Identidad', color: 'indigo', example: 'Mi Bot Clipp' },
  { key: 'phone',    label: 'Teléfono',        type: 'string', category: 'Identidad', color: 'indigo', example: '+573001234567' },
  { key: 'currency', label: 'Moneda',          type: 'string', category: 'Identidad', color: 'indigo', example: 'COP' },
  { key: 'timeZone', label: 'Zona Horaria',    type: 'number', category: 'Identidad', color: 'indigo', example: '-5' },
  { key: 'language', label: 'Idioma',          type: 'select', category: 'Identidad', color: 'indigo', example: 'es',
    options: [
      { value: 'es', label: 'Español' },
      { value: 'en', label: 'English' },
      { value: 'pt', label: 'Português' },
      { value: 'zh', label: '中文' },
      { value: 'ar', label: 'العربية' },
    ]
  },
  // URLs & Tokens
  { key: 'url',               label: 'URL principal',  type: 'string', category: 'URLs & Tokens', color: 'violet', example: 'https://api.miservicio.com' },
  { key: 'urlYCloud',         label: 'URL YCloud',     type: 'string', category: 'URLs & Tokens', color: 'violet', example: 'https://ycloud.com/api/v2' },
  { key: 'accessToken',       label: 'Access Token',   type: 'string', category: 'URLs & Tokens', color: 'violet', example: 'eyJhbGciOiJIUzI1NiJ9...' },
  { key: 'accessTokenYCloud', label: 'Token YCloud',   type: 'string', category: 'URLs & Tokens', color: 'violet', example: 'yk_live_abc123xyz' },
  // Imágenes
  { key: 'image',             label: 'Imagen principal',         type: 'string', category: 'Imágenes', color: 'pink', example: 'https://cdn.ejemplo.com/bot.png' },
  { key: 'imageYCloud',       label: 'Imagen YCloud',            type: 'string', category: 'Imágenes', color: 'pink', example: 'https://cdn.ycloud.com/img.jpg' },
  { key: 'updateImage',       label: 'Imagen de actualización',  type: 'string', category: 'Imágenes', color: 'pink', example: 'https://cdn.ejemplo.com/update.png' },
  { key: 'updateImageYCloud', label: 'Imagen actualiz. YCloud',  type: 'string', category: 'Imágenes', color: 'pink', example: 'https://cdn.ycloud.com/update.jpg' },
  // Configuración
  { key: 'alias',           label: 'Alias de usuario',     type: 'boolean', category: 'Configuración', color: 'amber',  example: 'true' },
  { key: 'match',           label: 'Matching activo',      type: 'boolean', category: 'Configuración', color: 'amber',  example: 'true' },
  { key: 'travelPin',       label: 'PIN de viaje',         type: 'boolean', category: 'Configuración', color: 'amber',  example: 'true' },
  { key: 'isSendTint',      label: 'Enviar datos del tint',type: 'boolean', category: 'Configuración', color: 'amber',  example: 'false' },
  { key: 'isSendPhone',     label: 'Enviar teléfono',      type: 'boolean', category: 'Configuración', color: 'amber',  example: 'true' },
  { key: 'newTariff',       label: 'Nueva tarifa activa',  type: 'boolean', category: 'Configuración', color: 'amber',  example: 'false' },
  { key: 'changeDirection', label: 'Cambiar dirección',    type: 'boolean', category: 'Configuración', color: 'amber',  example: 'true' },
  { key: 'sendPhoto',       label: 'Enviar foto en viaje', type: 'boolean', category: 'Configuración', color: 'amber',  example: 'true' },
  // Vehículo & Pago
  { key: 'typeSizeVehicle', label: 'Tipo de vehículo', type: 'select', category: 'Vehículo & Pago', color: 'emerald', example: '200 (Taxi)',
    options: [
      { value: 0,   label: 'Indefinido' },
      { value: 1,   label: 'Todos' },
      { value: 100, label: 'Bicicleta' },
      { value: 200, label: 'Taxi' },
      { value: 300, label: 'Liviano' },
      { value: 400, label: 'Mediano' },
      { value: 500, label: 'Grande' },
    ]
  },
  { key: 'typePaymentMethod', label: 'Método de pago', type: 'select', category: 'Vehículo & Pago', color: 'emerald', example: '1 (Efectivo)',
    options: [
      { value: 1, label: 'Efectivo' },
      { value: 2, label: 'Billetera' },
    ]
  },
  { key: 'applicationId', label: 'ID de aplicación', type: 'number', category: 'Vehículo & Pago', color: 'emerald', example: '5479896' },
];

export interface ComplexSubField {
  key: string;   // soporta dot notation: 'template.name'
  label: string;
  type: 'string' | 'number' | 'boolean' | 'record';
  default?: any;
  subFields?: Array<Omit<ComplexSubField, 'subFields'>>;
}

export const COMPLEX_SCHEMAS: Partial<Record<keyof HashDto, ComplexSubField[]>> = {
  reservation: [
    { key: 'message',           label: 'Mensaje',           type: 'string' },
    { key: 'days',              label: 'Días',              type: 'number', default: 3 },
    { key: 'id',                label: 'ID YCloud',         type: 'string' },
    { key: 'idMeta',            label: 'ID Meta',           type: 'string' },
    { key: 'template.name',     label: 'Template · Nombre', type: 'string' },
    { key: 'template.language', label: 'Template · Idioma', type: 'string' },
    { key: 'byLanguage', label: 'Por idioma', type: 'record', subFields: [
      { key: 'message',           label: 'Mensaje',           type: 'string' },
      { key: 'id',                label: 'ID YCloud',         type: 'string' },
      { key: 'idMeta',            label: 'ID Meta',           type: 'string' },
      { key: 'template.name',     label: 'Template · Nombre', type: 'string' },
      { key: 'template.language', label: 'Template · Idioma', type: 'string' },
    ]},
  ],
  direction: [
    { key: 'message',           label: 'Mensaje',           type: 'string' },
    { key: 'id',                label: 'ID YCloud',         type: 'string' },
    { key: 'idDestination',     label: 'ID YCloud Destino', type: 'string' },
    { key: 'idMeta',            label: 'ID Meta',           type: 'string' },
    { key: 'idMetaDestination', label: 'ID Meta Destino',   type: 'string' },
    { key: 'byLanguage', label: 'Por idioma', type: 'record', subFields: [
      { key: 'message',           label: 'Mensaje',           type: 'string' },
      { key: 'id',                label: 'ID YCloud',         type: 'string' },
      { key: 'idDestination',     label: 'ID YCloud Destino', type: 'string' },
      { key: 'idMeta',            label: 'ID Meta',           type: 'string' },
      { key: 'idMetaDestination', label: 'ID Meta Destino',   type: 'string' },
    ]},
  ],
  download: [
    { key: 'message', label: 'Mensaje',   type: 'string' },
    { key: 'url',     label: 'URL',       type: 'string' },
    { key: 'footer',  label: 'Footer',    type: 'string' },
    { key: 'textUrl', label: 'Texto URL', type: 'string' },
    { key: 'byLanguage', label: 'Por idioma', type: 'record', subFields: [
      { key: 'message', label: 'Mensaje',   type: 'string' },
      { key: 'url',     label: 'URL',       type: 'string' },
      { key: 'footer',  label: 'Footer',    type: 'string' },
      { key: 'textUrl', label: 'Texto URL', type: 'string' },
    ]},
  ],
  establishment: [
    { key: 'id',     label: 'ID',       type: 'number' },
    { key: 'lt',     label: 'Latitud',  type: 'number' },
    { key: 'lg',     label: 'Longitud', type: 'number' },
    { key: 'userId', label: 'User ID',  type: 'number' },
    { key: 'city',   label: 'Ciudad',   type: 'string' },
  ],
  instructions: [
    { key: 'placeSearch', label: 'Búsqueda de lugar', type: 'string' },
  ],
};

export const HASH_COMPLEX_FIELDS: HashFieldMeta[] = [
  { key: 'nonWorkingHours',  label: 'Horario No Laboral', type: 'complex', category: 'Complejos', color: 'slate', example: '[{ "day": 0, "from": "00:00:00", "to": "23:59:59" }]' },
  { key: 'download',         label: 'Descarga de app',    type: 'complex', category: 'Complejos', color: 'slate', example: '{ "message": "Descarga aquí", "url": "https://..." }' },
  { key: 'direction',        label: 'Dirección',          type: 'complex', category: 'Complejos', color: 'slate', example: '{ "message": "Indica tu dirección", "id": "msg_id" }' },
  { key: 'reservation',      label: 'Reserva',            type: 'complex', category: 'Complejos', color: 'slate', example: '{ "days": 3, "message": "Tu reserva está confirmada" }' },
  { key: 'establishment',    label: 'Establecimiento',    type: 'complex', category: 'Complejos', color: 'slate', example: '{ "id": 1, "lt": 4.6097, "lg": -74.0817, "userId": 10 }' },
  { key: 'instructions',     label: 'Instrucciones',      type: 'complex', category: 'Complejos', color: 'slate', example: '{ "placeSearch": "Ingresa la dirección de recogida" }' },
  { key: 'phoneSendSummary', label: 'Teléfonos resumen',  type: 'complex', category: 'Complejos', color: 'slate', example: '["+573001234567", "+573009876543"]' },
  { key: 'languageSupport',  label: 'Idiomas de soporte', type: 'complex', category: 'Complejos', color: 'slate', example: '["es", "en"]' },
  { key: 'optionalData',     label: 'Datos opcionales',   type: 'complex', category: 'Complejos', color: 'slate', example: '[{ "key": "region", "value": "norte" }]' },
  { key: 'board',            label: 'Tablero de mensajes',type: 'complex', category: 'Complejos', color: 'slate', example: '{ "bienvenida": { "message": "Hola, ¿en qué te ayudo?" } }' },
];
