import { User } from "../user/user";
import { OrderDetail } from "./orderDetail";

export interface Order{
  orderId: string;
  owner?: User;
  status: string;
  totalPrice: number;
  postCode: string;
  note?: string;
  orderFirstName: string;
  orderLastName: string;
  orderPhoneNumber: string;
  orderEmail?: string;
  orderGender: string;
  orderCity: string;
  orderDistrict: string;
  orderAddress: string;
  paymentMethod: string;
  details: OrderDetail[];
  onlinePaymentId?: string;
  datePurchased?: string;
  createdAt: string;
  updatedAt: string;
}