import { CategoryType } from "../axios/index";

export const Creatcategorytype = async (data) => {
  var creatcategorytype = await CategoryType.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return creatcategorytype;
};

export const Allcategorytype = async () => {
  var Allcategorytype = await CategoryType.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Allcategorytype;
};

export const Deltecategorytype = async (data) => {
  var deltecategorytype = await CategoryType.post(`/destroy`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return deltecategorytype;
};


