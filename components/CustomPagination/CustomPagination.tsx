import Pagination from "@mui/material/Pagination"
import { ChangeEvent } from "react"

interface CustomPaginationProps{
    limit: number,
    offset: number,
    total: number,
    onPageChange?: (e:ChangeEvent<any>, page: number)=>void,
}

const CustomPagination: React.FC<CustomPaginationProps> = ({limit, offset, total, onPageChange})=>{

    const totalPage = limit>0?Math.ceil(total/limit):0;
    const currentPage = limit>0?Math.ceil(offset/limit)+1:0;

    return (
        <Pagination 
            count={totalPage}
            page={currentPage} 
            color="primary"
            onChange={onPageChange}
        />
    )
}

export default CustomPagination;