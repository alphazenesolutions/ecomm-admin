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


export const viewGallery = async (data) => {
  var viewGallery = await Gallery.post(`/view`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return viewGallery;
};

export const destroyGallery = async (data) => {
  var destroyGallery = await Gallery.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return destroyGallery;
};