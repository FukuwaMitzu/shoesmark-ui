import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../../../_app";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Big from "big.js";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import OptionDial, {
  OptionDialItem,
} from "../../../../components/OptionDial/OptionDial";
import createImportOrderDetailRequest from "../../../../api/importOrder/createImportOrderDetailRequest";
import deleteImportOrderDetailRequest from "../../../../api/importOrder/deleteImportOrderDetailRequest";
import editImportOrderDetailRequest from "../../../../api/importOrder/editImportOrderDetailRequest";
import { Shoes } from "../../../../api/shoes/shoes";
import { useSession } from "next-auth/react";
import ImportShoesSearchDialog from "../../../../components/ImportShoesSearchDialog/ImportShoesSearchDialog";
import LazyDetailImportOrderItem from "../../../../components/DetailImportOrderItem/LazyDetailImportOrderItem";
import currencyFormater from "../../../../util/currencyFormater";
import getImportOrderRequest, {
  GetImportOrderQueryKey,
} from "../../../../api/importOrder/getImportOrderRequest";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import extractDiff from "../../../../util/extractDiff";
import { isNotEmptyObject } from "class-validator";
import editImportOrderRequest from "../../../../api/importOrder/editImportOrderRequest";

type QueueTransaction = {
  importOrder: any;
  deleteQueue?: TemporaryImportOrderDetail[];
  updateQueue?: TemporaryImportOrderDetail[];
  addQueue?: TemporaryImportOrderDetail[];
};

//TODO: Finish import orderDetail page
interface TemporaryImportOrderDetail {
  importOrderId: string;
  shoesId: string;
  shoes: Shoes;
  quantity: number;
}

