import {User, Settings} from "../../interfaces.ts";

const API_URL = 'http://localhost:3000/api/v1/';

const getAuthdUser = async() => {
    const response = await fetch(`${API_URL}users/hello`, {
        method: 'GET'
    });
    return response.json();
}

const getUser = async(username: string) => {
    const response = await fetch(`${API_URL}users/${username}`, {
        method: 'GET'
    });
    return response.json();
}

const getUserSettings = async() => {
    const response = await fetch(`${API_URL}users/settings`, {
        method: 'GET'
    });
    return response.json();
}

const putUser = async(user: User) => {
    const response = await fetch(`${API_URL}users/${user.username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    return await response.json();
}

const putUserSettings = async(username: string, settings: Settings) => {
    const response = await fetch(`${API_URL}users/${username}/settings`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });
    return await response.json();
}

export default {
    getAuthdUser,
    getUser,
    getUserSettings,
    putUser,
    putUserSettings
}
