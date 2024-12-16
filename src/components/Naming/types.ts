export interface NameComponent {
  id: string;
  name: string;
  type: string;
  options: string[];
}

export interface FormData {
  strategyName: string;
  brand: string;
  platforms: string[];  // Changed from single platform to array
  objective: string;
  placement: string;
}

export interface GeneratedNames {
  campaign: string;
  adset: string;
  ad: string;
  utm: string;
}

export interface PlatformGeneratedNames {
  [platform: string]: GeneratedNames;
}