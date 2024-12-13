export interface IUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  posts?: IPost[];
  created_at: string;
  updated_at: string;
}

export interface IPost {
  id: number;
  user_id: number;
  name: string;
  status: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: IUser;
}
