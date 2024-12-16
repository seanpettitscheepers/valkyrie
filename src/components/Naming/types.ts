export interface NameComponent {
  id: string;
  name: string;
  type: string;
  options: string[];
}

export interface FormData {
  strategyName: string;
  brand: string;
  platform: string;  // Changed from channel to platform
  objective: string;
  placement: string;
}

export interface GeneratedNames {
  campaign: string;
  adset: string;
  ad: string;
  utm: string;
}