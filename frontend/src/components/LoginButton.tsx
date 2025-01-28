import {useAuth0} from "@auth0/auth0-react";
import {Button} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";


const LoginButton = (className: { props?: string }) => {
    const {loginWithRedirect, isAuthenticated} = useAuth0();

    return (
        !isAuthenticated && (
            <Button
                rightSection={<IconArrowRight size={16}/>}
                variant="gradient"
                gradient={{from: 'teal', to: 'lime', deg: 90}}
                onClick={() => loginWithRedirect({
                    appState: {
                        returnTo: window.location.pathname
                    }
                })}
                className={className.props}
            >
                Login
            </Button>
        )
    )
}

export default LoginButton;
