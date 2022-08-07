import { Shoes } from "../shoes/shoes";
import { User } from "../user/user";

interface ImportOrderDetail {
    importOrderId: string;
    shoesId: string;
    importOrder: ImportOrder | {importOrderId:string};
    shoes: Shoes;
    quantity: number;
}
export interface ImportOrder {
    importOrderId: string;
    creator?: User;
    note: string;
    details: ImportOrderDetail[];
    createdAt: string;
    updatedAt: string;
}