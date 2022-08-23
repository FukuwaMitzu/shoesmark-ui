import { AxiosResponse } from "axios"

export type ApiRequestHandler<T, R> = (data:T) => Promise<AxiosResponse<R>>
export interface RequestWithAccessCode{
    accessCode?: string
}
export interface RequestWithAuth{
    accessToken?: string
}
export interface RequestWithPagination{
    limit?: number,
    offset?: number
}
export interface RequestWithOrderSession{
    orderSessionToken: string
}