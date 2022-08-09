import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithPagination } from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { Shoes } from "./shoes";
import * as qs from "qs";

export const GetAllShoesQueryKey = "GetAllShoes";

interface GetAllShoesParam extends RequestWithPagination{
    ids?: string[]
    shoesName?: string
    categoryIds?: string[]
    colorId?:string
    price?: {
        from: number,
        to?: number
    }
}


const getAllShoesRequest: ApiRequestHandler<GetAllShoesParam, JsonCollection<Shoes>> = (data)=> axios.get(SHOESMARK_API_DOMAIN + "/shoes",{
    params:{
        ...data
    },
    paramsSerializer: params => {
        return qs.stringify(params, {arrayFormat: 'brackets'})
    }
});
export default getAllShoesRequest;