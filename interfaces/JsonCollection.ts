export interface JsonCollection<T>{
    result: 'collection'
    data: [T]
    offset: number
    limit: number
    total: number
}