import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithPagination } from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { Category } from "./category";

export const GetAllCategoryQueryKey = "GetAllCategory";

interface GetAllCategoryParam extends RequestWithPagination{
    categoryName?: string
}


const getAllCategoryRequest: ApiRequestHandler<GetAllCategoryParam, JsonCollection<Category>> = (data)=> axios.get(SHOESMARK_API_DOMAIN + "/category",{
    params:{
        ...data
    }
});
export default getAllCategoryRequest;