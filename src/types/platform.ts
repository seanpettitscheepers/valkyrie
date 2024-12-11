export type PlatformType = 'social_media' | 'video' | 'search_display' | 'ecommerce' | 'audio';

export interface PlatformIntegrationType {
  id: string;
  platform_name: string;
  platform_type: PlatformType;
  is_active: boolean;
  credentials: Record<string, any>;
  metadata: Record<string, any>;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}