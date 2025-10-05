export type PostCard = {
  _id: string;
  id: string;
  title: string;
  preview: string;
  date: string;
  publishedAt: string;
  intro: string;
  thumbnailUrl?: string;
  tags?: string[];
};

export type Post = {
  _id: string;
  id: string;
  title: string;
  publishedAt: string;
  date: string;
  updatedAt?: string;
  slug?: string;

  canonicalUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: { url?: string };

  thumbnailUrl?: string;
  preview: string;
  heroImage?: {
    asset: {
      url: string;
      metadata: { dimensions: { width: number; height: number } };
    };
    alt?: string;
    caption?: string;
  };

  sections: any[];
  tags?: string[];
};
