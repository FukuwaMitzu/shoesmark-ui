import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Brand } from "./brand";

interface EditBrandParam extends RequestWithAuth{
    brandId: string
    brandName?: string
}

const editBrandRequest: ApiRequestHandler<EditBrandParam, JsonEntity<Brand>> = (data)=> axios.put(SHOESMARK_API_DOMAIN+`/brand/${data.brandId}`, {
    brandName: data.brandName,
}, {
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});

export default editBrandRequest;