interface EditImportOrderFormInputs {
  importOrderId: string;
  note: string;
}
const DetailImportOrderPage: CustomNextPage = () => {
  const session = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [temporaryDetailOrder, setTemporaryDetailOrder] = useState<
    TemporaryImportOrderDetail[]
  >([]);

  const editImportOrderForm = useForm<EditImportOrderFormInputs>({
    defaultValues: {
      note: "",
    },
  });
  const [openShoesSearchDialog, setOpenShoesSearchDialog] = useState(false);

  //=======Queries=============
  const getImportOrder = useQuery(
    [GetImportOrderQueryKey],
    () =>
      getImportOrderRequest({
        importOrderId: router.query.id as string,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      select: ({ data }) => data.data,
      onSuccess: (data) => {
        editImportOrderForm.reset({
          note: data.note,
          importOrderId: data.importOrderId,
        });
        setTemporaryDetailOrder(
          JSON.parse(
            JSON.stringify(data.details)
          ) as TemporaryImportOrderDetail[]
        );
      },
    }
  );
  const updateOrderDetail = useMutation(
    (data: QueueTransaction) => {
      const updateOrder = isNotEmptyObject(data.importOrder)
        ? [
            editImportOrderRequest({
              ...data.importOrder,
              orderId: getImportOrder.data?.importOrderId,
              accessToken: session.data?.user?.accessToken,
            }),
          ]
        : [];
      const deleteQueue = data.deleteQueue
        ? data.deleteQueue.map((queue) => {
            return deleteImportOrderDetailRequest({
              ...queue,
              accessToken: session.data?.user?.accessToken,
            });
          })
        : [];
      const updateQueue = data.updateQueue
        ? data.updateQueue.map((queue) => {
            return editImportOrderDetailRequest({
              ...queue,
              accessToken: session.data?.user?.accessToken,
            });
          })
        : [];
      const addQueue = data.addQueue
        ? data.addQueue.map((queue) => {
            return createImportOrderDetailRequest({
              ...queue,
              accessToken: session.data?.user?.accessToken,
            });
          })
        : [];
      return Promise.all([...deleteQueue, ...addQueue, ...updateQueue]);
    },
    {
      onSuccess: () => {
        getImportOrder.refetch();
        enqueueSnackbar("Cập nhật thành công", { variant: "success" });
      },
      onError: () => {
        getImportOrder.refetch();
        enqueueSnackbar("Đã xảy ra lỗi", { variant: "error" });
      },
    }
  );

  //=======Callbacks===========
  const handleOpenShoesSearchDialog = () => {
    setOpenShoesSearchDialog(true);
  };
  const handleCloseShoesSearchDialog = () => {
    setOpenShoesSearchDialog(false);
  };
  const handleAddShoes = (shoes: Shoes) => {
    const index = temporaryDetailOrder.findIndex(
      (temp) => temp.shoesId == shoes.shoesId
    );
    if (index > -1) {
      let temp = temporaryDetailOrder[index];
      temporaryDetailOrder[index] = temporaryDetailOrder[0];
      temporaryDetailOrder[0] = temp;
    } else if (index == -1) {
      temporaryDetailOrder.unshift({
        importOrderId: editImportOrderForm.getValues("importOrderId"),
        shoesId: shoes.shoesId,
        quantity: 1,
        shoes,
      });
      setTemporaryDetailOrder([...temporaryDetailOrder]);
    }
    handleCloseShoesSearchDialog();
  };
  const handleChange = (shoesId: string, quantity: number) => {
    const detail = temporaryDetailOrder.find(
      (detail) => detail.shoesId == shoesId
    );
    if (detail) {
      detail.quantity = quantity;
      setTemporaryDetailOrder([...temporaryDetailOrder]);
    }
  };
  const handleDelete = (shoesId: string) => {
    const filter = temporaryDetailOrder.filter(
      (shoes) => shoes.shoesId != shoesId
    );
    setTemporaryDetailOrder(filter);
  };

  const handleCompleteUpdate = () => {
    const orderDiff = extractDiff(
      getImportOrder.data,
      editImportOrderForm.getValues()
    );

    let details = getImportOrder.data?.details;
    let tempDetails = temporaryDetailOrder;
    //Filter delete elements
    let flags: number[] = [];
    let deleteQueue = details?.filter((data, index) => {
      const tempIndex = tempDetails.findIndex(
        (temp) => temp.shoesId == data.shoesId
      );
      if (tempIndex == -1) {
        flags.push(index);
      }
      return tempIndex == -1;
    });
    details = details?.filter((data, index) => flags.indexOf(index) == -1);

    //Filter addition elements
    flags = [];
    const addQueue = tempDetails.filter((temp, index) => {
      const detailIndex = details?.findIndex(
        (data) => data.shoesId == temp.shoesId
      );
      if (detailIndex == -1) {
        flags.push(index);
      }
      return detailIndex == -1;
    });
    tempDetails = tempDetails.filter(
      (data, index) => flags.indexOf(index) == -1
    );

    const updateQueue = tempDetails.filter((data) => {
      const detail = details?.find((e) => e.shoesId == data.shoesId);
      if (detail) return isNotEmptyObject(extractDiff(data, detail));
      else return false;
    });

    updateOrderDetail.mutate({
      importOrder: orderDiff,
      addQueue,
      deleteQueue,
      updateQueue,
    });
  };

  //Options dial
  const options: OptionDialItem[] = [
    {
      icon: <EditIcon></EditIcon>,
      title: "Sửa",
      enabled: !editing,
      onClick: () => {
        setEditing(true);
      },
    },
    {
      icon: <ClearOutlinedIcon></ClearOutlinedIcon>,
      title: "Huỷ",
      enabled: editing,
      onClick: () => {
        setEditing(false);
        getImportOrder.refetch();
      },
    },
    {
      icon: <SaveIcon></SaveIcon>,
      title: "Lưu",
      enabled: editing,
      onClick: () => {
        setEditing(false);
        handleCompleteUpdate();
      },
    },
  ];

  return (
    <Box paddingBottom={"125px"}>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/admin/hoa-don-nhap" passHref>
          <MuiLink underline="hover" color="inherit">
            Hoá đơn nhập
          </MuiLink>
        </Link>
        <Typography color="text.primary">Thông tin hoá đơn nhập</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Thông tin hoá đơn nhập
      </Typography>
      <Box>
        <Box sx={{ marginBottom: "15px" }}>
          <Typography>
            Giá trị hoá đơn nhập:{" "}
            {currencyFormater.format(
              temporaryDetailOrder
                .reduce((pre, current) => {
                  const importPrice = new Big(current.shoes.importPrice);
                  const quantity = new Big(current.quantity);
                  const niemYet = importPrice.mul(quantity);
                  return pre.plus(niemYet);
                }, new Big(0))
                .toNumber()
            )}
          </Typography>
          <Typography>
            Tổng số sản phẩm:{" "}
            {temporaryDetailOrder.reduce(
              (pre, current) => current.quantity + pre,
              0
            )}
          </Typography>
        </Box>
        <Controller
          name={"note"}
          control={editImportOrderForm.control}
          render={({ field }) => (
            <TextField
              disabled={!editing}
              label={"Ghi chú"}
              sx={{ width: "550px" }}
              {...field}
            ></TextField>
          )}
        />
        <Box sx={{ marginY: "25px" }}>
          <Button
            sx={{ opacity: editing ? 1 : 0 }}
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={handleOpenShoesSearchDialog}
          >
            Thêm mới
          </Button>
          <ImportShoesSearchDialog
            open={openShoesSearchDialog}
            onClose={handleCloseShoesSearchDialog}
            onItemSelected={handleAddShoes}
          ></ImportShoesSearchDialog>
        </Box>
        <Stack sx={{ marginY: "25px", minHeight: "275px" }} gap={5}>
          {temporaryDetailOrder.map((detail) => (
            <LazyDetailImportOrderItem
              disabled={!editing}
              key={detail.shoesId}
              {...detail.shoes}
              price={detail.shoes.importPrice}
              quantity={detail.quantity}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
        <OptionDial ariaLabel="Tuỳ chọn" options={options} />
      </Box>
    </Box>
  );
};

DetailImportOrderPage.layout = "manager";
DetailImportOrderPage.auth = {
  role: ["admin", "employee"],
};
export default DetailImportOrderPage;
