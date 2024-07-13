import LoginButton from "../../components/LoginButton.tsx";
import LogoutButton from "../../components/LogoutButton.tsx";
import Profile from "../../components/TemporaryProfile.tsx";
import {useAuth0} from "@auth0/auth0-react"

const TempPageApp = () => {
    const { isLoading, error } = useAuth0();

    return (
        <main className="column">
            <h1>Auth0 Login Example</h1>
            {error && <p>Authentication Error</p>}
            {!error && isLoading && <p>Loading...</p>}
            {!error && !isLoading && (
                <>
                    <LoginButton />
                    <LogoutButton />
                    <Profile />
                </>
            )}
        </main>

    )
}

export default TempPageApp;