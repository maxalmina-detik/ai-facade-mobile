export interface Comment {
  id: string;
  userName: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  content: string[];
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  author: string;
  readsCount: number;
  breaking?: boolean;
  comments: Comment[];
  likes: number;
}

export interface Reel {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  sourceLabel?: string;
  videoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
