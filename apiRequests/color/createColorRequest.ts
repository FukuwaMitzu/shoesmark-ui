import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

interface CreateColorParam extends RequestWithAuth{
    colorName: string
    colorHex: string
}

const createColorRequest: ApiRequestHandler<CreateColorParam, JsonAction> = (data)=> axios.post<JsonAction>(SHOESMARK_API_DOMAIN+"/color", {
    colorName: data.colorName,
    colorHex: data.colorHex
}, {
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});

export default createColorRequest;