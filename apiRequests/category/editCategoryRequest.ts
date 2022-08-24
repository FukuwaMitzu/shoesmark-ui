import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Category } from "./category";

interface EditCategoryParam extends RequestWithAuth{
    categoryId: string
    categoryName?: string
    description?: string
}

const editCategoryRequest: ApiRequestHandler<EditCategoryParam, JsonEntity<Category>> = (data)=> axios.put(SHOESMARK_API_DOMAIN+`/category/${data.categoryId}`, {
    categoryName: data.categoryName,
    description: data.description
}, {
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});

export default editCategoryRequest;