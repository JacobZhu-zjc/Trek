import {Routes, Route} from "react-router-dom";
import LandingPageApp from "./pages/LandingPage/LandingPageApp";
import AccountSettingsApp from "./pages/AccountSettings/AccountSettingsApp";
import TripDetailsApp from "./pages/TripDetails/TripDetailsApp";
import TripTimelineApp from "./pages/TripTimeline/TripTimelineApp";
import UserProfileApp from "./pages/UserProfile/UserProfileApp";
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from "@mantine/modals";
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
import {useEffect, createContext, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {AuthenticationGuard} from "./components/AuthenticationGuard";
import { useDispatch } from "react-redux";
import {getAuthdUserAsync} from "./redux/users/thunks.ts"
import {AppDispatch} from "./redux/store.ts";
const theme = createTheme({

});


export const UserContext = createContext({token: "", subtoken: "", name: "", email: "", image: ""});

function App() {
  const [userContext, setUserContext] = useState({token: "", subtoken: "from app", name: "", email: "", image: ""});
  const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("authenticated: " + isAuthenticated);
        (async () => {
          if(isAuthenticated) {
            const token = await getAccessTokenSilently();
            const subtoken = user?.sub ?? "";
            const name = user?.name ?? "";
            const email = user?.email ?? "";
            const picture = user?.picture ?? "";

            setUserContext({token, subtoken, name, email, image: picture});
            dispatch(getAuthdUserAsync({token, subtoken, name, email, picture}));
          }
    })();
  }, [isAuthenticated]);
  return (
    <UserContext.Provider value={userContext}>
    <MantineProvider theme={theme}>
      <ErrorBoundary>
        <ModalsProvider>
            <Routes>

            /** Main Pages */
              <Route path="/" element={<MainAppShell />}>
                <Route index element={<LandingPageApp />} />
                <Route path="/profile" element={<AuthenticationGuard component={UserProfileApp} />} />
                <Route path="/create-trip" element={<CreateTripApp />} />
                {/** Explore Destination Page */}
                <Route path="/explore/:slug" element={<ExploreAreaApp />} />
                {/** Explore Destination Page Preview */}
                <Route path="/explore/:id/preview" element={<ExploreAreaPreviewApp />} />
              </Route>

            /** Trip App Pages */
              <Route path="/trip/:uuid" element={<TripAppShell />}>
                <Route path="details" element={<TripDetailsApp />} />
                <Route path="timeline" element={<TripTimelineApp />} />
                <Route path="map" element={<TripMapApp />} />
                <Route path="overview" element={<TripOverviewApp />} />
              </Route>

            /** Settings */
              <Route path="/settings" element={<SettingsAppShell />}>
                <Route index element={<ProfileSettingsApp />} />
                <Route path="profile" element={<ProfileSettingsApp />} />
                <Route path="account" element={<AccountSettingsApp />} />
                <Route path="experience" element={<ExperienceSettingsApp />} />
              </Route>
            /** Experimental */
              <Route path="developmental" element={<TempPageApp />} />
              <Route path="*" element={<Error404App />} />
            </Routes>
        </ModalsProvider>
      </ErrorBoundary>
    </MantineProvider>
    </UserContext.Provider>
  )
}

export default App;
