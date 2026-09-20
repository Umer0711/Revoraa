export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  xp: number;
  coins: number;
  streak: number;
  created_at: string;
}

export interface Problem {
  id: string;
  user_id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  pattern?: string;
  platform: string;
  url?: string;
  notes?: string;
  created_at: string;
}
