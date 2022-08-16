import { v4 as uuidv4 } from "uuid";
const orderStatusList = [
  {
    id: uuidv4(),
    title: "Chờ xác nhận",
    value: "wait_for_confirmation",
  },
  {
    id: uuidv4(),
    title: "Đã xác nhận",
    value: "confirmed",
  },
  {
    id: uuidv4(),
    title: "Đang vận chuyển",
    value: "delivering",
  },
  {
    id: uuidv4(),
    title: "Giao hàng thành công",
    value: "received",
  },
  {
    id: uuidv4(),
    title: "Bị huỷ",
    value: "canceled",
  },
];
export default orderStatusList;
