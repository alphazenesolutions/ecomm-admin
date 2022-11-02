import { Store } from "../axios/index";

export const CreateStore = async (data) => {
  var createstore = await Store.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createstore;
};

export const UpdateStore = async (data) => {
  var UpdateStore = await Store.post(`/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateStore;
};

export const SingleStore = async (data) => {
  var SingleStore = await Store.post(`/viewbyuser`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return SingleStore;
};
export const AllStore = async (data) => {
  var AllStore = await Store.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return AllStore;
};


export const viewStore = async (data) => {
  var viewStore = await Store.post(`/view`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return viewStore;
};