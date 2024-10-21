import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
  id: number;
  name: string;
  price: Decimal;
  subProduct: boolean;
  allowColorRefinement: boolean;
  allowMessage: boolean;
  allowAddOnItem: boolean;
  colorRefinement: Decimal | null;
  message: Decimal | null;
  addOnItem: Decimal | null;
  images: {
    id: number;
    url: string;
    altText: string | null;
    productId: number;
  }[];
}

export type ProductList = Product[];
