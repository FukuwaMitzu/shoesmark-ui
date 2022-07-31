import { AxiosError } from "axios";

export type ApiRequestError = AxiosError<{
    statusCode: number,
    message: Array<string>,
    error: string
}>