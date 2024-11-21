export type ProductType = {
  _id?: string;
  title: string;
  slug?: string;
  price: number;
  category: string;
  description?: string[] | null;
  images?: string[];
  brand: string;
  thumb?: string;
  quantity: number;
  sold: number;
  view?: number;
  color: string;
  totalRatings?: number;
  rating?: [];
  varriants?: [];
};

export type ProductCartType = {
  _id: string;
  title: string;
  thumb: string;
  price: number;
};
