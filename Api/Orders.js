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

export const UpdateOrders = async (data) => {
  var UpdateOrders = await Orders.post(`/update`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateOrders;
};