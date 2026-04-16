import { botHttp } from '@/http/axios';
import { APP_CONFIG } from '@/config/constants';
import type { Bot, BotListItem, HashDto } from '@/types/bot.types';

const { ID_DEVICE, APPLICATION_ID } = APP_CONFIG;

export interface BotUpdatePayload {
  countryCode?: string;
  phone?: string;
  name?: string;
  description?: string;
  image?: string;
  typeBot?: number;
  active?: boolean;
  features?: number[];
  agencyId?: number | null;
}

export const botsService = {
  async getMyBots(userId: number): Promise<BotListItem[]> {
    const { data } = await botHttp.get(
      `/admin/bot/my-bots/${APPLICATION_ID}/${userId}/${ID_DEVICE}`,
    );
    return data.bots ?? [];
  },

  async getBot(id: number, userId: number): Promise<Bot | null> {
    const { data } = await botHttp.get(
      `/admin/bot/${id}/${APPLICATION_ID}/${userId}/${ID_DEVICE}`,
    );
    return data.bot ?? null;
  },

  async updateBot(id: number, userId: number, payload: BotUpdatePayload): Promise<boolean> {
    const { data } = await botHttp.patch(
      `/admin/bot/${id}/${APPLICATION_ID}/${userId}/${ID_DEVICE}`,
      { bot: payload },
    );
    return data.errorCode === 0;
  },

  async updateHash(id: number, userId: number, hash: Partial<HashDto>): Promise<boolean> {
    const { data } = await botHttp.patch(
      `/admin/bot/${id}/hash/${APPLICATION_ID}/${userId}/${ID_DEVICE}`,
      { hash },
    );
    return data.errorCode === 0;
  },

  async getStats(id: number, userId: number): Promise<any> {
    const { data } = await botHttp.get(
      `/admin/bot/${id}/stats/${APPLICATION_ID}/${userId}/${ID_DEVICE}`,
    );
    return data;
  },
};
