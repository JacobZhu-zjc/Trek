import {User, Settings, UserExperience} from "@trek-types/user.ts";
import {jwtDecode} from 'jwt-decode'

const hostname = import.meta.env.PROD ? window.location.origin : "http://localhost:3000"
const API_URL = `${hostname}/api/v1/`;


const getAuthdUser = async (token: string, subtoken: string, name: string, email: string, picture: string) => {
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
            picture: picture,
        })
    });
    if (response.ok) {
        return await response.json();
    }
    return Promise.reject("not authenticated");
}

const getAuthorizedUserAsync = async (token: string) => {
    const response = await fetch(`${API_URL}users/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return await response.json();
}

const getUser = async (username: string) => {
    const response = await fetch(`${API_URL}users/${username}`, {
        method: 'GET'
    });
    return response.json();
}

const getUserSettings = async (token: string) => {
    const response = await fetch(`${API_URL}users/settings`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer: ${token}`
        }
    });
    return await response.json();
}

const putUser = async (user: User) => {
    const response = await fetch(`${API_URL}users/${user.sub}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    return await response.json();
}

const putUserSettings = async (token: string, settings: Settings) => {
    const subtoken = jwtDecode(token)["sub"];
    const response = await fetch(`${API_URL}users/${subtoken}/settings`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer: ${token}`
        },
        body: JSON.stringify(settings)
    });
    return await response.json();
}

const putUserExperience = async (token: string, exp: UserExperience) => {
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

const getUserBySub = async (subtoken: string) => {
    const response = await fetch(`${API_URL}users/id/${subtoken}`, {
        method: 'GET',
    });
    return await response.json();
}

const getUserByUsername = async (username: string) => {
    const response = await fetch(`${API_URL}users/username/${username}`, {
        method: 'GET',
    });
    return await response.json();
}

const getUserPicture = async (token: string) => {
    const subtoken = jwtDecode(token)["sub"];
    const response = await fetch(`${API_URL}users/${subtoken}/picture`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return await response.json();
};

const putUserPicture = async (token: string, data: FormData) => {
    const subtoken = jwtDecode(token)["sub"];
    const response = await fetch(`${API_URL}users/${subtoken}/picture`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: data,
    });
    return await response.json();
};

export default {
    getAuthdUser,
    getAuthorizedUserAsync,
    getUser,
    getUserSettings,
    putUser,
    putUserSettings,
    getUserBySub,
    putUserExperience,
    getUserByUsername,
    getUserPicture,
    putUserPicture,
}
