export interface Database {
  public: {
    Tables: {
      diagrams: {
        Row: {
          id: string
          created_at: string
          user_id: string
          svg_data: string
          metadata: Record<string, any>
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          svg_data: string
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          svg_data?: string
          metadata?: Record<string, any>
        }
      }
    }
  }
} 