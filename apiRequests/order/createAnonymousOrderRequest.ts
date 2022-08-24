import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Order } from "./order";

export interface CreateAnonymousOrderParam{
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
  onlinePaymentId?: string;
}

interface ReturnOrderResult extends JsonEntity<Order>{
  orderSessionToken: string
}

const createAnonymousOrderRequest: ApiRequestHandler<CreateAnonymousOrderParam, ReturnOrderResult> = (data)=> axios.post(SHOESMARK_API_DOMAIN+"/order/anonymous", {
    ...data
});

export default createAnonymousOrderRequest;