import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { ImportOrder } from "./importOrder";

export interface EditImportOrderParam extends RequestWithAuth {
  importOrderId: string;
  note?: string;
}

const editImportOrderRequest: ApiRequestHandler<
  EditImportOrderParam,
  JsonEntity<ImportOrder>
> = ({ accessToken, importOrderId, ...data }) =>
  axios.put(
    SHOESMARK_API_DOMAIN + "/importOrder/" + importOrderId,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export default editImportOrderRequest;
