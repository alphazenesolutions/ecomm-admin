import { Theme } from "../axios/index";

export const allTheme = async () => {
  var allTheme = await Theme.get(`/viewall`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  return allTheme;
};
