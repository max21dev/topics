import React from 'react';

import { TopicPost } from '@/shared/types';

export type PostListItemProps = {
  itemIndex: number;
  post?: TopicPost;
  posts: TopicPost[];
  scrollToPost: (postId: string) => void;
  setDeletedPosts: React.Dispatch<React.SetStateAction<string[]>>;
};

export type PostContentCategory = 'text' | 'image' | 'url';

export type CategorizedPostContent = {
  category: PostContentCategory;
  content: string;
};
