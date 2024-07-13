import {createAsyncThunk} from "@reduxjs/toolkit";
import {userActions} from "./actionTypes.ts";
import UsersService from "./service.ts";
import {User, Settings} from "../../interfaces.ts";

export const getAuthdUserAsync = createAsyncThunk(
    userActions.GET_AUTHD_USER,
    async () => {
        return await UsersService.getAuthdUser();
    }
)

export const getUserAsync = createAsyncThunk(
    userActions.GET_USER,
    async() => {
        return await UsersService.getUser("hello");
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
