import { Journal } from "../axios/index";

export const CreateJournal = async (data) => {
  var createJournal = await Journal.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createJournal;
};

export const allJournal = async (data) => {
  var allJournal = await Journal.get(`/viewall`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return allJournal;
};

export const UpdateJournal = async (data) => {
  var UpdateJournal = await Journal.post(`/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return UpdateJournal;
};

export const DeleteJournal = async (data) => {
  var DeleteJournal = await Journal.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return DeleteJournal;
};
