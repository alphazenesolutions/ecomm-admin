import React from "react";
import Image from "next/image";

const Home_ = () => {
  const loginHandler = () => {
    window.location.replace("/login");
  };
  return (
    <div>
      <div className="fixed w-full flex items-center justify-between pl-8 pr-8 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex pr-6 pt-6  pb-6 items-center 	">
            <Image src="/logo.png" alt="Logo" width={65} height={65} />
            <div>
              <h2 className="text-3xl font-thin text-black-1000">Ecwid</h2>
            </div>
          </div>
          <div className="flex justify-between 	">
            <p className="font-bold ml-8">Sell</p>
            <p className="font-bold ml-8">Market</p>
            <p className="font-bold ml-8">Manage</p>
          </div>
        </div>
        <div className="flex items-center ">
          <div className="flex justify-between">
            <p className="font-normal ml-8">Learn</p>
            <p className="font-normal ml-8">Pricing</p>
            <p onClick={loginHandler} className="font-normal ml-8">
              Login
            </p>
          </div>
          <button
            onClick={loginHandler}
            className="bg-black-500 text-white-1000 p-4 ml-8"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home_;
