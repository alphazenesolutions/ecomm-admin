import { Variation } from "../axios/index";

export const CreateVariation = async (data) => {
  var createVariation = await Variation.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createVariation;
};


export const viewVariation = async (data) => {
  var viewVariation = await Variation.post(`/view`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return viewVariation;
};


export const destroyVariation = async (data) => {
  var destroyVariation = await Variation.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return destroyVariation;
};
