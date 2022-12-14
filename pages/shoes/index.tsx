import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import sizeList from '../../util/sizeFilterList'
import priceFilterList from '../../util/priceFilterList'
import { useQuery } from '@tanstack/react-query'
import getAllColorRequest, { GetAllColorQueryKey } from '../../apiRequests/color/getAllColorRequest'
import getAllCategoryRequest, { GetAllCategoryQueryKey } from '../../apiRequests/category/getAllCategoryRequest'
import LoadingButton from '@mui/lab/LoadingButton'
import getAllShoesRequest, { GetAllShoesQueryKey } from '../../apiRequests/shoes/getAllShoesRequest'
import Button from '@mui/material/Button'
import useCustomPagination from '../../components/CustomPagination/hooks/useCustomPagination'
import CustomPagination from '../../components/CustomPagination/CustomPagination'
import LazyShoesCard from '../../components/ShoesCard/LazyShoesCard'
import { CustomNextPage } from '../_app'



type SearchFormInputs = {
    shoesName: string
    colorId: string
    categoryIds: string[]
    size: string,
    price: string,
}

const ShoesHome: CustomNextPage = () => {
    const searchForm = useForm<SearchFormInputs>({
        defaultValues: {
            colorId: "",
            shoesName: "",
            categoryIds: [],
            price: "",
            size: ""
        }
    });
    const { handlePagination, pagination, setPagination } = useCustomPagination({ limit: 15, offset: 0, total: 0 });
    //========Queries===========
    const getAllShoesQuery = useQuery([GetAllShoesQueryKey, { limit: pagination.limit, offset: pagination.offset }], () => {
        const queryData = {
            categoryIds: searchForm.getValues("categoryIds"),
            shoesName: searchForm.getValues("shoesName"),
            colorId: searchForm.getValues("colorId") != "" ? searchForm.getValues("colorId") : undefined,
            price: priceFilterList.find((price) => price.title == searchForm.getValues("price"))?.value,
            size: searchForm.getValues("size") != "" ? searchForm.getValues("size") : undefined
        }
        return getAllShoesRequest({
            limit: pagination.limit,
            offset: pagination.offset,
            ...queryData
        })
    }, {
        select: (data) => data.data,
        onSuccess: (data) => {
            setPagination({ ...pagination, total: data.total })
        }
    });
    const getAllColorQuery = useQuery([GetAllColorQueryKey], () => getAllColorRequest({
    }), {
        select: ({ data }) => data.data
    });
    const getAllCategory = useQuery([GetAllCategoryQueryKey], () => getAllCategoryRequest({
    }), {
        select: ({ data }) => data.data
    });
    //=======Callbacks==========
    const handleSearchForm: SubmitHandler<SearchFormInputs> = (data) => {
        getAllShoesQuery.refetch();
    }
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/" passHref>
                    <MuiLink underline="hover" color="inherit">Trang ch???</MuiLink>
                </Link>
                <Typography color="text.primary">T??m ki???m s???n ph???m</Typography>
            </Breadcrumbs>
            <Typography variant="h4" fontWeight={"bold"} textTransform={"uppercase"} color="text.primary">T??m ki???m s???n ph???m</Typography>
            <Box sx={{ marginTop: "35px" }}>
                <form onSubmit={searchForm.handleSubmit(handleSearchForm)} onReset={() => searchForm.reset()}>
                    <Stack direction="row" spacing={1}>
                        <TextField label="T??n s???n ph???m" fullWidth {...searchForm.register("shoesName")} sx={{ flex: 4 }}></TextField>
                        <LoadingButton variant="contained" type="submit" sx={{ flex: 1 }}>T??m ki???m</LoadingButton>
                        <Button variant="text" type="reset" sx={{ flex: 0.5 }}>L??m m???i</Button>
                    </Stack>
                    <Stack direction={"row"} marginTop={"25px"} spacing={1}>
                        <Controller
                            name="colorId"
                            control={searchForm.control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>M??u s???c</InputLabel>
                                    <Select
                                        {...field}
                                        label="M??u s???c"
                                    >
                                        {
                                            getAllColorQuery.data?.map((color) => (
                                                <MenuItem key={color.colorId} value={color.colorId}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Box sx={{ backgroundColor: color.colorHex, width: "25px", height: "25px" }}></Box>
                                                        <Typography>{color.colorName}</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            name="categoryIds"
                            control={searchForm.control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Th??? lo???i</InputLabel>
                                    <Select
                                        label="Th??? lo???i"
                                        multiple
                                        value={searchForm.getValues("categoryIds")}
                                        onChange={(props) => { field.onChange(props.target.value) }}
                                        renderValue={(selected) => selected.map((id) => getAllCategory.data?.find((category) => category.categoryId == id)?.categoryName).join(', ')}
                                    >
                                        {
                                            getAllCategory.data?.map((category) => (
                                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            name='size'
                            control={searchForm.control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>K??ch c???</InputLabel>
                                    <Select
                                        label="K??ch c???"
                                        {...field}
                                    >
                                        {sizeList.map((size) => (
                                            <MenuItem key={`size${size}`} value={size}>{size}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            name="price"
                            control={searchForm.control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Gi??</InputLabel>
                                    <Select
                                        label="Gi??"
                                        {...field}
                                    >
                                        {priceFilterList.map((priceFilter) => (
                                            <MenuItem key={priceFilter.title} value={priceFilter.title}>{priceFilter.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Stack>
                </form>
                <Stack direction={"row"} flexWrap={"wrap"} gap={2} marginTop={"75px"}>
                    {
                        !getAllShoesQuery.isLoading && getAllShoesQuery.data &&
                        getAllShoesQuery.data.data.map((shoes) => (
                            <LazyShoesCard key={shoes.shoesId} {...shoes}/>
                        ))
                    }
                </Stack>
                {
                    getAllShoesQuery.data &&
                    <Stack alignItems={"center"} marginTop={"35px"}>
                        <CustomPagination
                            limit={pagination.limit}
                            offset={pagination.offset}
                            total={pagination.total}
                            onPageChange={handlePagination}
                        />
                    </Stack>
                }
            </Box>
        </Box>
    )
}
ShoesHome.layout="customer";
export default ShoesHome
