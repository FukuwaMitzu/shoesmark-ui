import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithPagination } from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { Shoes } from "./shoes";

interface GetAllShoesParam extends RequestWithPagination{
    shoesName?: string
}


const getAllShoesRequest: ApiRequestHandler<GetAllShoesParam, JsonCollection<Shoes>> = (data)=> axios.get(SHOESMARK_API_DOMAIN + "/shoes",{
    params:{
        ...data
    }
});
export default getAllShoesRequest;