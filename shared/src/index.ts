// Unified NoteHub TypeScript Type Definitions

export interface User {
  id: string | number;
  google_id?: string | null;
  name: string;
  email: string;
  picture?: string | null;
  password_hash?: string;
  semester?: string;
  department?: string;
  verifiedNotes?: number; // camelCase frontend
  verified_notes?: number; // snake_case backend
  points?: number;
  rank?: number;
  uploads?: number;
  badges?: string[];
  collaborations?: number;
  role?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  last_seen?: string | Date;
  is_verified?: boolean;
}

export interface Note {
  id: number;
  title: string;
  uploader_name: string;
  uploader_id: number;
  subject: string;
  semester: string;
  file_type: string;
  file_size: string;
  downloads: number;
  rating: string | number;
  likes: number;
  file_url: string;
  verified?: boolean;
  verification_status?: 'pending' | 'verified' | 'rejected' | string;
  verification_details?: any;
  upload_date?: string;
  file_name?: string;
  thumbnail_url?: string;
  file_hash?: string;
  course?: string;
  year?: string;
  plagiarism_score?: number;
  plagiarism_details?: any;
  ai_verification_score?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface LeaderboardUser {
  id?: number;
  user_id: number;
  name: string;
  badges: string[];
  verified_notes: number;
  uploads: number;
  points: number;
  is_online?: boolean; // dynamic presence status
  rank: number;
  department?: string;
  collaborations?: number;
  updated_at?: string | Date;
}

export interface DepartmentScore {
  department: string;
  total_points: string | number;
  total_users: string | number;
  average_points: number;
}

export interface DepartmentWar {
  winningDepartment: string | null;
  scores: DepartmentScore[];
}

export interface Message {
  id: number;
  user_id: number;
  user_name: string;
  message: string;
  group_name: string;
  created_at: string | Date;
}

export interface StudyGroup {
  id: number;
  name: string;
  description?: string;
  subject: string;
  creator_id: number;
  creator_name?: string;
  member_count?: string | number;
  online_count?: string | number;
  is_member?: boolean;
  theme_color?: string;
  avatar_emoji?: string;
  created_at?: string | Date;
}

export interface StudyGroupMember {
  id: number;
  group_id: number;
  user_id: number;
  joined_at?: string | Date;
}

export interface HelpRequest {
  id: number;
  user_id: number;
  user_name: string;
  subject: string;
  message: string;
  status?: 'open' | 'closed' | string;
  created_at?: string | Date;
}

export interface Broadcast {
  id: number;
  user_id: number;
  user_name: string;
  message: string;
  created_at?: string | Date;
}

export interface AIChatMessage {
  id?: number;
  text?: string; // local UI
  content?: string; // backend DB
  isUser: boolean;
  role?: 'user' | 'ai' | string;
  bot_type?: string;
  created_at?: string | Date;
}
