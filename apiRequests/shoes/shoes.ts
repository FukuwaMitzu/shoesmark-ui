import { Brand } from "../brand/brand";
import {Category} from "../category/category";
import {Color} from "../color/color";

export interface Shoes{
  shoesId: string;
  shoesName: string;
  description: string;
  shoesImage: string;
  UPC: string;
  SKU: string;
  categories: Category[];
  brand?: Brand;
  color?: Color;
  size: number;
  price: number;
  importPrice: number;
  sale: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}