/**
 * Hand-written mirror of the Supabase schema (migrations 0001 + 0002).
 * Regenerate with `supabase gen types typescript` once linked to a live
 * instance and replace this file.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface RoutineStep {
  id: string;
  label: string;
  done?: boolean;
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "done";
          priority: "low" | "medium" | "high";
          due_date: string | null;
          area_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "done";
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          area_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tags: string[];
          area_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string;
          tags?: string[];
          area_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          cadence: "daily" | "weekly";
          target_count: number;
          area_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          cadence?: "daily" | "weekly";
          target_count?: number;
          area_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["habits"]["Insert"]>;
        Relationships: [];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          logged_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          logged_on?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["habit_logs"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          onboarded: boolean;
          timezone: string;
          theme: "system" | "light" | "dark";
          xp: number;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          locale: "ar" | "en";
          daily_goal_level: "light" | "medium" | "ambitious";
          streak_freezes_available: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarded?: boolean;
          timezone?: string;
          theme?: "system" | "light" | "dark";
          xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          locale?: "ar" | "en";
          daily_goal_level?: "light" | "medium" | "ambitious";
          streak_freezes_available?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      life_areas: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["life_areas"]["Insert"]>;
        Relationships: [];
      };
      routines: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          time_of_day: "morning" | "afternoon" | "evening" | "anytime";
          steps: RoutineStep[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          time_of_day?: "morning" | "afternoon" | "evening" | "anytime";
          steps?: RoutineStep[];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["routines"]["Insert"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          starts_at: string;
          ends_at: string | null;
          all_day: boolean;
          location: string | null;
          notes: string | null;
          area_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          starts_at: string;
          ends_at?: string | null;
          all_day?: boolean;
          location?: string | null;
          notes?: string | null;
          area_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          kind: "daily" | "weekly" | "monthly";
          period_start: string;
          went_well: string | null;
          to_improve: string | null;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind?: "daily" | "weekly" | "monthly";
          period_start: string;
          went_well?: string | null;
          to_improve?: string | null;
          rating?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      kb_articles: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          tags: string[];
          area_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string;
          tags?: string[];
          area_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["kb_articles"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          read: boolean;
          kind: "info" | "reminder" | "review" | "system";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          read?: boolean;
          kind?: "info" | "reminder" | "review" | "system";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      xp_events: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          source_type: "task" | "habit" | "routine" | "review" | "note" | "area" | "streak_bonus" | "achievement";
          source_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          reason: string;
          source_type: "task" | "habit" | "routine" | "review" | "note" | "area" | "streak_bonus" | "achievement";
          source_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["xp_events"]["Insert"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          xp_reward: number;
          sort_order: number;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          icon?: string;
          xp_reward?: number;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_achievements"]["Insert"]>;
        Relationships: [];
      };
      dismissed_suggestions: {
        Row: {
          id: string;
          user_id: string;
          suggestion_key: string;
          dismissed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          suggestion_key: string;
          dismissed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["dismissed_suggestions"]["Insert"]>;
        Relationships: [];
      };
      user_journeys: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_journeys"]["Insert"]>;
        Relationships: [];
      };
      daily_intentions: {
        Row: {
          id: string;
          user_id: string;
          intention_date: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          intention_date?: string;
          text: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_intentions"]["Insert"]>;
        Relationships: [];
      };
      support_partners: {
        Row: {
          id: string;
          user_id: string;
          partner_id: string;
          status: "pending" | "accepted" | "declined";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          partner_id: string;
          status?: "pending" | "accepted" | "declined";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_partners"]["Insert"]>;
        Relationships: [];
      };
      // World Memory foundation (Release 2, Objective 4) — schema exists,
      // RLS-protected, but no application code reads or writes this table
      // yet. See supabase/migrations/0007_world_memory_foundation.sql.
      garden_snapshots: {
        Row: {
          id: string;
          user_id: string;
          snapshot_date: string;
          growth_level: number;
          atmosphere: string;
          contributing_factors: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          snapshot_date?: string;
          growth_level: number;
          atmosphere: string;
          contributing_factors?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["garden_snapshots"]["Insert"]>;
        Relationships: [];
      };
    };
    // Supabase's GenericSchema constraint (@supabase/supabase-js v2) requires
    // all five members. Declaring only `Tables` made Database["public"] fail
    // that constraint, which made every .from() query resolve to `never`.
    // These four are type-level only — no runtime output, no behaviour change.
    Views: Record<string, never>;
    Functions: {
      // The one RPC the app actually calls (see components/settings/
      // support-partner.tsx and migration 0006). Returns null when the two
      // users are not an accepted pairing, hence boolean | null.
      partner_active_today: {
        Args: { target_user_id: string };
        Returns: boolean | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience row aliases
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type LifeArea = Database["public"]["Tables"]["life_areas"]["Row"];
export type Routine = Database["public"]["Tables"]["routines"]["Row"];
export type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type KbArticle = Database["public"]["Tables"]["kb_articles"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// --- Gamification convenience aliases ---------------------------------------
export type XpEvent = Database["public"]["Tables"]["xp_events"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"];
export type DismissedSuggestion = Database["public"]["Tables"]["dismissed_suggestions"]["Row"];
export type UserJourney = Database["public"]["Tables"]["user_journeys"]["Row"];
export type DailyIntention = Database["public"]["Tables"]["daily_intentions"]["Row"];
export type SupportPartner = Database["public"]["Tables"]["support_partners"]["Row"];
