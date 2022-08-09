import Box from "@mui/material/Box"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import { CustomNextPage } from "../../_app"
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { TextField } from "@mui/material"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import axios, { AxiosResponse } from "axios"
import { useMutation, useQuery } from "@tanstack/react-query"
import LoadingButton from "@mui/lab/LoadingButton"
import getUserExistRequest from "../../../api/user/getUserExistRequest"
import { useEffect } from "react"
import createUserRequest, { CreateUserParam } from "../../../api/user/createUserRequest"
import { ApiRequestError } from "../../../interfaces/ApiRequestError"
import genderList from "../../../util/genderList"

type CreateUserFormInputs = {
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    city: any;
    district: any;
    address: string;
}

const CreateUserPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const createUserForm = useForm<CreateUserFormInputs>({
        defaultValues: {
            role: "user",
            gender: genderList[2].value,
            email: "",
            username: "",
            address: "",
            firstName: "",
            lastName: "",
            password: "",
            phoneNumber: "",
            isActive: true,
        }
    });

    //======Queries===================
    const getProvince = useQuery(["getProvince"], () => axios.get("https://provinces.open-api.vn/api/p/"), {
        refetchOnWindowFocus: false,
        select: ({ data }) => data,
        initialData: (): any => ({ data: [] })
    });
    const getDistrict = useQuery(["getDistrict", createUserForm.watch("city")], () => axios.get("https://provinces.open-api.vn/api/d/search/", {
        params: {
            q: "*",
            p: createUserForm.watch("city")?.code
        }
    }), {
        refetchOnWindowFocus: false,
        select: ({ data }) => data,
        initialData: (): any => ({ data: [] }),
        enabled: !!createUserForm.watch("city")
    });
    const getEmailExist = useQuery(["getEmailExist"], () => getUserExistRequest({
        email: createUserForm.getValues("email"),
        accessToken: session.data?.user?.accessToken
    }), {
        select: ({ data }) => data,
        retry: false,
        enabled: false
    });
    const getUserNameExist = useQuery(["getUserNameExist"], () => getUserExistRequest({
        username: createUserForm.getValues("username"),
        accessToken: session.data?.user?.accessToken
    }), {
        select: ({ data }) => data,
        retry: false,
        enabled: false
    });
    const createUser = useMutation((data: CreateUserParam) => createUserRequest(data), {
        onError: (error: ApiRequestError) => {
            if (error.response)
                enqueueSnackbar(error.response.data.message[0], { "variant": "error" });
        },
        onSuccess: (data) => {
            enqueueSnackbar("Thêm thành công", { "variant": "success" });
            router.back();
        }
    });
    //=======Callbacks====================
    const handleFormSubmit: SubmitHandler<CreateUserFormInputs> = (data) => {
        if (typeof data.city === "object") data.city = data.city.name;
        if (typeof data.district === "object") data.district = data.district.name;
        createUser.mutate({ ...data, accessToken: session.data?.user?.accessToken });
    }
    //=======Effects=====================
    useEffect(() => {
        const handler = setTimeout(() => {
            if (createUserForm.getValues("email").length > 0)
                getEmailExist.refetch();
        }, 350);
        return () => clearTimeout(handler);
    }, [createUserForm.watch("email")]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (createUserForm.getValues("username").length > 0)
                getUserNameExist.refetch();
        }, 350);
        return () => clearTimeout(handler);
    }, [createUserForm.watch("username")]);

    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/nguoi-dung" passHref>
                    <MuiLink underline="hover" color="inherit">Người dùng</MuiLink>
                </Link>
                <Typography color="text.primary">Thêm Người dùng</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thêm Người dùng</Typography>
            <form onSubmit={createUserForm.handleSubmit(handleFormSubmit)}>
                <Stack spacing={2} width={"450px"}>
                    <TextField
                        error={getUserNameExist.isError}
                        helperText={getUserNameExist.isError && (getUserNameExist.error as any).response.data.message[0]}
                        required
                        label="Tên đăng nhập"
                        {...createUserForm.register("username")}
                    ></TextField>
                    <TextField
                        error={getEmailExist.isError}
                        label="Email"
                        type={"email"}
                        required
                        {...createUserForm.register("email")}
                        helperText={getEmailExist.isError && (getEmailExist.error as any).response.data.message[0]}
                    >
                    </TextField>
                    <TextField label="Mật khẩu" type={"password"} {...createUserForm.register("password")}></TextField>
                    <Stack direction={"row"} spacing={2}>
                        <TextField label="Tên đệm" {...createUserForm.register("lastName")} fullWidth></TextField>
                        <TextField label="Tên" {...createUserForm.register("firstName")} fullWidth></TextField>
                    </Stack>
                    <Controller
                        name="gender"
                        control={createUserForm.control}
                        render={({ field }) => (
                            <FormControl>
                                <InputLabel id="gender-select-label">Giới tính</InputLabel>
                                <Select
                                    labelId="gender-select-label"
                                    label="Giới tính"
                                    required
                                    {...field}
                                >
                                    {
                                        genderList.map((gender) => (
                                            <MenuItem key={gender.id} value={gender.value}>{gender.title}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="role"
                        control={createUserForm.control}
                        render={({ field }) => (
                            <FormControl>
                                <InputLabel id="role-select-label">Vai trò</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    label="Vai trò"
                                    required
                                    {...field}
                                >
                                    <MenuItem value={"user"}>Khách hàng thành viên</MenuItem>
                                    <MenuItem value={"admin"}>Quản trị viên</MenuItem>
                                    <MenuItem value={"employee"}>Nhân viên</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                    <TextField label="Số điện thoại" type={"tel"} {...createUserForm.register("phoneNumber")}></TextField>
                    <Controller
                        name="city"
                        control={createUserForm.control}
                        render={({ field }) => (
                            <Autocomplete
                            freeSolo
                                getOptionLabel={(option: any) => option.name}
                                options={getProvince.data}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        value={field.value}
                                        required
                                        label="Tỉnh / Thành phố"
                                    />
                                )
                                }
                                onChange={(e, value) => { field.onChange(value) }}
                            />
                        )}
                    />
                    <Controller
                        name="district"
                        control={createUserForm.control}
                        render={({ field }) => (
                            <Autocomplete
                                freeSolo
                                getOptionLabel={(option: any) => option.name}
                                options={getDistrict.data}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        value={field.value}
                                        required
                                        label="Quận / Huyện"
                                    />
                                )
                                }
                                onChange={(e, value) => field.onChange(value)}
                            />
                        )}
                    />
                    <TextField label="Địa chỉ" {...createUserForm.register("address")} />
                    <FormControlLabel control={<Switch defaultChecked {...createUserForm.register("isActive")} />} label="Kích hoạt tài khoản" />
                    <LoadingButton variant="contained" type="submit">Thêm</LoadingButton>
                </Stack>
            </form>
        </Box>
    )

}
CreateUserPage.layout = "manager";
CreateUserPage.auth = {
    role: ["admin", "employee"]
}
export default CreateUserPage;