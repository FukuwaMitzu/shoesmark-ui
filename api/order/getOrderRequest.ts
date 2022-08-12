import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Order } from "./order";

export const GetOrderQueryKey = "GetOrder";
interface GetOrderParam extends RequestWithAuth{
    orderId: string
}

const getOrderRequest: ApiRequestHandler<GetOrderParam, JsonEntity<Order>> = ({accessToken, orderId: id}) => axios.get(SHOESMARK_API_DOMAIN + `/order/${id}`,{
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});
export default getOrderRequest;