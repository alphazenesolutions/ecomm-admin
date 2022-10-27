import axios from "axios";
import React, { useEffect, useState } from "react";
import Nav_ from "./Nav_";
import Sidebar_ from "./Sidebar_";
import Citylist from "./citylist.json";

const Setting_ = () => {
  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    setstatelist(Citylist.states);
  };
  const [statelist, setstatelist] = useState([]);
  const [citylist, setcitylist] = useState([]);
  const handleChangestate = async (e) => {
    var singlestate = await statelist.filter((data) => {
      return data.state === e.target.value;
    });
    setcitylist(singlestate[0].districts);
    setstate(e.target.value);
  };
  const handleChangecity = (e) => {
    setcity(e.target.value);
  };
  return (
    <div className="flex ">
      <Sidebar_ />
      <div className="w-full">
        <Nav_ />
        <div className="w-full p-8 Dashboard">
          <h1>Store Setting</h1>
          <div>
            <div className="Store_setting">
              <div className="w-9/12 m-auto	items-center">
                <div>
                  <div className="shadow-lg p-8">
                    <h1 className="font-bold	mb-4">
                      Get a head start on your store setup.
                    </h1>
                    {/* {imagurl !== null ? (
                      <img src={imagurl} width="140px" height="60" />
                    ) : null} */}
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="What’s your store name?"
                      name="storename"
                      type="file"
                      //   onChange={geturl}
                    />
                    <form>
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="What’s your store name?"
                        name="storename"
                        type="text"
                      />
                      {/* {formik.errors.storename ? (
                        <div className="text-red-500">
                          {formik.errors.storename}
                        </div>
                      ) : null} */}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Domain"
                        name="storename"
                        type="text"
                      />
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Pin code"
                        name="pincode"
                        type="number"
                      />
                      {/* {formik.errors.pincode ? (
                        <div className="text-red-500">
                          {formik.errors.pincode}
                        </div>
                      ) : null} */}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Country"
                        name="country"
                        value="INDIA"
                        type="text"
                        disabled
                      />
                      {/* {formik.errors.country ? (
                        <div className="text-red-500">
                          {formik.errors.country}
                        </div>
                      ) : null} */}
                      <select
                        className="border w-full mb-2 p-3 rounded"
                        onChange={handleChangestate}
                      >
                        <option>Select State</option>
                        {statelist.length !== 0
                          ? statelist.map((data, index) => (
                              <option value={data.state} key={index}>
                                {data.state}
                              </option>
                            ))
                          : null}
                      </select>

                      <select
                        className="border w-full mb-2 p-3 rounded"
                        onChange={handleChangecity}
                      >
                        <option>Select City</option>
                        {citylist.length !== 0
                          ? citylist.map((data, index) => (
                              <option value={data} key={index}>
                                {data}
                              </option>
                            ))
                          : null}
                      </select>
                      {/* {formik.errors.city ? (
                        <div className="text-red-500">{formik.errors.city}</div>
                      ) : null} */}
                      <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                        Update
                      </button>
                    </form>
                  </div>
                  <div className="shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting_;
