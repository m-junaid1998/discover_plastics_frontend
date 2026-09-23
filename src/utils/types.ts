export interface Category {
  _id: string;
  categoryname: string;
  subCategories?: string[];
}

export interface Product {
  _id: string;
  name: string;
  categoryname: Category | string;
  subCategory?: string;
  stock: number;
  regularPrice: number;
  salePrice: number;
  discount?: string;
  description: string;
  images: string[];
  isPublished?: boolean;
  isNewArrival?: boolean;
}

export interface MediaItem {
  _id: string;
  title: string;
  key: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
}

export interface CategoryItem {
  _id: string;
  categoryname: string;
  subCategories: string[];
}

export interface SubCategory {
  _id?: string;
  subCategoryName?: string;
  name?: string;
}
export interface CategoryItems {
  _id: string;
  categoryname: string;
  subCategories: (string | SubCategory)[];
}
