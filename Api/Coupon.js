import { Coupon } from "../axios/index";

export const CreateCoupon = async (data) => {
  var createCoupon = await Coupon.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createCoupon;
};

export const allCoupon = async (data) => {
  var allCoupon = await Coupon.get(`/viewall`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return allCoupon;
};

export const UpdateCoupon = async (data) => {
  var UpdateCoupon = await Coupon.post(`/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateCoupon;
};

export const DeleteCoupon = async (data) => {
  var DeleteCoupon = await Coupon.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return DeleteCoupon;
};
