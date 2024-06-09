import { Paper, Avatar, Button, Title, Stack } from '@mantine/core';

function UploadProfilePicture() {
    return (
        <>
            <Stack>

                <Title order={4}>Profile Picture</Title>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">

                    <Avatar
                        src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"
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