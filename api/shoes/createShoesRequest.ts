import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

interface CreateShoesParam extends RequestWithAuth{
    formData: FormData
}

const createShoesRequest: ApiRequestHandler<CreateShoesParam, JsonAction> = (data)=> axios.post<JsonAction>(SHOESMARK_API_DOMAIN+"/shoes", data.formData, {
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});

export default createShoesRequest;