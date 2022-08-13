import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Order } from "./order";

interface EditOrderParam extends RequestWithAuth {
    orderId: string;
    status?: string;
    orderEmail?: string;
    postCode?: string;
    note?: string;
    orderFirstName?: string;
    orderLastName?: string;
    orderPhoneNumber?: string;
    orderGender?: string;
    orderCity?: string;
    orderDistrict?: string;
    orderAddress?: string;
    paymentMethod?: string;
    datePurchased?: Date;
    onlinePaymentId?: string;
}

const editOrderRequest: ApiRequestHandler<
  EditOrderParam,
  JsonEntity<Order>
> = ({ accessToken, ...data }) =>
  axios.put(
    SHOESMARK_API_DOMAIN + `/order/${data.orderId}`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export default editOrderRequest;
