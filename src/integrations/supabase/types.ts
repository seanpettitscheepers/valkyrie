export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audience_insights: {
        Row: {
          campaign_id: string
          created_at: string
          demographics: Json
          engagement_metrics: Json
          id: string
          interests: Json
          platform: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          demographics?: Json
          engagement_metrics?: Json
          id?: string
          interests?: Json
          platform: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          demographics?: Json
          engagement_metrics?: Json
          id?: string
          interests?: Json
          platform?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_insights_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_sentiment: {
        Row: {
          analysis_timestamp: string | null
          campaign_id: string | null
          created_at: string | null
          id: string
          key_mentions: Json | null
          platform: string
          risk_factors: Json | null
          risk_level: string
          sentiment_score: number
          updated_at: string | null
          volume: number
        }
        Insert: {
          analysis_timestamp?: string | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          key_mentions?: Json | null
          platform: string
          risk_factors?: Json | null
          risk_level: string
          sentiment_score: number
          updated_at?: string | null
          volume: number
        }
        Update: {
          analysis_timestamp?: string | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          key_mentions?: Json | null
          platform?: string
          risk_factors?: Json | null
          risk_level?: string
          sentiment_score?: number
          updated_at?: string | null
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "brand_sentiment_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_metrics: {
        Row: {
          campaign_id: string
          clicks: number
          conversions: number
          created_at: string
          date: string
          engagements: number
          id: string
          impressions: number
          spend: number
          video_views: number
        }
        Insert: {
          campaign_id: string
          clicks?: number
          conversions?: number
          created_at?: string
          date: string
          engagements?: number
          id?: string
          impressions?: number
          spend?: number
          video_views?: number
        }
        Update: {
          campaign_id?: string
          clicks?: number
          conversions?: number
          created_at?: string
          date?: string
          engagements?: number
          id?: string
          impressions?: number
          spend?: number
          video_views?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_name_components: {
        Row: {
          created_at: string
          id: string
          name: string
          options: Json
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          options?: Json
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          options?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_plans: {
        Row: {
          audience_insights_id: string | null
          budget_allocation: Json
          created_at: string
          id: string
          name: string
          notes: string | null
          objective: Database["public"]["Enums"]["campaign_objective"]
          platforms: Json
          previous_campaign_id: string | null
          status: string
          targeting_objectives: Json
          total_budget: number
          updated_at: string
        }
        Insert: {
          audience_insights_id?: string | null
          budget_allocation?: Json
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          objective: Database["public"]["Enums"]["campaign_objective"]
          platforms?: Json
          previous_campaign_id?: string | null
          status?: string
          targeting_objectives?: Json
          total_budget?: number
          updated_at?: string
        }
        Update: {
          audience_insights_id?: string | null
          budget_allocation?: Json
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          objective?: Database["public"]["Enums"]["campaign_objective"]
          platforms?: Json
          previous_campaign_id?: string | null
          status?: string
          targeting_objectives?: Json
          total_budget?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_plans_audience_insights_id_fkey"
            columns: ["audience_insights_id"]
            isOneToOne: false
            referencedRelation: "audience_insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_plans_previous_campaign_id_fkey"
            columns: ["previous_campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_kpis: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          id: string
          is_active: boolean | null
          metric_name: string
          target_value: number
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metric_name: string
          target_value: number
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metric_name?: string
          target_value?: number
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_names: {
        Row: {
          ad_name: string
          adset_name: string
          advertiser: string
          campaign_name: string
          channel: string
          created_at: string
          id: string
          objective: string
          placement: string
          strategy_name: string
          utm_tag: string
        }
        Insert: {
          ad_name: string
          adset_name: string
          advertiser: string
          campaign_name: string
          channel: string
          created_at?: string
          id?: string
          objective: string
          placement: string
          strategy_name: string
          utm_tag: string
        }
        Update: {
          ad_name?: string
          adset_name?: string
          advertiser?: string
          campaign_name?: string
          channel?: string
          created_at?: string
          id?: string
          objective?: string
          placement?: string
          strategy_name?: string
          utm_tag?: string
        }
        Relationships: []
      }
      industry_benchmarks: {
        Row: {
          baseline_value: number
          created_at: string
          description: string | null
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          metric_name: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          baseline_value: number
          created_at?: string
          description?: string | null
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          metric_name: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          baseline_value?: number
          created_at?: string
          description?: string | null
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          metric_name?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      naming_components: {
        Row: {
          created_at: string
          id: string
          name: string
          options: Json | null
          pattern_id: string
          position: number
          required: boolean | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          options?: Json | null
          pattern_id: string
          position: number
          required?: boolean | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          options?: Json | null
          pattern_id?: string
          position?: number
          required?: boolean | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "naming_components_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "naming_patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      naming_patterns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          pattern: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pattern: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pattern?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_integrations: {
        Row: {
          created_at: string
          credentials: Json | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          metadata: Json | null
          platform_name: string
          platform_type: Database["public"]["Enums"]["platform_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          platform_name: string
          platform_type: Database["public"]["Enums"]["platform_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          platform_name?: string
          platform_type?: Database["public"]["Enums"]["platform_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_name: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          phone_number: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id: string
          phone_number?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      campaign_objective: "awareness" | "consideration" | "conversion"
      industry_type:
        | "e_commerce"
        | "b2b_saas"
        | "finance"
        | "healthcare"
        | "retail"
        | "technology"
        | "other"
      platform_type:
        | "social_media"
        | "video"
        | "search_display"
        | "ecommerce"
        | "audio"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
