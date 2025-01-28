import {Trip} from "@trek-types/trip.ts";

const hostname = import.meta.env.PROD ? window.location.origin : "http://localhost:3000"
const API_URL = `${hostname}/api/v1/`;


const getTrips = async ({token}: { token: string }) => {
    const response = await fetch(`${API_URL}trips`, {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.json();
};

const getTripsPaginated = async ({token, pageNum}: { token: string, pageNum: number }) => {
    const response = await fetch(`${API_URL}trips/paginated?` + new URLSearchParams({"page": String(pageNum)}).toString(), {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.json();
};

const getTrip = async ({uuid, token}: { uuid: string, token: string }) => {
    const response = await fetch(`${API_URL}trips/${uuid}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    return await response.json();
};

const getMap = async ({uuid, token}: { uuid: string, token: string }) => {
    const response = await fetch(`${API_URL}trips/${uuid}/map`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    return await response.json();
};

const putTrip = async (uuid: string, token: string, trip: Trip) => {
    const response = await fetch(`${API_URL}trips/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trip)
    });
    return await response.json();
};

const postTrip = async (token: string, data: object) => {
    const response = await fetch(`${API_URL}trips/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    return await response.json();
};

const putManagement = async (token: string, tripUUID: string, data: object) => {
    const response = await fetch(`${API_URL}trips/${tripUUID}/management`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const deleteTrip = async (token: string, tripUUID: string) => {
    const response = await await fetch(`${API_URL}trips/${tripUUID}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return await response.json();
};

// UUID is user uuid
const populateTripUsers = async (userSub: string, tripUUID: string) => {
    const response = await fetch(`${API_URL}users/id/${userSub}`, {
        method: 'GET'
    });
    const data = await response.json();
    const basicUser = {
        _id: data._id,
        sub: data.sub,
        name: data.name,
        username: data.username,
        image: data.image,
        uploadedProfilePictureURL: data.uploadedProfilePictureURL,
        email: data.email,
    }
    return {tripUUID: tripUUID, user: basicUser};
}

const getPhotos = async (tripUUID: string) => {
    const response = await fetch(`${API_URL}trips/${tripUUID}/picture`, {
        method: 'GET'
    });
    return await response.json();
}

const putPhotos = async (token: string, tripUUID: string, data: FormData) => {
    const response = await fetch(`${API_URL}trips/${tripUUID}/picture`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: data,
    });
    return await response.json();
}

export default {
    getTrips,
    getTripsPaginated,
    getTrip,
    putTrip,
    getMap,
    populateTripUsers,
    getPhotos,
    putPhotos,
    postTrip,
    putManagement,
    deleteTrip,
}
