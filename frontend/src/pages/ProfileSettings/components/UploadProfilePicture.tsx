import { Paper, Avatar, Button, Title, Stack } from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {User} from "../../../interfaces.ts";
import {AppDispatch} from '../../../redux/store.ts';

function UploadProfilePicture() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAuthdUserAsync());
    }, []);

    const profile = useSelector((state: {user: {self: User}}) => state.user.self);

    return (
        <>
            <Stack>

                <Title order={4}>Profile Picture</Title>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">

                    <Avatar
                        src={profile.image && profile.image.source}
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
