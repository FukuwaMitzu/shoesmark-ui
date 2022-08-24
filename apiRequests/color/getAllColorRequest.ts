import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithPagination } from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { Color } from "./color";


export const GetAllColorQueryKey = "GetAllColor";

interface GetAllColorParam extends RequestWithPagination{
    colorName?: string
}

const getAllColorRequest: ApiRequestHandler<GetAllColorParam, JsonCollection<Color>> = (data) => axios.get(SHOESMARK_API_DOMAIN + "/color", {
    params:{
        ...data
    },
});

export default getAllColorRequest;