import { Product } from "../axios/index";

export const CreateProduct = async (data) => {
  var createproduct = await Product.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createproduct;
};

export const Allproduct = async () => {
  var Allproduct = await Product.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Allproduct;
};

export const Singleproduct = async (data) => {
  var Singleproduct = await Product.post(`/view`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Singleproduct;
};

export const Updateproduct = async (data) => {
  var Updateproduct = await Product.post(`/update`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Updateproduct;
};
