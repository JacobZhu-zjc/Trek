import { Paper, Avatar, Button, Title, Stack } from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import {useContext, useEffect} from "react";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {User} from "@trek-types/user.ts";
import {AppDispatch} from '../../../redux/store.ts';
import {UserContext} from '../../../App.tsx';
import {useAuth0} from "@auth0/auth0-react";

function UploadProfilePicture() {
    const {user} = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);

    useEffect(() => {
        const token = userContext.token;
        const subtoken = userContext.subtoken;
        const name = user?.name ?? "";
        const email = user?.email ?? "";
        const picture = user?.picture ?? "";
        dispatch(getAuthdUserAsync({token, subtoken, name, picture, email}));
    }, []);

    const profile = useSelector((state: {user: {self: User}}) => state.user.self);

    return (
        <>
            <Stack>

                <Title order={4}>Profile Picture</Title>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">

                    <Avatar
                        src={profile.image}
                        size={120}
                        radius={120}
                        mx="auto"
                    />
                    <Button variant="filled" fullWidth mt="md">
                        Upload Profile Picture
                    </Button>
                    <Button variant="default" fullWidth mt="md">
                        Remove Profile Picture
                    </Button>
                </Paper>

            </Stack>
        </>
    );
}

export default UploadProfilePicture;
