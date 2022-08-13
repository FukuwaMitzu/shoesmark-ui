import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

interface DeleteOrderDetailParam extends RequestWithAuth {
  orderId: string;
  shoesId: string;
}

const deleteOrderDetailRequest: ApiRequestHandler<
  DeleteOrderDetailParam,
  JsonAction
> = ({ accessToken, ...data }) =>
  axios.delete(SHOESMARK_API_DOMAIN + `/order/${data.orderId}/detail`, {
    data: {
      ...data,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default deleteOrderDetailRequest;
