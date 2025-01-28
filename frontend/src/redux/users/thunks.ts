import {createAsyncThunk} from "@reduxjs/toolkit";
import {userActions} from "./actionTypes.ts";
import UsersService from "./service.ts";
import {User, Settings, UserExperience} from "@trek-types/user.ts";

export const getAuthdUserAsync = createAsyncThunk(
    userActions.GET_AUTHD_USER,
    async (args: { token: string, subtoken: string, name: string, email: string, picture: string }) => {
        return await UsersService.getAuthdUser(args.token, args.subtoken, args.name, args.email, args.picture);
    }
)

export const getUserAsync = createAsyncThunk(
    userActions.GET_USER,
    async (payload: { token: string }) => {
        return await UsersService.getAuthorizedUserAsync(payload.token);
    }
)

export const getUserByUsernameAsync = createAsyncThunk(
    userActions.GET_USERNAME,
    async (username: string) => {
        return await UsersService.getUser(username);
    }
)

export const getUserSettingsAsync = createAsyncThunk(
    userActions.GET_SETTINGS,
    async (token: string) => {
        return await UsersService.getUserSettings(token);
    }
)

export const putUserAsync = createAsyncThunk(
    userActions.PUT_USER,
    async (user: User) => {
        return await UsersService.putUser(user);
    }
)

export const putUserSettingsAsync = createAsyncThunk(
    userActions.PUT_SETTINGS,
    async (payload: { token: string, settings: Settings }) => {
        return await UsersService.putUserSettings(payload.token, payload.settings);
    }
)

export const getUserBySubAsync = createAsyncThunk(
    userActions.GET_USER_BY_ID,
    async (sub: string) => {
        return await UsersService.getUserBySub(sub);
    }
)

export const putUserExperienceAsync = createAsyncThunk(
    userActions.PUT_USER_EXPERIENCE,
    async (payload: { token: string, exp: UserExperience }) => {
        return await UsersService.putUserExperience(payload.token, payload.exp);
    }
)

export const getUserPictureAsync = createAsyncThunk(
    userActions.GET_USER_PICTURE,
    async (payload: { token: string }) => {
        return await UsersService.getUserPicture(payload.token);
    }
);

export const putUserPictureAsync = createAsyncThunk(
    userActions.PUT_USER_PICTURE,
    async (payload: { token: string, data: FormData }) => {
        return await UsersService.putUserPicture(payload.token, payload.data);
    }
);
