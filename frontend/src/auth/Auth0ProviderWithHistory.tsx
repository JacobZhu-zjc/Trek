import {useNavigate} from 'react-router-dom';
import {AppState, Auth0Provider} from "@auth0/auth0-react";
import { ReactNode } from 'react';

const Auth0ProviderWithHistory = ({ children }: {children: ReactNode}) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? "";
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? "";

    const navigation = useNavigate();

    const onRedirectCallback = (appState?: AppState) => {
        navigation(appState?.returnTo || window.location.pathname);
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            }}
            useRefreshTokens={true}
            cacheLocation="localstorage"
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
}

export default Auth0ProviderWithHistory;
