import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { CustomNextPage } from "../../_app";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";
import createShoesRequest from "../../../api/shoes/createShoesRequest";
import Button from "@mui/material/Button";
import { ChangeEvent, useRef } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import getAllCategoryRequest from "../../../api/category/getAllCategoryRequest";
import getAllColorRequest from "../../../api/color/getAllColorRequest";
import getAllBrandRequest from "../../../api/brand/getAllBrandRequest";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import sizeList from "../../../util/sizeFilterList";

type CreateShoesFormInputs = {
    shoesName: string;
    description: string;
    shoesImage: unknown;
    UPC: string;
    SKU: string;
    categories: string[];
    brandId?: string;
    colorId?: string;
    size: number;
    price: number;
    importPrice: number;
    sale: number;
    quantity: number;
}

const CreateShoesPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();
    const imageRef: any = useRef();
    //========Queries============================
    const createShoesQuery = useMutation((data: FormData) => createShoesRequest({
        formData: data,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: () => {
            router.back();
            enqueueSnackbar("Khởi tạo thành công", { variant: "success" });
        },
        onError: () => {
            enqueueSnackbar("Khởi tạo thất bại", { variant: "error" });
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

    //======Callbacks==================================
    const createShoesForm = useForm<CreateShoesFormInputs>();
    const handleCreateShoes: SubmitHandler<CreateShoesFormInputs> = (data) => {
        const form = new FormData();
        for (var key in data) {
            form.append(key, (data as any)[key]);
        }
        form.append("categories", JSON.stringify(data.categories));
        createShoesQuery.mutate(form);
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
                <Typography color="text.primary">Thêm Giày</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thêm Giày</Typography>
            <form onSubmit={createShoesForm.handleSubmit(handleCreateShoes)}>
                <Stack direction={"row"} spacing={4} sx={{ marginBottom: "50px" }}>
                    <Stack spacing={2}>
                        <Controller
                            name="shoesImage"
                            control={createShoesForm.control}
                            render={({ field }) => (
                                <Stack direction={"column"} spacing={2} width={"250px"}>
                                    <img width={250} height={250} ref={imageRef}></img>
                                    <Button component={"label"} startIcon={<CameraAltIcon />} variant={"text"}>Tải ảnh lên <input type="file" hidden onChange={(e) => {
                                        onFileSelected(e);
                                        if (e.target.files) field.onChange(e.target.files[0]);
                                    }} /></Button>
                                </Stack>
                            )}
                        />
                        <LoadingButton variant="contained" type="submit">Khởi tạo</LoadingButton>
                    </Stack>
                    <Stack direction={"column"} spacing={2} width={"475px"}>
                        <TextField label={"Tên giày"} {...createShoesForm.register("shoesName")}></TextField>
                        <TextField label={"Mã vạch sản phẩm"} {...createShoesForm.register("UPC")}></TextField>
                        <TextField label={"Mã đơn vị lưu kho"} {...createShoesForm.register("SKU")}></TextField>
                        <Controller
                            name="categories"
                            control={createShoesForm.control}
                            render={
                                ({ field }) => (
                                    <Autocomplete
                                        multiple
                                        getOptionLabel={(option: any) => option.categoryName}
                                        filterSelectedOptions
                                        options={getAllCategory.data?.data ?? []}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Thể loại"
                                            />
                                        )}
                                        onChange={(e, data) => field.onChange(data.map((a) => a.categoryId))}
                                    />
                                )
                            }
                        />
                        <Controller
                            name="brandId"
                            control={createShoesForm.control}
                            render={
                                ({ field }) => (
                                    <Autocomplete
                                        getOptionLabel={(option: any) => option.brandName}
                                        filterSelectedOptions
                                        options={getAllBrand.data?.data ?? []}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Thương hiệu"
                                            />
                                        )}
                                        onChange={(e, option) => field.onChange(option?.brandId)}
                                    />
                                )
                            }
                        />
                        <Controller
                            name="colorId"
                            control={createShoesForm.control}
                            render={
                                ({ field }) => (
                                    <Autocomplete
                                        getOptionLabel={(option: any) => option.colorName}
                                        filterSelectedOptions
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
                                        onChange={(e, option) => field.onChange(option?.colorId)}
                                    />
                                )
                            }
                        />
                        <Controller
                            name="size"
                            control={createShoesForm.control}
                            render={
                                ({ field }) => (
                                    <Autocomplete
                                        filterSelectedOptions
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
                    </Stack>
                    <Stack spacing={2}>
                        <TextField label={"Đơn giá nhập"}
                            {...createShoesForm.register("importPrice")}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">VND</InputAdornment>
                            }}
                        ></TextField>
                        <TextField label={"Đơn giá bán"}
                            {...createShoesForm.register("price")}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">VND</InputAdornment>
                            }}
                        ></TextField>
                        <TextField label={"Khuyến mãi"}
                            {...createShoesForm.register("sale")}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>
                            }}
                        ></TextField>
                        <TextField label={"Số lượng trong kho"}
                            {...createShoesForm.register("quantity")}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">Đôi</InputAdornment>
                            }}
                        ></TextField>
                    </Stack>
                </Stack>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Mô tả</Typography>
                    <TextField
                        fullWidth
                        multiline
                        {...createShoesForm.register("description")}
                        maxRows={20}
                        rows={15}
                    />
                </Box>
            </form>
        </Box>
    )
}

CreateShoesPage.layout = "manager";
CreateShoesPage.auth = {
    role: ["admin", "employee"]
}
export default CreateShoesPage;