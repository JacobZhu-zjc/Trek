import { Paper, Avatar, Button, Title, Stack } from '@mantine/core';
import {useSelector} from "react-redux";
import {State} from "../../../../Interfaces.ts";

function UploadProfilePicture() {
    const profile = useSelector((state: State) => state.profile);

    return (
        <>
            <Stack>

                <Title order={4}>Profile Picture</Title>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">

                    <Avatar
                        src={profile.profilePicture}
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
