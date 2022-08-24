import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

interface EditShoesParam extends RequestWithAuth{
    shoesId: string,
    formData: FormData
}

const editShoesRequest: ApiRequestHandler<EditShoesParam, JsonAction> = (data)=> axios.put<JsonAction>(SHOESMARK_API_DOMAIN+"/shoes/" + data.shoesId, data.formData, {
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});

export default editShoesRequest;