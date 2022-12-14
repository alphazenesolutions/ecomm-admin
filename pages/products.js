import Head from "next/head";
import React from "react";
import Products_ from "../components/Products_";

const products = () => {
  return (
    <div>
      <Head>
        <title>E-commerce | My Products</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Products_ />
    </div>
  );
};

export default products;
