
export interface DocCategory {
  id: string;
  title: string;
  slug: string;
  order: number;
  description?: string;
}

export interface DocPage {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  published: boolean;
}

export interface DocCategoryWithPages extends DocCategory {
  pages: DocPage[];
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'editor';
}
