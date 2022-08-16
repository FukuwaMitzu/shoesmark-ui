const weeklyMapper = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];
const monthlyMapper = Array.from(
  (function* () {
    for (let i = 1; i <= 31; i++) {
      yield i;
    }
  })()
).map((data) => `Ngày ${data}`);

const yearlyMapper = Array.from(
  (function* () {
    for (let i = 1; i <= 12; i++) {
      yield i;
    }
  })()
).map((data) => `Tháng ${data}`);

function dateMapper(time: number, duration: "monthly" | "yearly" | "weekly") {
  switch (duration) {
    case "monthly":
      return monthlyMapper[time];
    case "yearly":
      return yearlyMapper[time];
    case "weekly":
      return weeklyMapper[time];
  }
}
export const dateLabels = (duration: "monthly" | "yearly" | "weekly")=>{
  switch (duration) {
    case "monthly":
      return monthlyMapper;
    case "yearly":
      return yearlyMapper;
    case "weekly":
      return weeklyMapper;
  }
}
export default dateMapper;
