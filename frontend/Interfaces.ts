export interface State {
    account: Account,
    profile: Profile,
    trip: Trip
}

export interface Account {
    accountLimitedDeals: boolean,
    accountNewsletterNotifications: boolean
}

export interface Profile {
    profileUsername: string,
    profilePicture: string,
    profileName: string,
    profileEmail: string,
    profileHome: string,
    profileCurrentLocation: string,
    profileBio: string,
    profileInterests: string[],
    socialAccounts: {
        Facebook: string,
        Instagram: string,
        Twitter: string,
        Youtube: string
    }
}

export interface Trip {
    tripName: string,
    tripDescription: string,
    tripDestination: string,
    tripDateRange: string,
    tripBudget: { low: string, high: string },
    tripImageStore: string[],
    tripTravellers: [],
    tripTodoList: string[],
    // TODO move to tripMapReducer?
    tripNotes: string,
    tripLocations: [
        {
            title: string,
            address: string,
            date: {start: number, end: number},
            transportation: {
                type: string,
                distance: number,
                time: number,
                cost: number
            }
        }
    ]
}
