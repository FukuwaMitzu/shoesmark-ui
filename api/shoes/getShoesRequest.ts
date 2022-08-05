import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { Shoes } from "./shoes";

interface GetShoesParam{
    shoesId: string
}


const getShoesRequest: ApiRequestHandler<GetShoesParam, JsonEntity<Shoes>> = (data)=> axios.get(SHOESMARK_API_DOMAIN + "/shoes/" + data.shoesId);
export default getShoesRequest;