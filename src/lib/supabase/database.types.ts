/**
 * Hand-maintained mirror of supabase/migrations/0001_init.sql.
 * Regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          blurb: string
          step: RegimenStepEnum
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          blurb: string
          step: RegimenStepEnum
          sort_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          summary: string
          description: string
          actives: string[]
          category_id: string
          step: RegimenStepEnum
          price_centavos: number
          compare_at_centavos: number | null
          size_label: string
          how_to_use: string[]
          skin_concerns: string[]
          is_fda_registered: boolean
          is_best_seller: boolean
          in_stock: boolean
          rating_average: number
          rating_count: number
          image_tone: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          summary: string
          description: string
          actives?: string[]
          category_id: string
          step: RegimenStepEnum
          price_centavos: number
          compare_at_centavos?: number | null
          size_label: string
          how_to_use?: string[]
          skin_concerns?: string[]
          is_fda_registered?: boolean
          is_best_seller?: boolean
          in_stock?: boolean
          rating_average?: number
          rating_count?: number
          image_tone?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          is_distributor: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          phone?: string | null
          is_distributor?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          reference: string
          status: OrderStatusEnum
          subtotal_centavos: number
          shipping_centavos: number
          total_centavos: number
          payment_method: PaymentMethodEnum
          ship_to: Json
          placed_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          reference: string
          status?: OrderStatusEnum
          subtotal_centavos: number
          shipping_centavos: number
          total_centavos: number
          payment_method: PaymentMethodEnum
          ship_to: Json
          placed_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          name: string
          size_label: string
          unit_price_centavos: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          name: string
          size_label: string
          unit_price_centavos: number
          quantity: number
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      distributor_applications: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string
          address: string
          city: string
          province: string
          selling_experience: string
          message: string
          status: ApplicationStatusEnum
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone: string
          address: string
          city: string
          province: string
          selling_experience: string
          message?: string
          status?: ApplicationStatusEnum
          submitted_at?: string
        }
        Update: Partial<Database['public']['Tables']['distributor_applications']['Insert']>
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          topic: string
          message: string
          submitted_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          topic: string
          message: string
          submitted_at?: string
        }
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: {
      regimen_step: RegimenStepEnum
      order_status: OrderStatusEnum
      payment_method: PaymentMethodEnum
      application_status: ApplicationStatusEnum
    }
    CompositeTypes: Record<never, never>
  }
}

export type RegimenStepEnum = 'cleanse' | 'tone' | 'treat' | 'protect'
export type OrderStatusEnum = 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethodEnum = 'cod' | 'gcash' | 'bank-transfer'
export type ApplicationStatusEnum = 'received' | 'reviewing' | 'approved' | 'declined'

export type ProductRow = Database['public']['Tables']['products']['Row']
export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type OrderRow = Database['public']['Tables']['orders']['Row']
export type OrderItemRow = Database['public']['Tables']['order_items']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
