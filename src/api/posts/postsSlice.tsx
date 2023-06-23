import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import postsApi from "../postsApi";
import {
  handleErrorRequest,
  handleSuccessRequest,
} from "../../utlis/handle_errors";

export const getPosts = createAsyncThunk("post/getPosts", async () => {

  try {
    const response = await postsApi.get(`/posts`);
    return response?.data;
  } catch (err: any) {
    return err;
  }
});
export const createPosts = createAsyncThunk(
  "post/createPosts",
  async (data: any | null, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await postsApi.post(`/posts`, data);
      handleSuccessRequest("Post Created Successfully");
      return response.data;
    } catch (err: any) {
      handleErrorRequest("Somthing Wrong!");
      return rejectWithValue(err);
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ id, data }: any, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await postsApi.put(`/posts/${id}`, data);
      handleSuccessRequest("Post Updated Successfully");
      return response.data;
    } catch (err: any) {
      handleErrorRequest("Somthing Wrong!");
      return rejectWithValue(err);
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id: number | null, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await postsApi.delete(`/posts/${id}`);
      handleSuccessRequest("Post deleted Successfully");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);
interface PostState {
  data: any;
  loading: boolean;
  error: string | null;
}
const initialState: PostState = {
  data: null,
  loading: false,
  error: null,
};
const PostsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        state.data = action.payload;
      })
      .addCase(getPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload.message) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload.message;
        }
      })
      //
      .addCase(createPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPosts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      //
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});
export default PostsSlice.reducer;
