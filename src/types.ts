export interface WikiArticle {
  title: string;
  content: string;
  category: string;
  links: string[];
  lastModified?: string;
  modifiedBy?: string;
}

export interface WikiData {
  [key: string]: WikiArticle;
}

export interface CategoryData {
  "Основное": WikiArticle[];
  "Разделы": WikiArticle[];
  "Служебное": WikiArticle[];
}

export interface User {
  username: string;
  role: 'admin';
  loginTime: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
