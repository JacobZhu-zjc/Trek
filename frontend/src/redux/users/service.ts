import {User, Settings, UserExperience} from "@trek-types/user.ts";
import {jwtDecode} from 'jwt-decode'

const hostname = import.meta.env.PROD ? window.location.origin : "http://localhost:3000"
const API_URL = `${hostname}/api/v1/`;


const getAuthdUser = async(token: string, subtoken: string, name: string, email: string, picture: string) => {
    const response = await fetch(`${API_URL}users/fetch-user`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            sub: subtoken,
            name: name,
            email: email,
            image: picture,
        })
    });
    if (response.ok) {
        return await response.json();
    }
    return Promise.reject("not authenitcated");
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
    const response = await fetch(`${API_URL}users/${user.sub}`, {
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

const getUserByID = async(uuid: string) => {
    const response = await fetch(`${API_URL}users/id/${uuid}`, {
        method: 'GET',
    });
    return await response.json();
}

const putUserExperience = async(token: string, exp: UserExperience) => {
    const decoded = jwtDecode(token);
    const sub = decoded["sub"];
    const response = await fetch(`${API_URL}users/${sub}/experience`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exp)
    });
    return await response.json();
}

export default {
    getAuthdUser,
    getUser,
    getUserSettings,
    putUser,
    putUserSettings,
    getUserByID,
    putUserExperience
}
