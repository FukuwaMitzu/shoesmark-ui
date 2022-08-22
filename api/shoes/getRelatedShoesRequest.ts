import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithPagination,
} from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { Shoes } from "./shoes";

export const GetRelatedShoesQueryKey = "GetRelatedShoesQuery";

interface GetRelatedShoesParam extends RequestWithPagination {
  shoesId: string;
}

const getRelatedShoesRequest: ApiRequestHandler<
  GetRelatedShoesParam,
  JsonCollection<Shoes>
> = (data) =>
  axios.get(SHOESMARK_API_DOMAIN + "/shoes/related", {
    params: {
      ...data
    },
  });
export default getRelatedShoesRequest;
