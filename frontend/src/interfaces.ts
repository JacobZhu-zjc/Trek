interface Settings {
    [key: string]: boolean;
    accountLimitedDeals: boolean,
    accountNewsletterNotifications: boolean
    privateAccount: boolean
}
interface User {
    _id: string,
    name: string,
    username: string,
    interests: string[],
    image: {
        source: string,
        _id: string
    },
    links: {
        type: string,
        url: string
    }[],
    description: string,
    currentlyAt: string,
    home: string,
    email: string
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

interface Trip {
    _id: string,
    name: string,
    desc: string,
    destination: string,
    dest: string[],
    notes: string,
    budget: {low: number, high: number},
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

export type {Settings, User, Trip}
