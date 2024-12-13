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
      analytics_integrations: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          platform_type: Database["public"]["Enums"]["analytics_platform_type"]
          property_id: string
          updated_at: string
          user_id: string | null
          view_id: string | null
        }
        Insert: {
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform_type: Database["public"]["Enums"]["analytics_platform_type"]
          property_id: string
          updated_at?: string
          user_id?: string | null
          view_id?: string | null
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform_type?: Database["public"]["Enums"]["analytics_platform_type"]
          property_id?: string
          updated_at?: string
          user_id?: string | null
          view_id?: string | null
        }
        Relationships: []
      }
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
      brand_connections: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          platform_integration_id: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          platform_integration_id: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          platform_integration_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_connections_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_connections_platform_integration_id_fkey"
            columns: ["platform_integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
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
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      dv360_accounts: {
        Row: {
          access_token: string
          advertiser_id: string
          advertiser_name: string | null
          created_at: string
          error_message: string | null
          id: string
          last_sync_at: string | null
          refresh_token: string
          status: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          advertiser_id: string
          advertiser_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token: string
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          advertiser_id?: string
          advertiser_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token?: string
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dv360_campaigns: {
        Row: {
          account_id: string
          audience_insights: Json | null
          budget_amount: number | null
          budget_type: string | null
          campaign_goal: string | null
          campaign_id: string
          campaign_name: string
          created_at: string
          end_date: string | null
          id: string
          last_sync_at: string | null
          performance_metrics: Json | null
          start_date: string | null
          status: string | null
          targeting_settings: Json | null
          updated_at: string
        }
        Insert: {
          account_id: string
          audience_insights?: Json | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_goal?: string | null
          campaign_id: string
          campaign_name: string
          created_at?: string
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          targeting_settings?: Json | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          audience_insights?: Json | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_goal?: string | null
          campaign_id?: string
          campaign_name?: string
          created_at?: string
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          targeting_settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dv360_campaigns_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "dv360_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      facebook_ad_accounts: {
        Row: {
          access_token: string
          account_id: string
          account_name: string | null
          created_at: string
          error_message: string | null
          id: string
          last_sync_at: string | null
          permissions: Json | null
          refresh_token: string | null
          status: Database["public"]["Enums"]["integration_status"] | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_id: string
          account_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          permissions?: Json | null
          refresh_token?: string | null
          status?: Database["public"]["Enums"]["integration_status"] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_id?: string
          account_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          permissions?: Json | null
          refresh_token?: string | null
          status?: Database["public"]["Enums"]["integration_status"] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      facebook_campaigns: {
        Row: {
          account_id: string | null
          budget_amount: number | null
          budget_type: string | null
          campaign_id: string
          campaign_name: string
          clicks: number | null
          conversions: number | null
          created_at: string
          end_date: string | null
          id: string
          impressions: number | null
          last_sync_at: string | null
          objective: string | null
          spend: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_id: string
          campaign_name: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          last_sync_at?: string | null
          objective?: string | null
          spend?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_id?: string
          campaign_name?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          last_sync_at?: string | null
          objective?: string | null
          spend?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_campaigns_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "facebook_ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_page_insights: {
        Row: {
          created_at: string
          date: string
          id: string
          metrics: Json | null
          page_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          metrics?: Json | null
          page_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metrics?: Json | null
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_page_insights_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "facebook_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_page_posts: {
        Row: {
          created_at: string
          engagement_metrics: Json | null
          id: string
          media_type: string | null
          media_url: string | null
          message: string | null
          page_id: string
          post_id: string
          published_time: string | null
          scheduled_time: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message?: string | null
          page_id: string
          post_id: string
          published_time?: string | null
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message?: string | null
          page_id?: string
          post_id?: string
          published_time?: string | null
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_page_posts_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "facebook_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_pages: {
        Row: {
          access_token: string
          category: string | null
          created_at: string
          followers_count: number | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          page_id: string
          page_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          category?: string | null
          created_at?: string
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          page_id: string
          page_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          category?: string | null
          created_at?: string
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          page_id?: string
          page_name?: string
          updated_at?: string
          user_id?: string
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
      google_ads_accounts: {
        Row: {
          access_token: string
          account_name: string | null
          created_at: string
          customer_id: string
          developer_token: string | null
          error_message: string | null
          id: string
          last_sync_at: string | null
          login_customer_id: string | null
          refresh_token: string
          status: Database["public"]["Enums"]["google_ads_status"] | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_name?: string | null
          created_at?: string
          customer_id: string
          developer_token?: string | null
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          login_customer_id?: string | null
          refresh_token: string
          status?: Database["public"]["Enums"]["google_ads_status"] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_name?: string | null
          created_at?: string
          customer_id?: string
          developer_token?: string | null
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          login_customer_id?: string | null
          refresh_token?: string
          status?: Database["public"]["Enums"]["google_ads_status"] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      google_ads_campaigns: {
        Row: {
          account_id: string
          audience_insights: Json | null
          budget_amount: number | null
          budget_type: string | null
          campaign_id: string
          campaign_name: string
          campaign_type: string
          created_at: string
          end_date: string | null
          id: string
          last_sync_at: string | null
          performance_metrics: Json | null
          start_date: string | null
          status: string | null
          targeting_settings: Json | null
          updated_at: string
        }
        Insert: {
          account_id: string
          audience_insights?: Json | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_id: string
          campaign_name: string
          campaign_type: string
          created_at?: string
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          targeting_settings?: Json | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          audience_insights?: Json | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_id?: string
          campaign_name?: string
          campaign_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          targeting_settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_ads_campaigns_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "google_ads_accounts"
            referencedColumns: ["id"]
          },
        ]
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
          avatar_url: string | null
          business_name: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          phone_number: string | null
          postal_code: string | null
          role: string
          state: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id: string
          phone_number?: string | null
          postal_code?: string | null
          role?: string
          state?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          role?: string
          state?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          ai_recommendations_limit: number | null
          annual_price: number | null
          created_at: string
          description: string | null
          features: Json
          id: string
          name: string
          planning_limit: number | null
          platform_limit: number | null
          price: number | null
          price_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          ai_recommendations_limit?: number | null
          annual_price?: number | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name: string
          planning_limit?: number | null
          platform_limit?: number | null
          price?: number | null
          price_id?: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          ai_recommendations_limit?: number | null
          annual_price?: number | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name?: string
          planning_limit?: number | null
          platform_limit?: number | null
          price?: number | null
          price_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      tiktok_ad_accounts: {
        Row: {
          access_token: string
          advertiser_id: string
          advertiser_name: string | null
          created_at: string
          error_message: string | null
          id: string
          last_sync_at: string | null
          refresh_token: string
          status: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          advertiser_id: string
          advertiser_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token: string
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          advertiser_id?: string
          advertiser_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token?: string
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tiktok_campaigns: {
        Row: {
          account_id: string
          audience_insights: Json | null
          budget_amount: number | null
          budget_type: string | null
          campaign_id: string
          campaign_name: string
          created_at: string
          creative_metrics: Json | null
          end_date: string | null
          id: string
          last_sync_at: string | null
          objective: string | null
          performance_metrics: Json | null
          start_date: string | null
          status: string | null
          targeting_settings: Json | null
          updated_at: string
        }
        Insert: {
          account_id: string
          audience_insights?: Json | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_id: string
          campaign_name: string
          created_at?: string
          creative_metrics?: Json | null
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          objective?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          targeting_settings?: Json | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          audience_insights?: Json | null
          budget_amount?: number | null
          budget_type?: string | null
          campaign_id?: string
          campaign_name?: string
          created_at?: string
          creative_metrics?: Json | null
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          objective?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          targeting_settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_campaigns_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "tiktok_ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      analytics_platform_type: "google_analytics_4" | "universal_analytics"
      campaign_objective: "awareness" | "consideration" | "conversion"
      google_ads_status: "pending" | "active" | "error" | "disconnected"
      industry_type:
        | "e_commerce"
        | "b2b_saas"
        | "finance"
        | "healthcare"
        | "retail"
        | "technology"
        | "other"
      integration_status: "pending" | "active" | "error" | "disconnected"
      platform_type:
        | "social_media"
        | "video"
        | "search_display"
        | "ecommerce"
        | "audio"
      subscription_tier: "free" | "starter" | "growth" | "enterprise"
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
