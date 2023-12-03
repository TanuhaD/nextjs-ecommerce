export type ProductType = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  isFitchered?: boolean;
  category?: string;
};
