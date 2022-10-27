import { Userelements } from "../axios/index";

export const CreateUserelements = async (data) => {
  var createUserelements = await Userelements.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createUserelements;
};

export const allUserelements = async (data) => {
  var allUserelements = await Userelements.get(`/viewall`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return allUserelements;
};


export const ViewElements = async (data) => {
  var UpdateUserelements = await Userelements.post(`/view`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateUserelements;
};

export const UpdateUserelements = async (data) => {
  var UpdateUserelements = await Userelements.post(`/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateUserelements;
};

export const DeleteUserelements = async (data) => {
  var DeleteUserelements = await Userelements.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return DeleteUserelements;
};
