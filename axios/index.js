import axios from "axios";

export const User = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/users`,
});

export const Store = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/store`,
});

export const Product = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/product`,
});

export const Category = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/category`,
});

export const Variation = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/variation`,
});

export const Gallery = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/gallery`,
});

export const Orders = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/order`,
});

export const CategoryType = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/categorytype`,
});

export const Journal = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/journal`,
});

export const Coverimg = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/coverimg`,
});

export const Theme = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/theme`,
});

export const Userelements = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/userelements`,
});

export const Navbar = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/navbar`,
});

export const About = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/about`,
});

export const Coupon = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/coupon`,
});

export const Address = axios.create({
  baseURL: `https://e-comme-api.herokuapp.com/address`,
});

// https://e-comme-api.herokuapp.com
