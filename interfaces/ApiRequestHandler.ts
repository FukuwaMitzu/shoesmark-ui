import { AxiosResponse } from "axios"

export type ApiRequestHandler<T, R> = (data:T) => Promise<AxiosResponse<R>>
export interface RequestWithAuth{
    accessToken?: string
}
export interface RequestWithPagination{
    limit?: number,
    offset?: number
}