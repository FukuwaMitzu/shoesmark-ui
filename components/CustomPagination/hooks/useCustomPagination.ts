import { ChangeEvent, useState } from "react";

interface CustomPaginationHookOption{
    limit: number,
    offset: number,
    total: number,
}

const useCustomPagination = (option: CustomPaginationHookOption) =>{ 
    const [pagination, setPagination] = useState({limit: option.limit, offset: option.offset, total: option.total});
    const handlePagination = (e: ChangeEvent<any>, page:number)=>{
        if(page == Math.ceil(pagination.offset / pagination.limit) + 1) return;
        setPagination({...pagination, offset: pagination.limit * (page-1)});
    }
    return {pagination, setPagination, handlePagination};
}

export default useCustomPagination;