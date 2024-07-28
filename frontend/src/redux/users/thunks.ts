import {createAsyncThunk} from "@reduxjs/toolkit";
import {userActions} from "./actionTypes.ts";
import UsersService from "./service.ts";
import {User, Settings, UserExperience} from "@trek-types/user.ts";

export const getAuthdUserAsync = createAsyncThunk(
    userActions.GET_AUTHD_USER,
    async (args: {token: string, subtoken: string, name: string, email: string, picture: string}) => {
        return await UsersService.getAuthdUser(args.token, args.subtoken, args.name, args.email, args.picture);
    }
)

export const getUserAsync = createAsyncThunk(
    userActions.GET_USER,
    async () => Promise.reject("Not implemented") // TODO: reimplement with sub tokens
    // async() => {
    //     return await UsersService.getUser();
    // }
)

export const getUserByUsernameAsync = createAsyncThunk(
    userActions.GET_USERNAME,
    async (username: string) => {
        return await UsersService.getUser(username);
    }
)

export const getUserSettingsAsync = createAsyncThunk(
    userActions.GET_SETTINGS,
    async () => {
        return await UsersService.getUserSettings();
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
    async (payload: {username: string, settings: Settings}) => {
        return await UsersService.putUserSettings(payload.username, payload.settings);
    }
)

export const getUserByIDAsync = createAsyncThunk(
    userActions.GET_USER_BY_ID,
    async (uuid: string) => {
        return await UsersService.getUserByID(uuid);
    }
)

export const putUserExperienceAsync = createAsyncThunk(
    userActions.PUT_USER_EXPERIENCE,
    async (payload: {token: string, exp: UserExperience}) => {
        return await UsersService.putUserExperience(payload.token, payload.exp);
    }
)
