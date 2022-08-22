import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { CustomNextPage } from "../../../_app";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingButton from "@mui/lab/LoadingButton";
import getUserExistRequest from "../../../../api/user/getUserExistRequest";
import { useEffect, useState } from "react";
import { ApiRequestError } from "../../../../interfaces/ApiRequestError";
import genderList from "../../../../util/genderList";
import OptionDial, {
  OptionDialItem,
} from "../../../../components/OptionDial/OptionDial";
import EditIcon from "@mui/icons-material/Edit";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveIcon from "@mui/icons-material/Save";
import getUserRequest, {
  GetUserQueryKey,
} from "../../../../api/user/getUserRequest";
import editUserRequest from "../../../../api/user/editUserRequest";
import extractDiff from "../../../../util/extractDiff";

type EditUserFormInputs = {
  username: string;
  email: string;
  isActive: boolean;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  city: string;
  district: string;
  userCity: any;
  userDistrict: any;
  address: string;
};

const EditUserPage: CustomNextPage = () => {
  const session = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [editMode, setEditMode] = useState(false);

  const editUserForm = useForm<EditUserFormInputs>({
    defaultValues: {
      role: "user",
      gender: genderList[2].value,
      email: "",
      username: "",
      address: "",
      firstName: "",
      lastName: "",
      city: "",
      district: "",
      phoneNumber: "",
      isActive: true,
    },
  });

  //======Queries===================
  const getUserQuery = useQuery(
    [GetUserQueryKey],
    () =>
      getUserRequest({
        userId: router.query.id as string,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      select: ({ data }) => data.data,
      onSuccess: (data) => {
        editUserForm.reset({
          ...JSON.parse(JSON.stringify(data)),
        });
      },
    }
  );
  const editUserQuery = useMutation(
    (data: Partial<EditUserFormInputs>) =>
      editUserRequest({
        userId: router.query.id as string,
        ...data,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      onSuccess: () => {
        enqueueSnackbar("Cập nhật thành công", { variant: "success" });
      },
      onError: (error: ApiRequestError) => {
        enqueueSnackbar(error.response?.data.message[0], { variant: "error" });
      },
    }
  );
  const getProvince = useQuery(
    ["getProvince"],
    () => axios.get("https://provinces.open-api.vn/api/p/"),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
    }
  );
  const getDistrict = useQuery(
    ["getDistrict", editUserForm.watch("city")],
    () =>
      axios.get("https://provinces.open-api.vn/api/d/search/", {
        params: {
          q: "*",
          p: editUserForm.watch("userCity")?.code,
        },
      }),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
      enabled: !!editUserForm.watch("city"),
    }
  );

  const getEmailExist = useQuery(
    ["getEmailExist"],
    () =>
      getUserExistRequest({
        email: editUserForm.getValues("email"),
      }),
    {
      select: ({ data }) => data,
      retry: false,
      enabled: false,
    }
  );
  const getUserNameExist = useQuery(
    ["getUserNameExist"],
    () =>
      getUserExistRequest({
        username: editUserForm.getValues("username"),
      }),
    {
      select: ({ data }) => data,
      retry: false,
      enabled: false,
    }
  );

  //=======Callbacks====================
  const handleEditUser: SubmitHandler<EditUserFormInputs> = (data) => {
    if (!getUserQuery.data) return;
    const diff = extractDiff(getUserQuery.data, data);
    editUserQuery.mutate(diff);
  };
  //=======Effects=====================
  useEffect(() => {
    const handler = setTimeout(() => {
      const userEmail = editUserForm.getValues("email");
      if (
        userEmail.length > 0 &&
        userEmail != getUserQuery.data?.email &&
        editMode
      )
        getEmailExist.refetch();
    }, 350);
    return () => clearTimeout(handler);
  }, [editUserForm.watch("email")]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const userName = editUserForm.getValues("username");
      if (
        userName.length > 0 &&
        userName != getUserQuery.data?.username &&
        editMode
      )
        getUserNameExist.refetch();
    }, 350);
    return () => clearTimeout(handler);
  }, [editUserForm.watch("username")]);

  //Options
  const options: OptionDialItem[] = [
    {
      icon: <EditIcon></EditIcon>,
      title: "Sửa",
      enabled: !editMode,
      onClick: () => {
        setEditMode(true);
      },
    },
    {
      icon: <ClearOutlinedIcon></ClearOutlinedIcon>,
      title: "Huỷ",
      enabled: editMode,
      onClick: () => {
        setEditMode(false);
        editUserForm.reset();
      },
    },
    {
      icon: <SaveIcon></SaveIcon>,
      title: "Lưu",
      enabled: editMode,
      onClick: () => {
        setEditMode(false);
        handleEditUser(editUserForm.getValues());
      },
    },
  ];

  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/admin/nguoi-dung" passHref>
          <MuiLink underline="hover" color="inherit">
            Người dùng
          </MuiLink>
        </Link>
        <Typography color="text.primary">Thông tin Người dùng</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Thông tin Người dùng
      </Typography>
      <form onSubmit={editUserForm.handleSubmit(handleEditUser)}>
        <Stack spacing={2} width={"450px"}>
          <Controller
            name="username"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField
                disabled={!editMode}
                error={getUserNameExist.isError}
                helperText={
                  getUserNameExist.isError &&
                  (getUserNameExist.error as any).response.data.message[0]
                }
                required
                label="Tên đăng nhập"
                {...field}
              ></TextField>
            )}
          />
          <Controller
            name="email"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField
                disabled={!editMode}
                error={getEmailExist.isError}
                label="Email"
                type={"email"}
                required
                {...field}
                helperText={
                  getEmailExist.isError &&
                  (getEmailExist.error as any).response.data.message[0]
                }
              ></TextField>
            )}
          />
          <Stack direction={"row"} spacing={2}>
            <Controller
              name="lastName"
              control={editUserForm.control}
              render={({ field }) => (
                <TextField
                  disabled={!editMode}
                  label="Tên đệm"
                  {...field}
                  fullWidth
                ></TextField>
              )}
            />
            <Controller
              name="firstName"
              control={editUserForm.control}
              render={({ field }) => (
                <TextField
                  disabled={!editMode}
                  label="Tên"
                  {...field}
                  fullWidth
                ></TextField>
              )}
            />
          </Stack>
          <Controller
            name="gender"
            control={editUserForm.control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="gender-select-label">Giới tính</InputLabel>
                <Select
                  disabled={!editMode}
                  labelId="gender-select-label"
                  label="Giới tính"
                  required
                  {...field}
                >
                  {genderList.map((gender) => (
                    <MenuItem key={gender.id} value={gender.value}>
                      {gender.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="role"
            control={editUserForm.control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="role-select-label">Vai trò</InputLabel>
                <Select
                  disabled={!editMode}
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
          <Controller
            name="phoneNumber"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField
                disabled={!editMode}
                label="Số điện thoại"
                type={"tel"}
                {...field}
              ></TextField>
            )}
          />
          <Controller
            name="userCity"
            control={editUserForm.control}
            render={({ field }) => (
              <Autocomplete
                disabled={!editMode}
                freeSolo
                value={
                  editUserForm.getValues("city") !== ""
                    ? { name: editUserForm.getValues("city") }
                    : null
                }
                getOptionLabel={(option: any) => option.name}
                options={getProvince.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={field.value}
                    required
                    label="Tỉnh / Thành phố"
                  />
                )}
                onChange={(e, value: any) => {
                  field.onChange(value);
                  editUserForm.setValue("city", value?.name ?? "");
                }}
              />
            )}
          />
          <Controller
            name="userDistrict"
            control={editUserForm.control}
            render={({ field }) => (
              <Autocomplete
                disabled={!editMode}
                freeSolo
                value={
                  editUserForm.getValues("district") !== ""
                    ? { name: editUserForm.getValues("district") }
                    : null
                }
                getOptionLabel={(option: any) => option.name}
                options={getDistrict.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={field.value}
                    required
                    label="Quận / Huyện"
                  />
                )}
                onChange={(e, value: any) => {
                  field.onChange(value);
                  editUserForm.setValue("district", value?.name ?? "");
                }}
              />
            )}
          />
          <Controller
            name="address"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField label="Địa chỉ" disabled={!editMode} {...field} />
            )}
          />
          <Controller
            name="isActive"
            control={editUserForm.control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch disabled={!editMode} defaultChecked {...field} />
                }
                label="Kích hoạt tài khoản"
              />
            )}
          />
        </Stack>
      </form>
      <OptionDial ariaLabel="Tuỳ chọn" options={options} />
    </Box>
  );
};
EditUserPage.layout = "manager";
EditUserPage.auth = {
  role: ["admin", "employee"],
};
export default EditUserPage;
