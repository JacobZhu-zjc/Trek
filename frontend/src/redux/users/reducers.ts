import {createSlice} from "@reduxjs/toolkit";
import {
    getAuthdUserAsync,
    getUserAsync,
    getUserByUsernameAsync,
    getUserSettingsAsync,
    putUserAsync,
    putUserSettingsAsync
} from "./thunks.ts";
import {User} from "../../interfaces.ts";

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
                // console.log("wahoo")
                state.self = action.payload;
            })
            .addCase(getUserSettingsAsync.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.settings = action.payload;
            })
            .addCase(putUserSettingsAsync.fulfilled, (state, action) => {
                // console.log(action.payload);
                if (action.payload.accountLimitedDeals !== undefined && action.payload.accountNewsletterNotifications !== undefined)
                    state.settings = action.payload;
            })
            .addCase(putUserAsync.fulfilled, (state, action) => {
                state.self = action.payload;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                state.requestedUsers.push(action.payload);
            })
            .addCase(getUserByUsernameAsync.fulfilled, (state, action) => {
                // console.log(action.payload);
                const existingUserIndex = state.requestedUsers.findIndex(user => user._id === action.payload._id);

                if (existingUserIndex !== -1) {
                    state.requestedUsers[existingUserIndex] = action.payload;
                } else {
                    state.requestedUsers.push(action.payload);
                }
            })
    }
});

export const { clearRequested } = usersSlice.actions;
export default usersSlice.reducer;
