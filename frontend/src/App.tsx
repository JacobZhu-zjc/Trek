import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const theme = createTheme({

});

function App() {

  return (
    <MantineProvider theme={theme}>
      <ErrorBoundary>
        <ModalsProvider>
          <BrowserRouter basename="/">
            <Routes>

            /** Main Pages */
              <Route path="/" element={<MainAppShell />}>
                <Route index element={<LandingPageApp />} />
                <Route path="/profile" element={<UserProfileApp />} />
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

              <Route path="*" element={<Error404App />} />
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
      </ErrorBoundary>
    </MantineProvider>
  )
}

export default App;
