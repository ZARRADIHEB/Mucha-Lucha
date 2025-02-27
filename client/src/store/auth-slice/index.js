import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  allUsers: [],
};

// Register
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "An error occurred" };
    }
  }
);

// Login
export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
});

// Logout
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
});

// Forget password
export const forgetPassword = createAsyncThunk(
  "/auth/forget-password",
  async (email) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forget-password`,
        email
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "An error occurred" };
    }
  }
);

// OTP verification
export const otpVerification = createAsyncThunk(
  "/auth/otp-verify",
  async ({ otp, email }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/otp-verify`,
        { otp, email }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "An error occurred" };
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        formData
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "An error occurred" };
    }
  }
);

// Check auth
export const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  const { pathname } = window.location;
  if (pathname === "/") {
    return { success: false };
  }
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,

      {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-store,no-cache,must-revalidate,proxy-revalidate",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
});

export const getAllUsers = createAsyncThunk("/auth/allUsers", async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/allUsers`
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.allUsers = [];
      })

      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgetPassword.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(otpVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(otpVerification.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(otpVerification.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
