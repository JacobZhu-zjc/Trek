import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import DeploymentEnv from './components/DeploymentEnv.tsx';
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import {BrowserRouter} from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(

        <React.StrictMode>

                <DeploymentEnv />
                <BrowserRouter basename="/">

                    <Auth0ProviderWithHistory>
                        <Provider store={store}>
                    <App />
                        </Provider>
                    </Auth0ProviderWithHistory>
                </BrowserRouter>


        </React.StrictMode>

)
