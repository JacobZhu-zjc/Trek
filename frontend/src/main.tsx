import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import DeploymentEnv from './components/DeploymentEnv.tsx';
import {Auth0Provider} from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
            redirect_uri: "http://localhost:5173"
        }}
        >
        <React.StrictMode>
            <Provider store={store}>
                <DeploymentEnv />
                <App />
            </Provider>
        </React.StrictMode>
    </Auth0Provider>
)
