import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";


const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <Button
                rightSection={<IconArrowRight size={16}/>}
                variant="gradient"
                gradient={{ from: 'teal', to: 'lime', deg: 90 }}
                onClick={() => logout()}
            >
                Sign Out
            </Button>
        )
    )
}

export default LogoutButton;