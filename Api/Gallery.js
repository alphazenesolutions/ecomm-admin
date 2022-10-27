import { Gallery } from "../axios/index";

export const CreateGallery = async (data) => {
  var createGallery = await Gallery.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createGallery;
};
