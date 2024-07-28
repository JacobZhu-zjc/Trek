interface Settings {
    [key: string]: boolean;
    accountLimitedDeals: boolean,
    accountNewsletterNotifications: boolean
    privateAccount: boolean
}
interface User {
    sub: string,
    name: string,
    username: string,
    interests: string[],
    image: {
        photo: string,
        _id: string
    },
    links: {
        type: string,
        url: string
    }[],
    description: string,
    currentlyAt: string,
    home: string,
    email: string,
    trips: string[]
}

interface Date {
    start: number,
    end: number
}

interface Transportation {
    type: string,
    distance: number,
    time: number,
    cost: number
}

interface Location {
    title: string,
    address: string,
    date: Date,
    transportation: Transportation
}

interface Map {
    notes: string,
    locations: Location[]
}

interface Budget {
    low: number,
    high: number
}

interface Trip {
    _id: string,
    name: string,
    desc: string,
    destination: string,
    dest: string[],
    notes: string,
    budget: Budget,
    date: {start: number, end: number},
    todo: string[],
    url: string,
    owner: string,
    members: string[],
    private: boolean,
    expenditures: [],
    image: string | {_id: string, source: string},
    destinations: {
        title: string,
        address: string,
        date: {start: number, end: number},
        transportation: {
            type: string,
            distance: number,
            time: number,
            cost: number
        }
    }[], // TODO define destinations
    map: Map
}

export type {Settings, User, Trip, Budget}
