export interface NameComponent {
  id: string;
  name: string;
  type: string;
  options: string[];
}

export interface FormData {
  strategyName: string;
  brand: string;  // Changed from advertiser to brand
  channel: string;
  objective: string;
  placement: string;
}

export interface GeneratedNames {
  campaign: string;
  adset: string;
  ad: string;
  utm: string;
}