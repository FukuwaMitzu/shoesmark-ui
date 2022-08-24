import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Order } from "./order";

export interface CreateMyOrderParam extends RequestWithAuth{
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

const createMyOrderRequest: ApiRequestHandler<CreateMyOrderParam, JsonEntity<Order>> = ({accessToken,...data})=> axios.post(SHOESMARK_API_DOMAIN+"/order/me", {
    ...data
}, {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default createMyOrderRequest;