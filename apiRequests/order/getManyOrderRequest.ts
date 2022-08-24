import axios from "axios";
import qs from "qs";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
  RequestWithPagination,
} from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { Order } from "./order";

export const GetManyOrderQueryKey = "GetManyOrderKey";

type Sort = "ASC" | "DESC";
interface OrderSortBy {
  dateCreated?: Sort;
  dateUpdated?: Sort;
  totalPrice?: Sort;
  datePurchased?: Sort;
  status?: Sort;
  gender?: Sort;
}

interface GetManyOrderParam extends RequestWithPagination, RequestWithAuth {
  ownerIds?: string[];
  fullName?: string;
  onlyAnonymous?: boolean;
  status?: string;
  sortBy?: OrderSortBy;
}

const getManyOrderRequest: ApiRequestHandler<
  GetManyOrderParam,
  JsonCollection<Order>
> = ({ accessToken, ...data }) =>
  axios.get(SHOESMARK_API_DOMAIN + "/order", {
    params: {
      ...data,
    },
    paramsSerializer: (param) => qs.stringify(param),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default getManyOrderRequest;
