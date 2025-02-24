import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  allReviews: [],
};

export const addReview = createAsyncThunk("review/addReview", async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
      data
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/get/${productId}`
    );
    return response.data;
  }
);

export const getAllReviews = createAsyncThunk(
  "review/getAllReviews",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/all`
    );
    console.log("API Response:", response.data);
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allReviews = action.payload.data;
      })
      .addCase(getAllReviews.rejected, (state) => {
        state.isLoading = false;
        state.allReviews = [];
      });
  },
});

export default reviewSlice.reducer;
