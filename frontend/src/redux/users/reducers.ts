import {createSlice} from "@reduxjs/toolkit";
import {
    getAuthdUserAsync,
    getUserAsync, getUserBySubAsync,
    getUserByUsernameAsync,
    getUserPictureAsync,
    getUserSettingsAsync,
    putUserAsync, putUserExperienceAsync,
    putUserPictureAsync,
    putUserSettingsAsync
} from "./thunks.ts";
import {User} from "@trek-types/user.ts";

const INITIAL_STATE = {
    self: {},
    settings: {},
    requestedUsers: new Array<User>(),
    error: null
};

const usersSlice = createSlice({
    name: 'users',
    initialState: INITIAL_STATE,
    reducers: {
        clearRequested: (state) => {
            state.requestedUsers = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAuthdUserAsync.fulfilled, (state, action) => {
                state.self = action.payload;
            })
            .addCase(getAuthdUserAsync.rejected, () => {
            })
            .addCase(getUserSettingsAsync.fulfilled, (state, action) => {
                state.self = {...state.self, settings: action.payload};
            })
            .addCase(putUserSettingsAsync.fulfilled, (state, action) => {
                state.self = {...state.self, settings: action.payload};
            })
            .addCase(putUserAsync.fulfilled, (state, action) => {
                state.self = action.payload;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                state.self = {...state.self, ...action.payload};
            })
            .addCase(getUserByUsernameAsync.fulfilled, (state, action) => {
                const existingUserIndex = state.requestedUsers.findIndex(user => user._id === action.payload._id);

                if (existingUserIndex !== -1) {
                    state.requestedUsers[existingUserIndex] = action.payload;
                } else {
                    state.requestedUsers.push(action.payload);
                }
            })
            .addCase(getUserBySubAsync.fulfilled, (state, action) => {
                const existingUserIndex = state.requestedUsers.findIndex(user => user._id === action.payload._id);

                if (existingUserIndex !== -1) {
                    state.requestedUsers[existingUserIndex] = action.payload;
                } else {
                    state.requestedUsers.push(action.payload);
                }
            })
            .addCase(putUserExperienceAsync.fulfilled, (state, action) => {
                // self.experience causes build error, temp do below
                void action;
                void state;
            })
            .addCase(getUserPictureAsync.fulfilled, (state, action) => {
                state.self = {...state.self, ...action.payload};
            })
            .addCase(putUserPictureAsync.fulfilled, (state, action) => {
                state.self = {...state.self, ...action.payload};
            })
    }
});

export const {clearRequested} = usersSlice.actions;
export default usersSlice.reducer;
