import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { OrderDetail } from "./orderDetail";

interface EditOrderDetailParam extends RequestWithAuth {
  orderId: string;
  shoesId: string;
  quantity?: number;
  sale?: number;
  price?: number;
}

const editOrderDetailRequest: ApiRequestHandler<
  EditOrderDetailParam,
  JsonEntity<OrderDetail>
> = ({ accessToken, ...data }) =>
  axios.put(
    SHOESMARK_API_DOMAIN + `/order/${data.orderId}/detail`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export default editOrderDetailRequest;
