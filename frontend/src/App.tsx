import {Routes, Route, Navigate} from "react-router-dom";
import LandingPageApp from "./pages/LandingPage/LandingPageApp.tsx";
import AccountSettingsApp from "./pages/AccountSettings/AccountSettingsApp";
import TripSettingsApp from "./pages/TripSettings/TripSettingsApp.tsx";
import TripTimelineApp from "./pages/TripTimeline/TripTimelineApp";
import UserProfileApp from "./pages/UserProfile/UserProfileApp";
import './App.css';
import {createTheme, MantineProvider} from '@mantine/core';
import {ModalsProvider} from "@mantine/modals";
import SettingsAppShell from "./components/appshells/SettingsAppShell";
import ProfileSettingsApp from "./pages/ProfileSettings/ProfileSettingsApp";
import MainAppShell from "./components/appshells/MainAppShell.tsx";
import ErrorBoundary from "./pages/FallBack/FallBackApp";
import TripMapApp from "./pages/TripMap/TripMapApp.tsx";
import TripOverviewApp from "./pages/TripOverview/TripOverviewApp.tsx";
import Error404App from "./pages/Error404Page/Error404App.tsx";
import TripAppShell from "./components/appshells/TripAppShell.tsx";
import ExperienceSettingsApp from "./pages/ExperienceSettings/ExperienceSettingsApp.tsx";
import TempPageApp from "./pages/TempPage/TempPageApp.tsx";
import CreateTripApp from "./pages/CreateTrip/CreateTripApp.tsx";
import ExploreAreaApp from "./pages/ExploreArea/ExploreAreaApp.tsx";
import ExploreAreaPreviewApp from "./pages/ExploreArea/ExploreAreaPreviewApp.tsx";
import {useEffect, createContext, useState, useMemo} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {AuthenticationGuard} from "./components/AuthenticationGuard";
import {useDispatch} from "react-redux";
import {getAuthdUserAsync} from "./redux/users/thunks.ts"
import {AppDispatch} from "./redux/store.ts";
import Error401App from "./pages/Error401Page/Error401App.tsx";
import SocketLayout from "@components/socket-provider/SocketLayout.tsx";
import {sec} from "./security.ts";
import {nanoid} from "@reduxjs/toolkit";
import {Realtime} from "ably";
import Spaces from "@ably/spaces";
import {SpacesProvider} from "@ably/spaces/react";
import LegalPagesApp from "./pages/LegalPages/LegalPagesApp.tsx";
import '@mantine/notifications/styles.css';

const theme = createTheme({
    defaultRadius: "xl",
    primaryColor: "teal",
    fontFamily: "Lexend, sans-serif",
});

const uri = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";
const clientId = nanoid();

export const UserContext = createContext({token: "", subtoken: "", name: "", email: "", picture: ""});

function App() {
    const [userContext, setUserContext] = useState({token: "", subtoken: "from app", name: "", email: "", picture: ""});

    const {isAuthenticated, getAccessTokenSilently, user} = useAuth0();
    const dispatch = useDispatch<AppDispatch>();


    sec.setAccessTokenSilently(getAccessTokenSilently);

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently();
                const subtoken = user?.sub ?? "";
                const name = user?.name ?? "";
                const email = user?.email ?? "";
                const picture = user?.picture ?? "";

                setUserContext({token, subtoken, name, email, picture});
                dispatch(getAuthdUserAsync({token, subtoken, name, email, picture}));
            }
        })();
    }, [isAuthenticated]);


    const client = useMemo(() => new Realtime({
        authUrl: `${uri}/api/v1/ably`,
        authMethod: "GET",
        authParams: {id: clientId},
        autoConnect: true,
        authHeaders: {Authorization: "Bearer " + userContext.token},
        clientId: clientId,
        logLevel: 0 // Logging of authorization issues disabled
    }), [userContext.token]);

    const spaces = useMemo(() => new Spaces(client), [client]);
    return (
        <UserContext.Provider value={userContext}>
            <MantineProvider theme={theme}>
                <ErrorBoundary>
                    <SpacesProvider client={spaces}>
                        <ModalsProvider>
                            <Routes>
                                /** Main Pages */
                                <Route path="/" element={<MainAppShell/>}>
                                    <Route index element={<LandingPageApp/>}/>
                                    <Route path="/profile" element={<AuthenticationGuard component={UserProfileApp}/>}/>
                                    <Route path="/create-trip" element={<CreateTripApp/>}/>
                                    {/** Explore Destination Page */}
                                    <Route path="/explore/:slug" element={<ExploreAreaApp/>}/>
                                    {/** Explore Destination Page Preview */}
                                    <Route path="/explore/:id/preview" element={<ExploreAreaPreviewApp/>}/>
                                    <Route path="/unauthorized" element={<Error401App/>}/>
                                    {/** Legal Pages */}
                                    <Route path="/legal/terms" element={<LegalPagesApp id={"terms"}/>}/>
                                    <Route path="/legal/privacy" element={<LegalPagesApp id={"privacy"}/>}/>
                                    <Route path="/legal/copyright" element={<LegalPagesApp id={"copyright"}/>}/>
                                </Route>

                                /** Trip App Pages */
                                <Route path="/trip/:uuid" element={<TripAppShell/>}>

                                    <Route path="settings" element={<TripSettingsApp/>}/>
                                    <Route element={<SocketLayout/>}>
                                        <Route path="map" element={<TripMapApp/>}/>
                                        <Route path="timeline" element={<TripTimelineApp/>}/>
                                    </Route>
                                    <Route path="overview" element={<TripOverviewApp/>}/>
                                    <Route index element={<Navigate to="overview" replace/>}/>

                                </Route>


                                /** Settings */
                                <Route path="/settings" element={<SettingsAppShell/>}>
                                    <Route index element={<ProfileSettingsApp/>}/>
                                    <Route path="profile" element={<ProfileSettingsApp/>}/>
                                    <Route path="account" element={<AccountSettingsApp/>}/>
                                    <Route path="experience" element={<ExperienceSettingsApp/>}/>
                                </Route>
                                /** Experimental */
                                <Route path="developmental" element={<TempPageApp/>}/>
                                <Route path="*" element={<Error404App/>}/>


                            </Routes>
                        </ModalsProvider>
                    </SpacesProvider>
                </ErrorBoundary>
            </MantineProvider>
        </UserContext.Provider>
    )
}

export default App;
