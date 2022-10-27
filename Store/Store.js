import { configureStore, createSlice } from "@reduxjs/toolkit";

const StoreSlice = createSlice({
  name: "Store",
  initialState: {
    storeid: 1,
    user_id: 1,
  },
  reducers: {
    storeidHandler(state, payload) {
      state.storeid = payload.payload.store_id;
    },
    useridHandler(state, payload) {
      state.user_id = payload.payload.userId;
    },
  },
});

export const storeAction = StoreSlice.actions;
const Store = configureStore(StoreSlice);
export default Store;
