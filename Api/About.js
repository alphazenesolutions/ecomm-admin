import { About } from "../axios/index";

export const CreateAbout = async (data) => {
  var createAbout = await About.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createAbout;
};


export const viewAbout = async (data) => {
  var viewAbout = await About.post(`/view`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return viewAbout;
};

export const destroyAbout = async (data) => {
  var destroyAbout = await About.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return destroyAbout;
};

export const updateAbout = async (data) => {
    var updateAbout = await About.post(`/update`, data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response;
      });
    return updateAbout;
  };