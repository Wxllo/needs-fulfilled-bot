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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appraisals: {
        Row: {
          comments: string | null
          created_at: string
          cycle_id: string
          employee_id: string
          id: string
          reviewer_id: string | null
          score: number | null
          status: Database["public"]["Enums"]["appraisal_status"]
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          cycle_id: string
          employee_id: string
          id?: string
          reviewer_id?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["appraisal_status"]
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          cycle_id?: string
          employee_id?: string
          id?: string
          reviewer_id?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["appraisal_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appraisals_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "performance_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appraisals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appraisals_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          created_at: string
          employee_id: string
          end_date: string | null
          id: string
          salary: number
          start_date: string
          status: Database["public"]["Enums"]["contract_status"]
          type: Database["public"]["Enums"]["contract_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          end_date?: string | null
          id?: string
          salary: number
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"]
          type?: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          end_date?: string | null
          id?: string
          salary?: number
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"]
          type?: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          contact_email: string | null
          created_at: string
          faculty_id: string | null
          id: string
          location: string | null
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          faculty_id?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          faculty_id?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          department_id: string | null
          email: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          hire_date: string
          id: string
          job_id: string | null
          last_name: string
          phone: string | null
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email: string
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          hire_date?: string
          id?: string
          job_id?: string | null
          last_name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          hire_date?: string
          id?: string
          job_id?: string | null
          last_name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      faculties: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculties_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      job_assignments: {
        Row: {
          created_at: string
          department_id: string | null
          employee_id: string
          end_date: string | null
          id: string
          job_id: string
          salary: number | null
          start_date: string
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          job_id: string
          salary?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          job_id?: string
          salary?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          level: Database["public"]["Enums"]["job_level"]
          max_salary: number | null
          min_salary: number | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["job_level"]
          max_salary?: number | null
          min_salary?: number | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["job_level"]
          max_salary?: number | null
          min_salary?: number | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpi_scores: {
        Row: {
          achieved: number
          created_at: string
          cycle_id: string
          employee_id: string
          id: string
          kpi_name: string
          target: number
          updated_at: string
          weight: number
        }
        Insert: {
          achieved?: number
          created_at?: string
          cycle_id: string
          employee_id: string
          id?: string
          kpi_name: string
          target: number
          updated_at?: string
          weight?: number
        }
        Update: {
          achieved?: number
          created_at?: string
          cycle_id?: string
          employee_id?: string
          id?: string
          kpi_name?: string
          target?: number
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_scores_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "performance_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_scores_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_cycles: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["cycle_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["cycle_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["cycle_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          end_date: string
          enrolled: number
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["training_status"]
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          end_date: string
          enrolled?: number
          id?: string
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["training_status"]
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          end_date?: string
          enrolled?: number
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["training_status"]
          updated_at?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_hr_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "hr_manager" | "employee"
      appraisal_status: "pending" | "in-progress" | "completed"
      contract_status: "active" | "expired" | "terminated"
      contract_type: "permanent" | "temporary" | "contract" | "internship"
      cycle_status: "active" | "completed" | "draft"
      employee_status: "active" | "inactive" | "on-leave"
      gender_type: "male" | "female"
      job_level: "entry" | "mid" | "senior" | "lead" | "manager" | "director"
      job_status: "open" | "closed" | "on-hold"
      training_status: "upcoming" | "ongoing" | "completed"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "hr_manager", "employee"],
      appraisal_status: ["pending", "in-progress", "completed"],
      contract_status: ["active", "expired", "terminated"],
      contract_type: ["permanent", "temporary", "contract", "internship"],
      cycle_status: ["active", "completed", "draft"],
      employee_status: ["active", "inactive", "on-leave"],
      gender_type: ["male", "female"],
      job_level: ["entry", "mid", "senior", "lead", "manager", "director"],
      job_status: ["open", "closed", "on-hold"],
      training_status: ["upcoming", "ongoing", "completed"],
    },
  },
} as const
