import {Trip} from "@trek-types/trip.ts";

const hostname = import.meta.env.PROD ? window.location.origin : "http://localhost:3000"
const API_URL = `${hostname}/api/v1/`;


const getTrips = async({token}: {token: string}) => {
    console.log("token is " + token)
    const response = await fetch(`${API_URL}trips`, {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.json();
};

const getTrip = async ({ uuid, token }: { uuid: string, token: string }) => {
    console.log("Attempting to get trip of uuid " + uuid);
    console.log("Gettrip: token is", token);
    const response = await fetch(`${API_URL}trips/${uuid}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
    });
    return await response.json();
};

const getMap = async ({ uuid, token }: { uuid: string, token: string }) => {
    const response = await fetch(`${API_URL}trips/${uuid}/map`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
    });
    return await response.json();
};

const putTrip = async(uuid: string, token: string, trip: Trip) => {
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


const postTrip = async(token: string, data: object) => {
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

const deleteTrip = async(token: string, tripUUID: string) => {
    const response = await await fetch(`${API_URL}trips/${tripUUID}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return await response.json();
};

// const getPhoto = async(s3Key: string, tripUUID: string) => {
//     const response = await fetch(`${API_URL}trips/s3/${s3Key}`, {
//         method: 'GET'
//     });
//     return {photo: await response.json(), tripUUID: tripUUID};
// }

// UUID is user uuid
const populateTripUsers = async(userSub: string, tripUUID: string) => {
    const response = await fetch(`${API_URL}users/id/${userSub}`, {
        method: 'GET'
    });
    const data = await response.json();
    const basicUser = {
        _id: data._id,
        name: data.name,
        username: data.username,
        profilePicture: data.image,
        email: data.email,
    }
    console.log(basicUser);
    return {tripUUID: tripUUID, user: basicUser};
}



// const getPhoto = async(s3Key: string, tripUUID: string) => {
//     const response = await fetch(`${API_URL}trips/s3/${s3Key}`, {
//         method: 'GET'
//     });
//     return {photo: await response.json(), tripUUID: tripUUID};
// }

export default {
    getTrips,
    getTrip,
    putTrip,
    getMap,
    populateTripUsers,
    // getPhoto,
    postTrip,
    deleteTrip,
}
