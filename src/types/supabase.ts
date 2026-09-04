export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      business: {
        Row: {
          approved: boolean | null;
          company_name: string | null;
          created_at: string;
          description: string | null;
          email: string | null;
          id: number;
          image_url: string | null;
          location: string | null;
          owner: string | null;
          phone_number: string | null;
          profile_id: string | null;
          type: string | null;
        };
        Insert: {
          approved?: boolean | null;
          company_name?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          owner?: string | null;
          phone_number?: string | null;
          profile_id?: string | null;
          type?: string | null;
        };
        Update: {
          approved?: boolean | null;
          company_name?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          owner?: string | null;
          phone_number?: string | null;
          profile_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_business_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      business_edits: {
        Row: {
          approved: boolean | null;
          company_name: string | null;
          created_at: string;
          description: string | null;
          email: string | null;
          id: number;
          image_url: string | null;
          location: string | null;
          owner: string | null;
          phone_number: string | null;
          profile_id: string | null;
          type: string | null;
        };
        Insert: {
          approved?: boolean | null;
          company_name?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          owner?: string | null;
          phone_number?: string | null;
          profile_id?: string | null;
          type?: string | null;
        };
        Update: {
          approved?: boolean | null;
          company_name?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          owner?: string | null;
          phone_number?: string | null;
          profile_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_business_edits_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          cta_url: string | null;
          date: string | null;
          description: string | null;
          end_time: string | null;
          id: number;
          image_url: string | null;
          location: string | null;
          start_time: string | null;
          title: string | null;
          volunteer_enabled: boolean;
          volunteer_info: string;
        };
        Insert: {
          created_at?: string;
          cta_url?: string | null;
          date?: string | null;
          description?: string | null;
          end_time?: string | null;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          start_time?: string | null;
          title?: string | null;
          volunteer_enabled?: boolean;
          volunteer_info?: string;
        };
        Update: {
          created_at?: string;
          cta_url?: string | null;
          date?: string | null;
          description?: string | null;
          end_time?: string | null;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          start_time?: string | null;
          title?: string | null;
          volunteer_enabled?: boolean;
          volunteer_info?: string;
        };
        Relationships: [];
      };
      for_hire: {
        Row: {
          about: string | null;
          approved: boolean | null;
          created_at: string;
          email: string | null;
          id: number;
          location: string | null;
          name: string | null;
          phone_number: string | null;
          profession: string | null;
          profile_id: string | null;
          work_outside: boolean | null;
        };
        Insert: {
          about?: string | null;
          approved?: boolean | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          location?: string | null;
          name?: string | null;
          phone_number?: string | null;
          profession?: string | null;
          profile_id?: string | null;
          work_outside?: boolean | null;
        };
        Update: {
          about?: string | null;
          approved?: boolean | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          location?: string | null;
          name?: string | null;
          phone_number?: string | null;
          profession?: string | null;
          profile_id?: string | null;
          work_outside?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_for_hire_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      for_hire_edits: {
        Row: {
          about: string | null;
          approved: boolean | null;
          created_at: string;
          email: string | null;
          id: number;
          location: string | null;
          name: string | null;
          phone_number: string | null;
          profession: string | null;
          profile_id: string | null;
          work_outside: boolean | null;
        };
        Insert: {
          about?: string | null;
          approved?: boolean | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          location?: string | null;
          name?: string | null;
          phone_number?: string | null;
          profession?: string | null;
          profile_id?: string | null;
          work_outside?: boolean | null;
        };
        Update: {
          about?: string | null;
          approved?: boolean | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          location?: string | null;
          name?: string | null;
          phone_number?: string | null;
          profession?: string | null;
          profile_id?: string | null;
          work_outside?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_for_hire_edits_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery: {
        Row: {
          album: string | null;
          created_at: string;
          custom_file_name: string | null;
          file_name: string | null;
          id: number;
          image_url: string | null;
        };
        Insert: {
          album?: string | null;
          created_at?: string;
          custom_file_name?: string | null;
          file_name?: string | null;
          id?: number;
          image_url?: string | null;
        };
        Update: {
          album?: string | null;
          created_at?: string;
          custom_file_name?: string | null;
          file_name?: string | null;
          id?: number;
          image_url?: string | null;
        };
        Relationships: [];
      };
      gallery_state: {
        Row: {
          id: number;
          updated_at: string;
          version: number;
        };
        Insert: {
          id?: number;
          updated_at?: string;
          version?: number;
        };
        Update: {
          id?: number;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      job_board: {
        Row: {
          approved: boolean | null;
          company_name: string;
          created_at: string;
          email: string;
          id: number;
          job_description: string | null;
          job_title: string;
          location: string | null;
          pay: string | null;
          phone_number: string;
          profile_id: string | null;
        };
        Insert: {
          approved?: boolean | null;
          company_name: string;
          created_at?: string;
          email: string;
          id?: number;
          job_description?: string | null;
          job_title: string;
          location?: string | null;
          pay?: string | null;
          phone_number: string;
          profile_id?: string | null;
        };
        Update: {
          approved?: boolean | null;
          company_name?: string;
          created_at?: string;
          email?: string;
          id?: number;
          job_description?: string | null;
          job_title?: string;
          location?: string | null;
          pay?: string | null;
          phone_number?: string;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_job_board_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      job_board_edits: {
        Row: {
          approved: boolean | null;
          company_name: string;
          created_at: string;
          email: string;
          id: number;
          job_description: string | null;
          job_title: string;
          location: string | null;
          pay: string | null;
          phone_number: string;
          profile_id: string | null;
        };
        Insert: {
          approved?: boolean | null;
          company_name: string;
          created_at?: string;
          email: string;
          id?: number;
          job_description?: string | null;
          job_title: string;
          location?: string | null;
          pay?: string | null;
          phone_number: string;
          profile_id?: string | null;
        };
        Update: {
          approved?: boolean | null;
          company_name?: string;
          created_at?: string;
          email?: string;
          id?: number;
          job_description?: string | null;
          job_title?: string;
          location?: string | null;
          pay?: string | null;
          phone_number?: string;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_job_board_edits_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      profile: {
        Row: {
          created_at: string;
          delete_acc_request: boolean | null;
          email: string;
          id: string;
          name: string;
          phone_number: string;
        };
        Insert: {
          created_at?: string;
          delete_acc_request?: boolean | null;
          email: string;
          id: string;
          name?: string;
          phone_number?: string;
        };
        Update: {
          created_at?: string;
          delete_acc_request?: boolean | null;
          email?: string;
          id?: string;
          name?: string;
          phone_number?: string;
        };
        Relationships: [];
      };
      sponsors: {
        Row: {
          created_at: string;
          custom_file_name: string | null;
          custom_logo_file_name: string | null;
          description: string | null;
          file_name: string | null;
          hidden: boolean;
          id: number;
          image_url: string | null;
          location: string | null;
          logo_file_name: string | null;
          logo_url: string | null;
          phone: string | null;
          sponsor: string | null;
          website: string | null;
        };
        Insert: {
          created_at?: string;
          custom_file_name?: string | null;
          custom_logo_file_name?: string | null;
          description?: string | null;
          file_name?: string | null;
          hidden?: boolean;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          logo_file_name?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          sponsor?: string | null;
          website?: string | null;
        };
        Update: {
          created_at?: string;
          custom_file_name?: string | null;
          custom_logo_file_name?: string | null;
          description?: string | null;
          file_name?: string | null;
          hidden?: boolean;
          id?: number;
          image_url?: string | null;
          location?: string | null;
          logo_file_name?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          sponsor?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      volunteer_org_roles: {
        Row: {
          created_at: string;
          event_id: number;
          id: number;
          label: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          event_id: number;
          id?: never;
          label: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          event_id?: number;
          id?: never;
          label?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "volunteer_org_roles_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteer_roles: {
        Row: {
          created_at: string;
          event_id: number;
          id: number;
          label: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          event_id: number;
          id?: never;
          label: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          event_id?: number;
          id?: never;
          label?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "volunteer_roles_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteer_signup_tags: {
        Row: {
          created_at: string;
          event_id: number;
          id: number;
          tag_id: number;
          volunteer_signup_id: number;
        };
        Insert: {
          created_at?: string;
          event_id: number;
          id?: never;
          tag_id: number;
          volunteer_signup_id: number;
        };
        Update: {
          created_at?: string;
          event_id?: number;
          id?: never;
          tag_id?: number;
          volunteer_signup_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "volunteer_signup_tags_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "volunteer_signup_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "volunteer_tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "volunteer_signup_tags_volunteer_signup_id_fkey";
            columns: ["volunteer_signup_id"];
            isOneToOne: false;
            referencedRelation: "volunteer_signups";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteer_signups: {
        Row: {
          assigned_org_role_id: number | null;
          created_at: string;
          email: string;
          event_id: number;
          id: number;
          name: string;
          notes: string;
          phone: string;
          preferred_role_id: number | null;
        };
        Insert: {
          assigned_org_role_id?: number | null;
          created_at?: string;
          email: string;
          event_id: number;
          id?: never;
          name: string;
          notes?: string;
          phone?: string;
          preferred_role_id?: number | null;
        };
        Update: {
          assigned_org_role_id?: number | null;
          created_at?: string;
          email?: string;
          event_id?: number;
          id?: never;
          name?: string;
          notes?: string;
          phone?: string;
          preferred_role_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "volunteer_signups_assigned_org_role_id_fkey";
            columns: ["assigned_org_role_id"];
            isOneToOne: false;
            referencedRelation: "volunteer_org_roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "volunteer_signups_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "volunteer_signups_preferred_role_id_fkey";
            columns: ["preferred_role_id"];
            isOneToOne: false;
            referencedRelation: "volunteer_roles";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteer_tags: {
        Row: {
          created_at: string;
          event_id: number;
          id: number;
          label: string;
        };
        Insert: {
          created_at?: string;
          event_id: number;
          id?: never;
          label: string;
        };
        Update: {
          created_at?: string;
          event_id?: number;
          id?: never;
          label?: string;
        };
        Relationships: [
          {
            foreignKeyName: "volunteer_tags_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
