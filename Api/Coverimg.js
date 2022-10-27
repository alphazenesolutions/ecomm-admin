import { Coverimg } from "../axios/index";

export const CreateCoverimg = async (data) => {
  var createCoverimg = await Coverimg.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createCoverimg;
};

export const allCoverimg = async (data) => {
  var allCoverimg = await Coverimg.get(`/viewall`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return allCoverimg;
};

export const UpdateCoverimg = async (data) => {
  var UpdateCoverimg = await Coverimg.post(`/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateCoverimg;
};

export const DeleteCoverimg = async (data) => {
  var DeleteCoverimg = await Coverimg.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return DeleteCoverimg;
};
