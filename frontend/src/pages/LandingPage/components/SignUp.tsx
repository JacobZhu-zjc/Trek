import {Button, TextInput} from '@mantine/core';
import {IconArrowRight} from "@tabler/icons-react";
import {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const {loginWithRedirect} = useAuth0();


    return (
        <div className="flex justify-center w-full">

            <TextInput
                className="w-64 pr-4"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Button
                rightSection={<IconArrowRight size={16}/>}
                variant="gradient"
                gradient={{from: 'teal', to: 'lime', deg: 90}}
                onClick={() => loginWithRedirect({
                    appState: {
                        returnTo: window.location.pathname
                    }
                })}
            >
                Sign Up
            </Button>
        </div>

    );
};

export default SignUp;
