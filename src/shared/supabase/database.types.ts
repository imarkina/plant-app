export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      care_tasks: {
        Row: {
          id: string;
          interval_days: number;
          last_done_at: string | null;
          last_reminder_sent_at: string | null;
          plant_id: string;
          type: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          interval_days: number;
          last_done_at?: string | null;
          last_reminder_sent_at?: string | null;
          plant_id: string;
          type: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          interval_days?: number;
          last_done_at?: string | null;
          last_reminder_sent_at?: string | null;
          plant_id?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'care_tasks_plant_id_fkey';
            columns: ['plant_id'];
            isOneToOne: false;
            referencedRelation: 'plants';
            referencedColumns: ['id'];
          },
        ];
      };
      locations: {
        Row: {
          created_at: string;
          distance_from_window_cm: number | null;
          has_grow_light: boolean;
          id: string;
          light_level: string | null;
          name: string;
          site_id: string | null;
          user_id: string;
          window_direction: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          distance_from_window_cm?: number | null;
          has_grow_light?: boolean;
          id?: string;
          light_level?: string | null;
          name: string;
          site_id?: string | null;
          user_id?: string;
          window_direction?: string | null;
        };
        Update: {
          created_at?: string;
          distance_from_window_cm?: number | null;
          has_grow_light?: boolean;
          id?: string;
          light_level?: string | null;
          name?: string;
          site_id?: string | null;
          user_id?: string;
          window_direction?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'locations_site_id_fkey';
            columns: ['site_id'];
            isOneToOne: false;
            referencedRelation: 'sites';
            referencedColumns: ['id'];
          },
        ];
      };
      photo_comparisons: {
        Row: {
          created_at: string;
          embedding: number[] | null;
          first_photo_id: string;
          id: string;
          last_photo_id: string;
          plant_id: string;
          result: NonNullable<Json>;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          embedding?: number[] | null;
          first_photo_id: string;
          id?: string;
          last_photo_id: string;
          plant_id: string;
          result: NonNullable<Json>;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          embedding?: number[] | null;
          first_photo_id?: string;
          id?: string;
          last_photo_id?: string;
          plant_id?: string;
          result?: NonNullable<Json>;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'photo_comparisons_first_photo_id_fkey';
            columns: ['first_photo_id'];
            isOneToOne: false;
            referencedRelation: 'photos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'photo_comparisons_last_photo_id_fkey';
            columns: ['last_photo_id'];
            isOneToOne: false;
            referencedRelation: 'photos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'photo_comparisons_plant_id_fkey';
            columns: ['plant_id'];
            isOneToOne: false;
            referencedRelation: 'plants';
            referencedColumns: ['id'];
          },
        ];
      };
      photos: {
        Row: {
          analysis: Json | null;
          created_at: string;
          embedding: number[] | null;
          id: string;
          image_url: string | null;
          is_avatar: boolean;
          note: string | null;
          photo_type: string;
          plant_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          analysis?: Json | null;
          created_at?: string;
          embedding?: number[] | null;
          id?: string;
          image_url?: string | null;
          is_avatar?: boolean;
          note?: string | null;
          photo_type?: string;
          plant_id: string;
          user_id?: string;
        };
        Update: {
          analysis?: Json | null;
          created_at?: string;
          embedding?: number[] | null;
          id?: string;
          image_url?: string | null;
          is_avatar?: boolean;
          note?: string | null;
          photo_type?: string;
          plant_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'photos_plant_id_fkey';
            columns: ['plant_id'];
            isOneToOne: false;
            referencedRelation: 'plants';
            referencedColumns: ['id'];
          },
        ];
      };
      plant_care_logs: {
        Row: {
          created_at: string;
          id: string;
          note: string | null;
          performed_at: string;
          plant_id: string;
          type: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          note?: string | null;
          performed_at?: string;
          plant_id: string;
          type: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          note?: string | null;
          performed_at?: string;
          plant_id?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plant_care_logs_plant_id_fkey';
            columns: ['plant_id'];
            isOneToOne: false;
            referencedRelation: 'plants';
            referencedColumns: ['id'];
          },
        ];
      };
      plants: {
        Row: {
          archive_reason_detail: string | null;
          archive_status: string | null;
          archived_at: string | null;
          custom_species_name: string | null;
          has_drainage: boolean | null;
          id: string;
          is_archived: boolean;
          location_id: string | null;
          name: string;
          pot_diameter_cm: number | null;
          pot_type: string | null;
          purchased_at: string | null;
          species_id: string | null;
          substrate_type: string | null;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          archive_reason_detail?: string | null;
          archive_status?: string | null;
          archived_at?: string | null;
          custom_species_name?: string | null;
          has_drainage?: boolean | null;
          id?: string;
          is_archived?: boolean;
          location_id?: string | null;
          name: string;
          pot_diameter_cm?: number | null;
          pot_type?: string | null;
          purchased_at?: string | null;
          species_id?: string | null;
          substrate_type?: string | null;
          user_id?: string;
        };
        Update: {
          archive_reason_detail?: string | null;
          archive_status?: string | null;
          archived_at?: string | null;
          custom_species_name?: string | null;
          has_drainage?: boolean | null;
          id?: string;
          is_archived?: boolean;
          location_id?: string | null;
          name?: string;
          pot_diameter_cm?: number | null;
          pot_type?: string | null;
          purchased_at?: string | null;
          species_id?: string | null;
          substrate_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plants_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plants_species_id_fkey';
            columns: ['species_id'];
            isOneToOne: false;
            referencedRelation: 'species';
            referencedColumns: ['id'];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          created_at: string;
          endpoint: string;
          id: string;
          keys_auth: string;
          keys_p256dh: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          endpoint: string;
          id?: string;
          keys_auth: string;
          keys_p256dh: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          endpoint?: string;
          id?: string;
          keys_auth?: string;
          keys_p256dh?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      sites: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      species: {
        Row: {
          botanical_name: string | null;
          common_name: string;
          created_at: string;
          id: string;
        };
        ComputedFields: never;
        Insert: {
          botanical_name?: string | null;
          common_name: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          botanical_name?: string | null;
          common_name?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          push_enabled: boolean;
          reminder_time: string;
          streak_reminders_enabled: boolean;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          push_enabled?: boolean;
          reminder_time?: string;
          streak_reminders_enabled?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          push_enabled?: boolean;
          reminder_time?: string;
          streak_reminders_enabled?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      wishlist: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          is_purchased: boolean;
          name: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_purchased?: boolean;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_purchased?: boolean;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      dearmor: { Args: { '': string }; Returns: string };
      gen_random_uuid: { Args: Record<PropertyKey, never>; Returns: string };
      gen_salt: { Args: { '': string }; Returns: string };
      pgp_armor_headers: { Args: { '': string }; Returns: Record<string, unknown>[] };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
