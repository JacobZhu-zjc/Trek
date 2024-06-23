import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import DeploymentEnv from './components/DeploymentEnv.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <DeploymentEnv />
            <App />
        </Provider>
    </React.StrictMode>,
)
