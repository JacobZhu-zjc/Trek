import {Trip} from "../../interfaces.ts";

const API_URL = 'http://localhost:3000/api/v1/';
const getTrips = async() => {
    const response = await fetch(`${API_URL}trips`, {
        method: 'GET'
    });
    return response.json();
};

const getTrip = async(uuid: string) => {
    const response = await fetch(`${API_URL}trips/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return await response.json();
}

const getMap = async(uuid: string) => {
    const response = await fetch(`${API_URL}trips/${uuid}/map`, {
        method: 'GET'
    });
    return await response.json();
}

const putTrip = async(uuid: string, trip: Trip) => {
    const response = await fetch(`${API_URL}trips/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trip)
    });
    return await response.json();
}

export default {
    getTrips,
    getTrip,
    putTrip,
    getMap
}
