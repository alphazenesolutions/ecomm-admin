import { Navbar } from "../axios/index";

export const createNavbar = async (data) => {
  var createNavbar = await Navbar.post(`/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return createNavbar;
};

export const allnavbar = async (data) => {
  var allnavbar = await Navbar.get(`/viewall`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return allnavbar;
};

export const updateNavbar = async (data) => {
  var updateNavbar = await Navbar.post(`/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return updateNavbar;
};

export const deletenavbar = async (data) => {
  var deletenavbar = await Navbar.post(`/destroy`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return deletenavbar;
};
export const SingleNav = async (data) => {
  var SingleNav = await Navbar.post(`/viewbystore`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return SingleNav;
};
