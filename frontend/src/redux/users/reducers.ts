import {createSlice} from "@reduxjs/toolkit";
import {
    getAuthdUserAsync,
    getUserAsync, getUserByIDAsync,
    getUserByUsernameAsync,
    getUserSettingsAsync,
    putUserAsync, putUserExperienceAsync,
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
                state.settings = action.payload;
            })
            .addCase(putUserSettingsAsync.fulfilled, (state, action) => {
                if (action.payload.accountLimitedDeals !== undefined && action.payload.accountNewsletterNotifications !== undefined)
                    state.settings = action.payload;
            })
            .addCase(putUserAsync.fulfilled, (state, action) => {
                state.self = action.payload;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                const user = action.payload as unknown as User; // FIXME: do this with proper type checking instead
                state.requestedUsers.push(user);
            })
            .addCase(getUserByUsernameAsync.fulfilled, (state, action) => {
                const existingUserIndex = state.requestedUsers.findIndex(user => user._id === action.payload._id);

                if (existingUserIndex !== -1) {
                    state.requestedUsers[existingUserIndex] = action.payload;
                } else {
                    state.requestedUsers.push(action.payload);
                }
            })
            .addCase(getUserByIDAsync.fulfilled, (state, action) => {
                const existingUserIndex = state.requestedUsers.findIndex(user => user._id === action.payload._id);

                if (existingUserIndex !== -1) {
                    state.requestedUsers[existingUserIndex] = action.payload;
                } else {
                    state.requestedUsers.push(action.payload);
                }
            })
            .addCase(putUserExperienceAsync.fulfilled, (state, action) => {
                // state.self.experience = action.payload;
                // self.experience causes build error, temp do below
                console.log(action.payload);
                void state;
                // (state.self as User).experience = action.payload;
            })
    }
});

export const { clearRequested } = usersSlice.actions;
export default usersSlice.reducer;
