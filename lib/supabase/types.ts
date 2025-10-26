export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          bio: string
          avatar_url: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          display_name: string
          bio?: string
          avatar_url?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          bio?: string
          avatar_url?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      socials: {
        Row: {
          id: string
          profile_id: string
          platform: string
          url: string
          icon: string
          order_index: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          platform: string
          url: string
          icon?: string
          order_index?: number
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          platform?: string
          url?: string
          icon?: string
          order_index?: number
          is_visible?: boolean
          created_at?: string
        }
      }
      links: {
        Row: {
          id: string
          profile_id: string
          title: string
          url: string
          description: string
          thumbnail_url: string
          order_index: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          url: string
          description?: string
          thumbnail_url?: string
          order_index?: number
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          url?: string
          description?: string
          thumbnail_url?: string
          order_index?: number
          is_visible?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          profile_id: string
          name: string
          description: string
          price: number
          currency: string
          image_url: string
          purchase_url: string
          order_index: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          description?: string
          price?: number
          currency?: string
          image_url?: string
          purchase_url: string
          order_index?: number
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          description?: string
          price?: number
          currency?: string
          image_url?: string
          purchase_url?: string
          order_index?: number
          is_visible?: boolean
          created_at?: string
        }
      }
      blogs: {
        Row: {
          id: string
          profile_id: string
          title: string
          content: string
          excerpt: string
          cover_image_url: string
          slug: string
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          content?: string
          excerpt?: string
          cover_image_url?: string
          slug: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          content?: string
          excerpt?: string
          cover_image_url?: string
          slug?: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
