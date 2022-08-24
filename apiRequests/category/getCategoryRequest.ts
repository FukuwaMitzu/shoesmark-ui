import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Category } from "./category";



const getCategoryRequest: ApiRequestHandler<string, JsonEntity<Category>> = (id) => axios.get(SHOESMARK_API_DOMAIN + `/category/${id}`);
export default getCategoryRequest;