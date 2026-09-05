export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          blurb: string
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
          step: Database["public"]["Enums"]["regimen_step"]
        }
        Insert: {
          blurb?: string
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          step: Database["public"]["Enums"]["regimen_step"]
        }
        Update: {
          blurb?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          step?: Database["public"]["Enums"]["regimen_step"]
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          email: string
          id: string
          message: string
          name: string
          submitted_at: string
          topic: string
        }
        Insert: {
          email: string
          id?: string
          message: string
          name: string
          submitted_at?: string
          topic: string
        }
        Update: {
          email?: string
          id?: string
          message?: string
          name?: string
          submitted_at?: string
          topic?: string
        }
        Relationships: []
      }
      distributor_applications: {
        Row: {
          address: string
          city: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string
          province: string
          selling_experience: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          city: string
          email: string
          full_name: string
          id?: string
          message?: string
          phone: string
          province: string
          selling_experience: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string
          province?: string
          selling_experience?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributor_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          size_label: string
          unit_price_centavos: number
        }
        Insert: {
          id?: string
          name: string
          order_id: string
          product_id?: string | null
          quantity: number
          size_label?: string
          unit_price_centavos: number
        }
        Update: {
          id?: string
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          size_label?: string
          unit_price_centavos?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          placed_at: string
          reference: string
          ship_to: Json
          shipping_centavos: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal_centavos: number
          total_centavos: number
          user_id: string | null
        }
        Insert: {
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          placed_at?: string
          reference: string
          ship_to: Json
          shipping_centavos: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_centavos: number
          total_centavos: number
          user_id?: string | null
        }
        Update: {
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          placed_at?: string
          reference?: string
          ship_to?: Json
          shipping_centavos?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_centavos?: number
          total_centavos?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          actives: string[]
          category_id: string
          compare_at_centavos: number | null
          created_at: string
          description: string
          featured_order: number | null
          how_to_use: string[]
          id: string
          image_tone: string
          images: string[]
          in_stock: boolean
          is_best_seller: boolean
          is_fda_registered: boolean
          is_featured: boolean
          name: string
          price_centavos: number
          rating_average: number
          rating_count: number
          size_label: string
          skin_concerns: string[]
          slug: string
          step: Database["public"]["Enums"]["regimen_step"]
          summary: string
        }
        Insert: {
          actives?: string[]
          category_id: string
          compare_at_centavos?: number | null
          created_at?: string
          description?: string
          featured_order?: number | null
          how_to_use?: string[]
          id?: string
          image_tone?: string
          images?: string[]
          in_stock?: boolean
          is_best_seller?: boolean
          is_fda_registered?: boolean
          is_featured?: boolean
          name: string
          price_centavos: number
          rating_average?: number
          rating_count?: number
          size_label?: string
          skin_concerns?: string[]
          slug: string
          step: Database["public"]["Enums"]["regimen_step"]
          summary?: string
        }
        Update: {
          actives?: string[]
          category_id?: string
          compare_at_centavos?: number | null
          created_at?: string
          description?: string
          featured_order?: number | null
          how_to_use?: string[]
          id?: string
          image_tone?: string
          images?: string[]
          in_stock?: boolean
          is_best_seller?: boolean
          is_fda_registered?: boolean
          is_featured?: boolean
          name?: string
          price_centavos?: number
          rating_average?: number
          rating_count?: number
          size_label?: string
          skin_concerns?: string[]
          slug?: string
          step?: Database["public"]["Enums"]["regimen_step"]
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_distributor: boolean
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id: string
          is_distributor?: boolean
          phone?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_distributor?: boolean
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_order_by_reference: { Args: { p_reference: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      order_to_json: { Args: { p_order_id: string }; Returns: Json }
      place_order: {
        Args: {
          p_items: Json
          p_payment_method: Database["public"]["Enums"]["payment_method"]
          p_ship_to: Json
        }
        Returns: Json
      }
      shipping_for: { Args: { p_subtotal_centavos: number }; Returns: number }
    }
    Enums: {
      application_status: "received" | "reviewing" | "approved" | "declined"
      order_status:
        | "pending"
        | "paid"
        | "packed"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "cod" | "gcash" | "bank-transfer"
      regimen_step: "cleanse" | "tone" | "treat" | "protect"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["received", "reviewing", "approved", "declined"],
      order_status: [
        "pending",
        "paid",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["cod", "gcash", "bank-transfer"],
      regimen_step: ["cleanse", "tone", "treat", "protect"],
    },
  },
} as const

export type RegimenStepEnum = 'cleanse' | 'tone' | 'treat' | 'protect'
export type OrderStatusEnum = 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethodEnum = 'cod' | 'gcash' | 'bank-transfer'
export type ApplicationStatusEnum = 'received' | 'reviewing' | 'approved' | 'declined'

export type ProductRow = Database['public']['Tables']['products']['Row']
export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type OrderRow = Database['public']['Tables']['orders']['Row']
export type OrderItemRow = Database['public']['Tables']['order_items']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
