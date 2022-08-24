import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Color } from "./color";

interface EditColorParam extends RequestWithAuth{
    colorId: string
    colorName?: string
    colorHex?: string
}

const editColorRequest: ApiRequestHandler<EditColorParam, JsonEntity<Color>> = (data)=> axios.put<JsonEntity<Color>>(SHOESMARK_API_DOMAIN+`/color/${data.colorId}`, {
    colorName: data.colorName,
    colorHex: data.colorHex
}, {
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});

export default editColorRequest;