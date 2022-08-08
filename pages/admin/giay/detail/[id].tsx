import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import { ChangeEvent, useRef, useState } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import getAllCategoryRequest from "../../../../api/category/getAllCategoryRequest";
import getAllColorRequest from "../../../../api/color/getAllColorRequest";
import getAllBrandRequest from "../../../../api/brand/getAllBrandRequest";
import { CustomNextPage } from "../../../_app";
import editShoesRequest from "../../../../api/shoes/editShoesRequest";
import getShoesRequest from "../../../../api/shoes/getShoesRequest";
import { SHOESMARK_API_DOMAIN } from "../../../../config/domain";
import { ApiRequestError } from "../../../../interfaces/ApiRequestError";
import extractDiff from "../../../../util/extractDiff";
import { Category } from "../../../../api/category/category";
import { Brand } from "../../../../api/brand/brand";
import { Color } from "../../../../api/color/color";
import sizeList from "../../../../util/sizeFilterList";

type EditShoesFormInputs = {
    shoesName: string;
    description: string;
    shoesImage: unknown;
    UPC: string;
    SKU: string;
    categories: Category[];
    brand?: Brand;
    color?: Color;
    size: number;
    price: number;
    importPrice: number;
    sale: number;
    quantity: number;
}

const DetailShoesPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const [editMode, setEditMode] = useState(false);
    const imageRef: any = useRef();

    //========Queries============================
    const getShoesQuery = useQuery(["getShoes"], () => getShoesRequest({
        shoesId: router.query.id as string
    }), {
        refetchOnWindowFocus: false,
        select: (data) => data.data,
        onSuccess: ({ data }) => {
            editShoesForm.reset(data);
            imageRef.current.src = SHOESMARK_API_DOMAIN + "/" + data.shoesImage;
        }
    });
    const getAllCategory = useQuery(["getAllCategory"], () => getAllCategoryRequest({}), {
        select: (data) => data.data
    });
    const getAllColor = useQuery(["getAllColor"], () => getAllColorRequest({}), {
        select: (data) => data.data
    });
    const getAllBrand = useQuery(["getAllBrand"], () => getAllBrandRequest({}), {
        select: (data) => data.data
    });
    const editShoesQuery = useMutation((data: FormData) => editShoesRequest({
        shoesId: router.query.id as string,
        formData: data,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: () => {
            router.back();
            enqueueSnackbar("Cập nhật thành công", { variant: "success" });
        },
        onError: (error: ApiRequestError) => {
            enqueueSnackbar(error.response?.data.message[0], { variant: "error" });
        }
    });
    //======Callbacks==================================
    const editShoesForm = useForm<EditShoesFormInputs>({
        defaultValues: {
            shoesName: "",
            importPrice: 0,
            quantity: 0,
            sale: 0,
            SKU: "",
            UPC: "",
            size: 0,
            price: 0,
            categories: [],
            color: { colorHex: "#FFF", colorId: "", colorName: "" },
            brand: { brandId: "", brandName: "" }
        }
    });

    const handleCategoryEditDenied = () => {
        setEditMode(false);
        if (getShoesQuery.data) {
            const { data } = getShoesQuery.data;
            editShoesForm.reset();
            imageRef.current.src = SHOESMARK_API_DOMAIN + "/" + data.shoesImage;
        }
    }
    const handleEditShoes: SubmitHandler<EditShoesFormInputs> = (data) => {
        const form = new FormData();
        if (!getShoesQuery.data) return;
        const { color, brand, categories, ...diff } = extractDiff(getShoesQuery.data.data, data);
        for (var key in diff) {
            form.append(key, (data as any)[key]);
        }
        if (color) form.append("colorId", color.colorId);
        if (brand) form.append("brandId", brand.brandId);
        form.append("categories", JSON.stringify(data.categories.map((category) => category.categoryId)));
        editShoesQuery.mutate(form);
    }
    function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        var selectedFile = event.target.files[0];
        if (!selectedFile) return;
        var reader = new FileReader();

        imageRef.current.title = selectedFile.name;
        reader.onload = function (event) {
            imageRef.current.src = event.target?.result;
        };

        reader.readAsDataURL(selectedFile);
    }
    //=================================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/giay" passHref>
                    <MuiLink underline="hover" color="inherit">Giày</MuiLink>
                </Link>
                <Typography color="text.primary">Chi tiết Giày</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Chi tiết Giày</Typography>
            <form onSubmit={editShoesForm.handleSubmit(handleEditShoes)}>
                <Stack direction={"row"} spacing={4}>
                    <Stack spacing={2}>
                        <Controller
                            name="shoesImage"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <Stack direction={"column"} spacing={2} width={"250px"}>
                                    <img width={250} height={250} ref={imageRef} crossOrigin="anonymous"></img>
                                    {editMode && <Button component={"label"} startIcon={<CameraAltIcon />} variant={"text"}>Tải ảnh lên <input type="file" hidden onChange={(e) => {
                                        onFileSelected(e);
                                        if (e.target.files) field.onChange(e.target.files[0]);
                                    }} /></Button>}
                                </Stack>
                            )}
                        />
                        {
                            !editMode ?
                                <Button variant="contained" onClick={() => { setEditMode(true) }}>Sửa</Button>
                                :
                                <Stack direction={"row"} spacing={1}>
                                    <Button color="error" onClick={handleCategoryEditDenied} fullWidth>Huỷ</Button>
                                    <LoadingButton loading={editShoesQuery.isLoading} type={"submit"} fullWidth>Lưu</LoadingButton>
                                </Stack>
                        }
                    </Stack>
                    <Stack direction={"column"} spacing={2} width={"475px"}>
                        <Controller
                            name="shoesName"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField disabled={!editMode} label={"Tên giày"} {...field}></TextField>
                            )}
                        />
                        <Controller
                            name="UPC"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField disabled={!editMode} label={"Mã vạch sản phẩm"} {...field}></TextField>
                            )}
                        />
                        <Controller
                            name="SKU"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField disabled={!editMode} label={"Mã đơn vị lưu kho"} {...field}></TextField>
                            )}
                        />
                        <Controller
                            name="categories"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <Autocomplete
                                    disabled={!editMode}
                                    multiple
                                    {...field}
                                    isOptionEqualToValue={(option, value) => option.categoryId == value.categoryId}
                                    getOptionLabel={(option: any) => option.categoryName}
                                    filterSelectedOptions
                                    options={getAllCategory.data?.data ?? []}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Thể loại"
                                        />
                                    )}
                                    onChange={(e, option) => field.onChange(option)}
                                />
                            )
                            }
                        />
                        <Controller
                            name="brand"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <Autocomplete
                                    disabled={!editMode}
                                    {...field}
                                    isOptionEqualToValue={(option, value) => option.brandId == value.brandId}
                                    getOptionLabel={(option: any) => option.brandName}
                                    filterSelectedOptions
                                    options={getAllBrand.data?.data ?? []}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Thương hiệu"
                                        />
                                    )}
                                    onChange={(e, option) => field.onChange(option)}
                                />
                            )
                            }
                        />
                        <Controller
                            name="color"
                            control={editShoesForm.control}
                            render={
                                ({ field }) => (
                                    <Autocomplete
                                        disabled={!editMode}
                                        getOptionLabel={(option: any) => option.colorName}
                                        filterSelectedOptions
                                        {...field}
                                        isOptionEqualToValue={(option, value) => option.colorId == value.colorId}
                                        options={getAllColor.data?.data ?? []}
                                        renderOption={(params, option) => (
                                            <Box component={"li"} {...params}>
                                                <Box sx={{ backgroundColor: option.colorHex, width: "35px", height: "35px", marginRight: "10px" }}></Box>
                                                <Typography>{option.colorName}</Typography>
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Màu sắc"
                                            />
                                        )}
                                        onChange={(e, option) => field.onChange(option)}
                                    />
                                )
                            }
                        />
                    </Stack>
                    <Stack spacing={2}>
                        <Controller
                            name="size"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <Autocomplete
                                    disabled={!editMode}
                                    filterSelectedOptions
                                    {...field}
                                    getOptionLabel={(option) => option.toString()}
                                    options={sizeList}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Kích cỡ"
                                        />
                                    )}
                                    onChange={(e, option) => field.onChange(option)}
                                />
                            )
                            }
                        />
                        <Controller
                            name="importPrice"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField label={"Đơn giá nhập"}
                                    disabled={!editMode}
                                    {...field}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">VND</InputAdornment>
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="price"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField label={"Đơn giá bán"}
                                    disabled={!editMode}
                                    {...field}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">VND</InputAdornment>
                                    }}
                                ></TextField>
                            )}
                        />
                        <Controller
                            name="sale"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField label={"Khuyến mãi"}
                                    disabled={!editMode}
                                    {...field}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">%</InputAdornment>
                                    }}
                                ></TextField>
                            )}
                        />
                        <Controller
                            name="quantity"
                            control={editShoesForm.control}
                            render={({ field }) => (
                                <TextField label={"Số lượng trong kho"}
                                    disabled={!editMode}
                                    {...field}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Đôi</InputAdornment>
                                    }}
                                ></TextField>
                            )}
                        />
                    </Stack>
                </Stack>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Mô tả</Typography>
                    <TextField
                        fullWidth
                        multiline
                        disabled={!editMode}
                        {...editShoesForm.register("description")}
                        maxRows={20}
                        rows={15}
                    />
                </Box>
            </form>
        </Box>
    )
}

DetailShoesPage.layout = "manager";
DetailShoesPage.auth = {
    role: ["admin", "employee"]
}
export default DetailShoesPage;

