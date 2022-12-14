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
import getUserExistRequest from "../../../../apiRequests/user/getUserExistRequest";
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
} from "../../../../apiRequests/user/getUserRequest";
import editUserRequest from "../../../../apiRequests/user/editUserRequest";
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
        enqueueSnackbar("C???p nh???t th??nh c??ng", { variant: "success" });
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
      title: "S???a",
      enabled: !editMode,
      onClick: () => {
        setEditMode(true);
      },
    },
    {
      icon: <ClearOutlinedIcon></ClearOutlinedIcon>,
      title: "Hu???",
      enabled: editMode,
      onClick: () => {
        setEditMode(false);
        editUserForm.reset();
      },
    },
    {
      icon: <SaveIcon></SaveIcon>,
      title: "L??u",
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
            Ng?????i d??ng
          </MuiLink>
        </Link>
        <Typography color="text.primary">Th??ng tin Ng?????i d??ng</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Th??ng tin Ng?????i d??ng
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
                label="T??n ????ng nh???p"
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
                  label="T??n ?????m"
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
                  label="T??n"
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
                <InputLabel id="gender-select-label">Gi???i t??nh</InputLabel>
                <Select
                  disabled={!editMode}
                  labelId="gender-select-label"
                  label="Gi???i t??nh"
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
                <InputLabel id="role-select-label">Vai tr??</InputLabel>
                <Select
                  disabled={!editMode}
                  labelId="role-select-label"
                  label="Vai tr??"
                  required
                  {...field}
                >
                  <MenuItem value={"user"}>Kh??ch h??ng th??nh vi??n</MenuItem>
                  <MenuItem value={"admin"}>Qu???n tr??? vi??n</MenuItem>
                  <MenuItem value={"employee"}>Nh??n vi??n</MenuItem>
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
                label="S??? ??i???n tho???i"
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
                    onChange={(e)=>editUserForm.setValue("city", e.target.value)}
                    label="T???nh / Th??nh ph???"
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
                    onChange={(e)=>editUserForm.setValue("district", e.target.value)}
                    required
                    label="Qu???n / Huy???n"
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
              <TextField label="?????a ch???" disabled={!editMode} {...field} />
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
                label="K??ch ho???t t??i kho???n"
              />
            )}
          />
        </Stack>
      </form>
      <OptionDial ariaLabel="Tu??? ch???n" options={options} />
    </Box>
  );
};
EditUserPage.layout = "manager";
EditUserPage.auth = {
  role: ["admin", "employee"],
};
export default EditUserPage;
