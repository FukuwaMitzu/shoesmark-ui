import { Shoes } from "../shoes/shoes";
import { ImportOrder } from "./importOrder";

export interface ImportOrderDetail{
  importOrderId: string;
  shoesId: string;
  importOrder: Partial<ImportOrder>;
  shoes: Shoes;
  quantity: number;
}