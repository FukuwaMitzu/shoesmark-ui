import { Shoes } from "../shoes/shoes";
import { Order } from "./order";

export interface OrderDetail{
    orderId: string;
    shoesId: string;
    order: Partial<Order>;
    shoes: Shoes;
    quantity: number;
    price: number;
    sale: number;
}