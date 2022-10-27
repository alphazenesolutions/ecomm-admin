import { Orders } from "../axios/index";

export const AllOrders = async () => {
  var AllOrders = await Orders.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return AllOrders;
};
