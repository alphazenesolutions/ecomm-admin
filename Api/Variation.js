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
