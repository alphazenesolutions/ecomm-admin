import { Address } from "../axios/index";

export const CreatAddress = async (data) => {
  var creatAddress = await Address.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return creatAddress;
};

export const AllAddress = async () => {
  var AllAddress = await Address.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return AllAddress;
};

export const DelteAddress = async (data) => {
  var delteAddress = await Address.post(`/destroy`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return delteAddress;
};


