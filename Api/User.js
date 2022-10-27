import { User } from "../axios/index";

export const CreateUser = async (data) => {
  var createuser = await User.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createuser;
};

export const LoginUser = async (data) => {
  var loginuser = await User.post(`/login`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return loginuser;
};

export const Allusers = async () => {
  var Allusers = await User.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Allusers;
};

export const Myorder = async (data) => {
  var Myorder = await User.post(`/myorder`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Myorder;
};
export const Myorder_store = async (data) => {
  var Myorder_store = await User.post(`/Myorder_store`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Myorder_store;
};
