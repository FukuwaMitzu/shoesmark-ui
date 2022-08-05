import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Color } from "./color";



const getColorRequest: ApiRequestHandler<string, JsonEntity<Color>> = (id) => axios.get(SHOESMARK_API_DOMAIN + `/color/${id}`);
export default getColorRequest;