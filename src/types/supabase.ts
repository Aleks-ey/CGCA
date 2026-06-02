/**
 * Supabase types for the CGCA schema.
 * Regenerate after schema changes: npm run db:generate (requires running local Supabase)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone_number: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          phone_number?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone_number?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: number;
          title: string;
          description: string;
          date: string;
          time: string;
          image_url: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string;
          date: string;
          time?: string;
          image_url?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          image_url?: string;
        };
        Relationships: [];
      };
      sponsors: {
        Row: {
          id: number;
          sponsor: string;
          description: string;
          location: string | null;
          phone: string;
          website: string | null;
          image_url: string | null;
          file_name: string | null;
          custom_file_name: string | null;
          logo_url: string | null;
          logo_file_name: string | null;
          custom_logo_file_name: string | null;
        };
        Insert: {
          id?: number;
          sponsor: string;
          description?: string;
          location?: string | null;
          phone?: string;
          website?: string | null;
          image_url?: string | null;
          file_name?: string | null;
          custom_file_name?: string | null;
          logo_url?: string | null;
          logo_file_name?: string | null;
          custom_logo_file_name?: string | null;
        };
        Update: {
          id?: number;
          sponsor?: string;
          description?: string;
          location?: string | null;
          phone?: string;
          website?: string | null;
          image_url?: string | null;
          file_name?: string | null;
          custom_file_name?: string | null;
          logo_url?: string | null;
          logo_file_name?: string | null;
          custom_logo_file_name?: string | null;
        };
        Relationships: [];
      };
      gallery: {
        Row: {
          id: number;
          image_url: string;
          file_name: string;
          custom_file_name: string;
          event: string;
        };
        Insert: {
          id?: number;
          image_url: string;
          file_name?: string;
          custom_file_name?: string;
          event?: string;
        };
        Update: {
          id?: number;
          image_url?: string;
          file_name?: string;
          custom_file_name?: string;
          event?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
