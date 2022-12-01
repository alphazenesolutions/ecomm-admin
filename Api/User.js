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

export const Completedorder = async (data) => {
  var Completedorder = await User.post(`/Completedorder`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Completedorder;
};

export const Pendingorder = async (data) => {
  var Pendingorder = await User.post(`/Pendingorder`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Pendingorder;
};

export const Processingorder = async (data) => {
  var Processingorder = await User.post(`/Processingorder`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Processingorder;
};

export const Cancelorder = async (data) => {
  var Cancelorder = await User.post(`/Cancelorder`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Cancelorder;
};


export const Checkpassword = async (data) => {
  var Checkpassword = await User.post(`/checkpassword`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Checkpassword;
};

export const Viewuser = async (data) => {
  var Viewuser = await User.post(`/viewUser`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return Viewuser;
};

export const updatePassword = async (data) => {
  var updatePassword = await User.post(`/updatepassword`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return updatePassword;
};